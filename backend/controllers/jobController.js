// backend/controllers/jobController.js
const db = require('../database/db');
const { triggerWebhook } = require('../services/jobService');

/**
 * Create a new job
 * POST /api/jobs
 */
const createJob = (req, res) => {
  const { taskName, payload, priority } = req.body;

  // Validation
  if (!taskName || !payload || !priority) {
    return res.status(400).json({ 
      error: 'Missing required fields: taskName, payload, priority' 
    });
  }

  if (!['Low', 'Medium', 'High'].includes(priority)) {
    return res.status(400).json({ 
      error: 'Priority must be Low, Medium, or High' 
    });
  }

  const query = `
    INSERT INTO jobs (taskName, payload, priority, status)
    VALUES (?, ?, ?, 'pending')
  `;

  db.run(query, [taskName, JSON.stringify(payload), priority], function (err) {
    if (err) {
      console.error('Error creating job:', err);
      return res.status(500).json({ error: 'Failed to create job' });
    }

    res.status(201).json({
      id: this.lastID,
      taskName,
      payload,
      priority,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
  });
};

/**
 * Get all jobs with optional filters
 * GET /api/jobs?status=pending&priority=High
 */
const getJobs = (req, res) => {
  const { status, priority } = req.query;
  let query = 'SELECT * FROM jobs';
  const params = [];

  if (status || priority) {
    const conditions = [];
    
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    
    if (priority) {
      conditions.push('priority = ?');
      params.push(priority);
    }
    
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY createdAt DESC LIMIT 100';

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching jobs:', err);
      return res.status(500).json({ error: 'Failed to fetch jobs' });
    }

    const jobs = rows.map(row => ({
      ...row,
      payload: JSON.parse(row.payload),
      webhookResponse: row.webhookResponse ? JSON.parse(row.webhookResponse) : null
    }));

    res.json(jobs);
  });
};

/**
 * Get a single job by ID
 * GET /api/jobs/:id
 */
const getJobById = (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM jobs WHERE id = ?';

  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Error fetching job:', err);
      return res.status(500).json({ error: 'Failed to fetch job' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({
      ...row,
      payload: JSON.parse(row.payload),
      webhookResponse: row.webhookResponse ? JSON.parse(row.webhookResponse) : null
    });
  });
};

/**
 * Run a job
 * POST /api/run-job/:id
 */
const runJob = async (req, res) => {
  const { id } = req.params;

  // Get job from database
  const query = 'SELECT * FROM jobs WHERE id = ?';

  db.get(query, [id], async (err, job) => {
    if (err) {
      console.error('Error fetching job:', err);
      return res.status(500).json({ error: 'Failed to fetch job' });
    }

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Update status to running
    db.run(
      'UPDATE jobs SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      ['running', id],
      (err) => {
        if (err) console.error('Error updating job status:', err);
      }
    );

    // Send immediate response
    res.json({
      id,
      message: 'Job execution started',
      status: 'running'
    });

    // Simulate job processing (3 seconds)
    setTimeout(async () => {
      try {
        console.log(`\n🔄 Processing job ${id}: ${job.taskName}`);

        // Update status to completed
        db.run(
          'UPDATE jobs SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
          ['completed', id],
          (err) => {
            if (err) console.error('Error updating job status to completed:', err);
          }
        );

        // Prepare webhook payload
        const webhookPayload = {
          jobId: job.id,
          taskName: job.taskName,
          priority: job.priority,
          payload: JSON.parse(job.payload),
          completedAt: new Date().toISOString()
        };

        // Trigger webhook
        console.log('🌐 Triggering webhook...');
        const webhookResponse = await triggerWebhook(webhookPayload);

        // Store webhook response in database
        db.run(
          'UPDATE jobs SET webhookResponse = ? WHERE id = ?',
          [JSON.stringify(webhookResponse), id],
          (err) => {
            if (err) console.error('Error storing webhook response:', err);
            else console.log('✅ Job completed and webhook triggered\n');
          }
        );
      } catch (error) {
        console.error('❌ Job processing error:', error.message);
        db.run(
          'UPDATE jobs SET status = ? WHERE id = ?',
          ['failed', id]
        );
      }
    }, 3000);
  });
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  runJob
};