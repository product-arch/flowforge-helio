# Getting Started with FlowForge API

## Quick Start Guide

### 1. Get Your API Key

1. Sign up for a FlowForge account at [https://app.flowforge.com](https://app.flowforge.com)
2. Navigate to **Settings** > **API Keys**
3. Click **Generate New Key**
4. Copy and securely store your API key

### 2. Make Your First API Call

Test your API key with a simple request:

```bash
curl -X GET "https://api.flowforge.com/v1/flows" \
  -H "Authorization: Bearer your-api-token"
```

### 3. Create Your First Flow

```bash
curl -X POST "https://api.flowforge.com/v1/flows" \
  -H "Authorization: Bearer your-api-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My First SMS Flow",
    "description": "A simple SMS routing flow",
    "channel": "sms",
    "configuration": {
      "nodes": [
        {
          "id": "start-1",
          "type": "start",
          "position": { "x": 100, "y": 100 },
          "data": { "label": "Start", "channel": "sms" }
        },
        {
          "id": "sms-1",
          "type": "sms",
          "position": { "x": 300, "y": 100 },
          "data": {
            "label": "SMS Channel",
            "senderId": "FLOWFORGE",
            "messageType": "transactional"
          }
        },
        {
          "id": "terminal-1",
          "type": "terminal",
          "position": { "x": 500, "y": 100 },
          "data": { "label": "Sent", "state": "sent" }
        }
      ],
      "edges": [
        {
          "id": "edge-1",
          "source": "start-1",
          "target": "sms-1",
          "type": "custom"
        },
        {
          "id": "edge-2",
          "source": "sms-1",
          "target": "terminal-1",
          "type": "custom"
        }
      ]
    }
  }'
```

### 4. Activate Your Flow

```bash
curl -X POST "https://api.flowforge.com/v1/flows/{flow_id}/activate" \
  -H "Authorization: Bearer your-api-token"
```

### 5. Send Your First Message

```bash
curl -X POST "https://api.flowforge.com/v1/flows/{flow_id}/messages" \
  -H "Authorization: Bearer your-api-token" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "+1234567890",
    "message": {
      "text": "Hello from FlowForge! This is your first API message."
    },
    "metadata": {
      "campaign_id": "FIRST_TEST"
    }
  }'
```

## Common Use Cases

### 1. Transactional SMS
Perfect for order confirmations, OTPs, and notifications.

```javascript
const response = await fetch('https://api.flowforge.com/v1/flows/flow_123/messages', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-api-token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recipient: '+1234567890',
    message: {
      text: 'Your OTP is: 123456. Valid for 5 minutes.',
      template_id: 'otp_template'
    },
    metadata: {
      campaign_id: 'OTP_VERIFICATION',
      priority: 'high'
    }
  })
});
```

### 2. Marketing Campaigns
Bulk messaging with personalization.

```javascript
const messages = customers.map(customer => ({
  recipient: customer.phone,
  message: {
    template_id: 'marketing_template',
    variables: {
      customer_name: customer.name,
      offer_code: customer.offer_code
    }
  },
  metadata: {
    campaign_id: 'SUMMER_SALE_2024',
    user_segment: customer.segment
  }
}));

const response = await fetch('https://api.flowforge.com/v1/flows/flow_123/messages/bulk', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-api-token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    messages: messages,
    options: {
      batch_size: 100,
      rate_limit: 10
    }
  })
});
```

### 3. Multi-Channel Communication
Route messages across different channels.

```javascript
// SMS Flow
await sendMessage('sms_flow_id', {
  recipient: '+1234567890',
  message: { text: 'SMS notification' }
});

// WhatsApp Flow
await sendMessage('whatsapp_flow_id', {
  recipient: '+1234567890',
  message: { 
    template_id: 'whatsapp_template',
    variables: { name: 'John' }
  }
});

// Email Flow
await sendMessage('email_flow_id', {
  recipient: 'john@example.com',
  message: {
    template_id: 'email_template',
    variables: { name: 'John', order_id: '12345' }
  }
});
```

## SDKs and Code Examples

### Node.js SDK

```bash
npm install @flowforge/node-sdk
```

```javascript
import { FlowForge } from '@flowforge/node-sdk';

const client = new FlowForge({
  apiKey: 'your-api-token',
  baseURL: 'https://api.flowforge.com/v1'
});

// Send a message
const message = await client.messages.send('flow_123', {
  recipient: '+1234567890',
  message: {
    text: 'Hello from FlowForge SDK!'
  }
});

// Get flow analytics
const analytics = await client.flows.getAnalytics('flow_123', {
  period: '24h'
});
```

### Python SDK

```bash
pip install flowforge-python
```

```python
from flowforge import FlowForge

client = FlowForge(api_key='your-api-token')

# Send a message
message = client.messages.send(
    flow_id='flow_123',
    recipient='+1234567890',
    message={'text': 'Hello from FlowForge Python SDK!'}
)

# Get flow analytics
analytics = client.flows.get_analytics('flow_123', period='24h')
```

### cURL Examples

```bash
# Set your API token as an environment variable
export FLOWFORGE_API_TOKEN="your-api-token"
export FLOWFORGE_BASE_URL="https://api.flowforge.com/v1"

# List all flows
curl -X GET "$FLOWFORGE_BASE_URL/flows" \
  -H "Authorization: Bearer $FLOWFORGE_API_TOKEN"

# Send a message
curl -X POST "$FLOWFORGE_BASE_URL/flows/flow_123/messages" \
  -H "Authorization: Bearer $FLOWFORGE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "+1234567890",
    "message": {
      "text": "Test message from cURL"
    }
  }'
```

## Error Handling Best Practices

### 1. Implement Retry Logic

```javascript
async function sendMessageWithRetry(flowId, messageData, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`/flows/${flowId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      });

      if (response.ok) {
        return await response.json();
      }

      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`Client error: ${response.status}`);
      }

      // Retry on server errors (5xx) or network issues
      if (attempt === maxRetries) {
        throw new Error(`Max retries exceeded: ${response.status}`);
      }

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
    }
  }
}
```

### 2. Handle Rate Limits

```javascript
async function handleRateLimit(response) {
  if (response.status === 429) {
    const resetTime = response.headers.get('X-RateLimit-Reset');
    const waitTime = (parseInt(resetTime) * 1000) - Date.now();
    
    if (waitTime > 0) {
      console.log(`Rate limited. Waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}
```

## Testing Your Integration

### 1. Use the Simulation Endpoint

Test your flows without sending real messages:

```javascript
const simulation = await client.flows.simulate('flow_123', {
  test_parameters: {
    app_id: 'TEST_APP',
    channel: 'sms',
    message_type: 'transactional'
  }
});

console.log('Simulation results:', simulation.results);
```

### 2. Monitor Webhook Events

Set up a webhook endpoint to receive real-time updates:

```javascript
// Express.js webhook handler
app.post('/webhooks/flowforge', (req, res) => {
  const signature = req.headers['x-flowforge-signature'];
  const payload = JSON.stringify(req.body);
  
  // Verify signature
  if (!verifyWebhookSignature(payload, signature, webhookSecret)) {
    return res.status(401).send('Invalid signature');
  }
  
  const event = req.body;
  
  switch (event.event) {
    case 'message.delivered':
      console.log(`Message ${event.data.message_id} delivered`);
      break;
    case 'message.failed':
      console.log(`Message ${event.data.message_id} failed: ${event.data.error_message}`);
      break;
  }
  
  res.status(200).send('OK');
});
```

## Next Steps

1. **Explore the API**: Try different endpoints using the interactive documentation
2. **Set up Webhooks**: Configure real-time event notifications
3. **Implement Error Handling**: Add robust error handling and retry logic
4. **Monitor Performance**: Use analytics endpoints to track your usage
5. **Scale Up**: Implement bulk messaging for high-volume use cases

## Support Resources

- **Interactive Documentation**: [https://api.flowforge.com/docs](https://api.flowforge.com/docs)
- **SDK Documentation**: [https://docs.flowforge.com/sdks](https://docs.flowforge.com/sdks)
- **Community Forum**: [https://community.flowforge.com](https://community.flowforge.com)
- **Support Email**: api-support@flowforge.com
- **Status Page**: [https://status.flowforge.com](https://status.flowforge.com)