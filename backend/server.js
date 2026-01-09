require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize database
require('./database/db');

// Import routes
const jobRoutes = require('./routes/jobRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', jobRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Job Scheduler API running',
    version: '1.0.0',
    endpoints: {
      createJob: 'POST /api/jobs',
      listJobs: 'GET /api/jobs',
      getJob: 'GET /api/jobs/:id',
      runJob: 'POST /api/run-job/:id'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 Job Scheduler API is ready\n`);
});