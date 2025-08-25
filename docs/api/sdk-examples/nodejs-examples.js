/**
 * FlowForge API - Node.js Examples
 * 
 * This file contains practical examples of using the FlowForge API
 * with Node.js. These examples demonstrate common use cases and
 * best practices for integration.
 */

const fetch = require('node-fetch');
const crypto = require('crypto');

class FlowForgeClient {
  constructor(apiKey, baseURL = 'https://api.flowforge.com/v1') {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      // Handle rate limiting
      if (response.status === 429) {
        const resetTime = response.headers.get('X-RateLimit-Reset');
        const waitTime = (parseInt(resetTime) * 1000) - Date.now();
        
        if (waitTime > 0) {
          console.log(`Rate limited. Waiting ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          return this.request(endpoint, options); // Retry
        }
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`API Error: ${error.error.message}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Flow Management
  async listFlows(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/flows${queryString ? `?${queryString}` : ''}`);
  }

  async getFlow(flowId) {
    return this.request(`/flows/${flowId}`);
  }

  async createFlow(flowData) {
    return this.request('/flows', {
      method: 'POST',
      body: JSON.stringify(flowData)
    });
  }

  async updateFlow(flowId, updates) {
    return this.request(`/flows/${flowId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async activateFlow(flowId) {
    return this.request(`/flows/${flowId}/activate`, {
      method: 'POST'
    });
  }

  async deactivateFlow(flowId) {
    return this.request(`/flows/${flowId}/deactivate`, {
      method: 'POST'
    });
  }

  async simulateFlow(flowId, testParams) {
    return this.request(`/flows/${flowId}/simulate`, {
      method: 'POST',
      body: JSON.stringify({ test_parameters: testParams })
    });
  }

  // Message Operations
  async sendMessage(flowId, messageData) {
    return this.request(`/flows/${flowId}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData)
    });
  }

  async sendBulkMessages(flowId, messages, options = {}) {
    return this.request(`/flows/${flowId}/messages/bulk`, {
      method: 'POST',
      body: JSON.stringify({ messages, options })
    });
  }

  async getMessageStatus(messageId) {
    return this.request(`/messages/${messageId}`);
  }

  // Analytics
  async getFlowAnalytics(flowId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/flows/${flowId}/analytics${queryString ? `?${queryString}` : ''}`);
  }

  async getGlobalAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/analytics${queryString ? `?${queryString}` : ''}`);
  }

  // Vendor Management
  async listVendors(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/vendors${queryString ? `?${queryString}` : ''}`);
  }

  async getVendorHealth(vendorId) {
    return this.request(`/vendors/${vendorId}/health`);
  }

  // Webhook Management
  async listWebhooks() {
    return this.request('/webhooks');
  }

  async createWebhook(webhookData) {
    return this.request('/webhooks', {
      method: 'POST',
      body: JSON.stringify(webhookData)
    });
  }

  // Utility Methods
  verifyWebhookSignature(payload, signature, secret) {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex');
    
    const receivedSignature = signature.replace('sha256=', '');
    
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(receivedSignature, 'hex')
    );
  }
}

// Example Usage

async function examples() {
  const client = new FlowForgeClient('your-api-token');

  try {
    // 1. Create a simple SMS flow
    console.log('Creating SMS flow...');
    const flow = await client.createFlow({
      name: 'Order Confirmation SMS',
      description: 'Send SMS confirmations for new orders',
      channel: 'sms',
      configuration: {
        nodes: [
          {
            id: 'start-1',
            type: 'start',
            position: { x: 100, y: 100 },
            data: { label: 'Start', channel: 'sms' }
          },
          {
            id: 'sms-1',
            type: 'sms',
            position: { x: 300, y: 100 },
            data: {
              label: 'SMS Channel',
              senderId: 'YOURSTORE',
              messageType: 'transactional',
              selectedVendors: ['twilio', 'msg91']
            }
          },
          {
            id: 'terminal-1',
            type: 'terminal',
            position: { x: 500, y: 100 },
            data: { label: 'Sent', state: 'sent' }
          }
        ],
        edges: [
          { id: 'edge-1', source: 'start-1', target: 'sms-1', type: 'custom' },
          { id: 'edge-2', source: 'sms-1', target: 'terminal-1', type: 'custom' }
        ]
      }
    });
    console.log('Flow created:', flow.id);

    // 2. Activate the flow
    console.log('Activating flow...');
    await client.activateFlow(flow.id);
    console.log('Flow activated successfully');

    // 3. Send a test message
    console.log('Sending test message...');
    const message = await client.sendMessage(flow.id, {
      recipient: '+1234567890',
      message: {
        text: 'Your order #12345 has been confirmed! Thank you for your purchase.',
        template_id: 'order_confirmation'
      },
      metadata: {
        order_id: '12345',
        customer_id: 'cust_789',
        campaign_id: 'ORDER_CONFIRMATIONS'
      }
    });
    console.log('Message sent:', message.message_id);

    // 4. Check message status
    setTimeout(async () => {
      const status = await client.getMessageStatus(message.message_id);
      console.log('Message status:', status.status);
    }, 5000);

    // 5. Get flow analytics
    const analytics = await client.getFlowAnalytics(flow.id, {
      period: '24h',
      granularity: 'hour'
    });
    console.log('Flow analytics:', analytics.summary);

    // 6. Bulk message example
    const customers = [
      { phone: '+1234567890', name: 'John Doe', order_id: '12345' },
      { phone: '+0987654321', name: 'Jane Smith', order_id: '12346' }
    ];

    const bulkMessages = customers.map(customer => ({
      recipient: customer.phone,
      message: {
        template_id: 'order_confirmation',
        variables: {
          customer_name: customer.name,
          order_id: customer.order_id
        }
      },
      metadata: {
        customer_id: customer.phone,
        campaign_id: 'BULK_ORDER_CONFIRMATIONS'
      }
    }));

    const bulkResult = await client.sendBulkMessages(flow.id, bulkMessages, {
      batch_size: 100,
      rate_limit: 10
    });
    console.log('Bulk messages queued:', bulkResult.batch_id);

  } catch (error) {
    console.error('Example failed:', error.message);
  }
}

// Webhook handler example (Express.js)
function setupWebhookHandler(app, webhookSecret) {
  app.post('/webhooks/flowforge', express.raw({ type: 'application/json' }), (req, res) => {
    const signature = req.headers['x-flowforge-signature'];
    const payload = req.body.toString();

    // Verify webhook signature
    const client = new FlowForgeClient('dummy-key');
    if (!client.verifyWebhookSignature(payload, signature, webhookSecret)) {
      console.error('Invalid webhook signature');
      return res.status(401).send('Invalid signature');
    }

    const event = JSON.parse(payload);
    console.log('Received webhook event:', event.event);

    // Handle different event types
    switch (event.event) {
      case 'message.sent':
        console.log(`Message ${event.data.message_id} sent via ${event.data.vendor}`);
        // Update your database, send notifications, etc.
        break;

      case 'message.delivered':
        console.log(`Message ${event.data.message_id} delivered in ${event.data.delivery_time_ms}ms`);
        // Mark as delivered in your system
        break;

      case 'message.failed':
        console.error(`Message ${event.data.message_id} failed: ${event.data.error_message}`);
        // Handle failure, maybe retry or alert
        break;

      case 'flow.activated':
        console.log(`Flow ${event.data.flow_id} activated`);
        break;

      default:
        console.log('Unknown event type:', event.event);
    }

    res.status(200).send('OK');
  });
}

// Error handling with retry logic
async function sendMessageWithRetry(client, flowId, messageData, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await client.sendMessage(flowId, messageData);
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error.message);
      
      // Don't retry on client errors (4xx)
      if (error.message.includes('400') || error.message.includes('401')) {
        throw error;
      }

      if (attempt === maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
      }

      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Export for use in other modules
module.exports = {
  FlowForgeClient,
  setupWebhookHandler,
  sendMessageWithRetry,
  examples
};

// Run examples if this file is executed directly
if (require.main === module) {
  examples();
}