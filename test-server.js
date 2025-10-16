const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/test', (req, res) => {
  res.json({ message: 'Test server working!' });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});

// Keep process alive
process.on('SIGINT', () => {
  console.log('Server shutting down...');
  process.exit(0);
});