require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config');

const app = express();
const PORT = config.PORT;

if (!config.YOUTUBE_API_KEY) {
  console.error('ERROR: YOUTUBE_API_KEY environment variable is not set');
  process.exit(1);
}

// Middleware
app.use(helmet());

const corsOptions = {
  origin: config.NODE_ENV === 'production'
    ? (process.env.CLIENT_URL || 'https://pranayy1.github.io')
    : true,
  credentials: config.NODE_ENV === 'production'
};
app.use(cors(corsOptions));

app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Routes
app.use('/api/search', require('./routes/search'));
app.use('/api/trending', require('./routes/trending'));
app.use('/api/audio', require('./routes/audio'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
