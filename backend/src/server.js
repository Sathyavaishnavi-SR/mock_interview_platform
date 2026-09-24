const express = require('express');
const cors = require('cors');
require('dotenv').config();

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
    timestamp: new Date().toISOString()
  });
});

// Architectural placeholder for future route modules:
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/interviews', require('./routes/interviewRoutes'));
// app.use('/api/submissions', require('./routes/submissionRoutes'));
// app.use('/api/results', require('./routes/resultRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

