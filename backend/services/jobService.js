// backend/services/jobService.js
const axios = require('axios');

/**
 * Trigger outbound webhook when job completes
 * @param {Object} payload - Job completion data
 * @returns {Promise<Object>} Webhook response
 */
const triggerWebhook = async (payload) => {
  const webhookUrl = process.env.WEBHOOK_URL || 'https://webhook.site/3035efd6-f68d-4052-9418-abceebd1c40e';

  try {
    console.log(`📤 Sending webhook to: ${webhookUrl}`);
    
    const response = await axios.post(webhookUrl, payload, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'JobScheduler/1.0'
      }
    });

    console.log(`✅ Webhook sent successfully (Status: ${response.status})`);

    return {
      status: 'success',
      statusCode: response.status,
      message: 'Webhook delivered',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`❌ Webhook error: ${error.message}`);

    return {
      status: 'failed',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

module.exports = {
  triggerWebhook
};