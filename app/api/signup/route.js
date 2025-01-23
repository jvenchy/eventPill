// signup.js
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

function generateAuthCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return new Response(JSON.stringify({ error: 'Please provide a token' }), { status: 401 });

  try {
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 403 });

      const body = await request.json();
      const { email } = body;

      if (!email) {
        return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof email !== 'string' || !emailRegex.test(email) || email.length > 254) {
        return new Response(JSON.stringify({ error: 'Email must be valid and not exceed 254 characters' }), { status: 400 });
      }

      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return new Response(JSON.stringify({ error: 'An account with this email already exists' }), { status: 400 });
      }

      const authCode = generateAuthCode();
      const newUser = await prisma.user.create({
        data: {
          email,
          authCode,
        },
      });

      const sendEmailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sendEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email, authCode }),
      });

      if (!sendEmailResponse.ok) {
        const errorText = await sendEmailResponse.text();
        await logError(new Error(`Failed to send email: ${errorText}`), '/api/signup');
        return new Response(JSON.stringify({ error: 'Failed to send authentication code. Please try again later.' }), { status: 500 });
      }

      return new Response(JSON.stringify({
        message: 'Sign-up successful. Authentication code sent to email.',
        user: { email: newUser.email },
      }), { status: 201 });
    });
  } catch (error) {
    await logError(error, '/api/signup');
    return new Response(JSON.stringify({ error: 'An error occurred during sign-up. Please try again later.' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}