// sendEmail.js
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
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
      const { email, authCode } = body;

      if (!email || !authCode) {
        return new Response(JSON.stringify({ error: 'Email and authentication code are required' }), { status: 400 });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof email !== 'string' || !emailRegex.test(email) || email.length > 254) {
        return new Response(JSON.stringify({ error: 'Email must be valid and not exceed 254 characters' }), { status: 400 });
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your eventPill Verification Code',
        text: `Your verification code is: ${authCode}`,
      };

      await transporter.sendMail(mailOptions);
      return new Response(JSON.stringify({ success: true, message: 'Verification code sent successfully' }), { status: 200 });
    });
  } catch (error) {
    await logError(error, '/api/sendEmail');
    return new Response(JSON.stringify({ error: 'An error occurred while sending the verification code. Please try again later.' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}