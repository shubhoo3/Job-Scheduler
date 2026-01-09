// backend/routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

/**
 * Job Routes
 */

// Create a new job
router.post('/jobs', jobController.createJob);

// Get all jobs (with optional filters)
router.get('/jobs', jobController.getJobs);

// Get a specific job by ID
router.get('/jobs/:id', jobController.getJobById);

// Run a job
router.post('/run-job/:id', jobController.runJob);

module.exports = router;