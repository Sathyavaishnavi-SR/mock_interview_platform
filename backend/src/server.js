const path = require('path');
// 1. Load environment variables first with explicit path to backend/.env
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// 2. Startup environment validation check
const requiredEnvVars = [
  { key: 'MONGODB_URI', critical: true },
  { key: 'JWT_SECRET', critical: true },
  { key: 'GMAIL_USER', critical: false },
  { key: 'GMAIL_APP_PASSWORD', critical: false },
  { key: 'GROQ_API_KEY', critical: false },
  { key: 'GROQ_MODEL', critical: false },
];

function validateEnv() {
  const missingCritical = [];
  const missingOptional = [];

  for (const { key, critical } of requiredEnvVars) {
    const val = process.env[key];
    const isMissing = !val || val === 'your_' + key.toLowerCase() || val.includes('placeholder') || val === 'your_groq_api_key_here';
    if (isMissing) {
      if (critical) {
        missingCritical.push(key);
      } else {
        missingOptional.push(key);
      }
    }
  }

  if (missingCritical.length > 0) {
    console.error(`[CRITICAL] Missing required environment variables: ${missingCritical.join(', ')}`);
    console.error('The server cannot start without these variables. Please configure backend/.env.');
    process.exit(1);
  }

  if (missingOptional.length > 0) {
    console.warn(`[WARNING] Missing optional/feature environment variables: ${missingOptional.join(', ')}`);
    console.warn('Features dependent on these services (e.g. AI interviews or email verification) will not function.');
  } else {
    console.log('[ENV] All required environment variables are configured.');
  }
}

validateEnv();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend server is running correctly.',
    timestamp: new Date().toISOString(),
  });
});

// Routes
const userRoutes = require('./routes/userRoutes');
const interviewRoutes = require('./routes/interviewRoutes');

app.use('/api/auth', userRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api', userRoutes);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (statusCode === 500) {
    console.error('Unhandled Server Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
