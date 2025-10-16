const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

console.log('Starting server...');

try {
  require('dotenv').config();
  console.log('Loaded dotenv');
} catch (err) {
  console.log('No .env file found, using defaults');
}

const config = require('./config');
console.log('Loaded config:', config);

const app = express();
const PORT = process.env.PORT || config.PORT;

console.log('Setting up middleware...');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

console.log('Loading routes...');

// Routes
try {
  const searchRoute = require('./routes/search');
  app.use('/api/search', searchRoute);
  console.log('✅ Search route loaded');
} catch (err) {
  console.error('❌ Error loading search route:', err.message);
}

try {
  const trendingRoute = require('./routes/trending');
  app.use('/api/trending', trendingRoute);
  console.log('✅ Trending route loaded');
} catch (err) {
  console.error('❌ Error loading trending route:', err.message);
}

try {
  const audioRoute = require('./routes/audio');
  app.use('/api/audio', audioRoute);
  console.log('✅ Audio route loaded');
} catch (err) {
  console.error('❌ Error loading audio route:', err.message);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

console.log('Starting server on port', PORT);

app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  console.log(`✅ Server running on port ${PORT}`);
});

// Error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});