// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Create a new job
 * @param {Object} data - Job data (taskName, payload, priority)
 * @returns {Promise<Object>} Created job
 */
export const createJob = (data) => {
  return api.post('/jobs', data);
};

/**
 * Get all jobs with optional filters
 * @param {Object} filters - Filter options (status, priority)
 * @returns {Promise<Array>} List of jobs
 */
export const getJobs = (filters = {}) => {
  return api.get('/jobs', { params: filters });
};

/**
 * Get a single job by ID
 * @param {number} id - Job ID
 * @returns {Promise<Object>} Job details
 */
export const getJobById = (id) => {
  return api.get(`/jobs/${id}`);
};

/**
 * Run a job
 * @param {number} id - Job ID
 * @returns {Promise<Object>} Job execution response
 */
export const runJob = (id) => {
  return api.post(`/run-job/${id}`);
};

export default api;