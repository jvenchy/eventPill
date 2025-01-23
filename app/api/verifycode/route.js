// verifyCode.js
const { PrismaClient } = require('@prisma/client');
const { MongoClient } = require('mongodb');
const authenticateToken = require('../authmiddleware');
const limiter = require('../rateLimiter');

const prisma = new PrismaClient();
const mongoClient = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function logError(error, endpoint) {
  try {
    await mongoClient.connect();
    const database = mongoClient.db('errorLogs');
    const collection = database.collection('errors');
    await collection.insertOne({
      timestamp: new Date(),
      endpoint,
      error: error.message,
      stack: error.stack
    });
  } catch (logError) {
    console.error('Failed to log error:', logError);
  } finally {
    await mongoClient.close();
  }
}

export async function POST(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return new Response(JSON.stringify({ error: 'Please provide a token' }), { status: 401 });

  try {
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 403 });

      const body = await request.json();
      const { authCode } = body;

      if (!authCode) {
        return new Response(JSON.stringify({ error: 'Authentication code is required' }), { status: 400 });
      }

      const user = await prisma.user.findFirst({
        where: {
          authCode,
        },
      });

      if (!user) {
        return new Response(JSON.stringify({ error: 'Invalid code' }), { status: 400 });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { authCode: null },
      });

      return new Response(JSON.stringify({ success: true, message: 'Code verified successfully' }), { status: 200 });
    });
  } catch (error) {
    await logError(error, '/api/verifyCode');
    return new Response(JSON.stringify({ error: 'An error occurred while verifying the code. Please try again later.' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}