# Webhooks API

Configure and manage webhook endpoints for real-time event notifications.

## Endpoints

### List Webhooks

Retrieve all configured webhooks.

```http
GET /webhooks
```

#### Example Response

```json
{
  "data": [
    {
      "id": "wh_123",
      "url": "https://your-app.com/webhooks/flowforge",
      "events": ["message.sent", "message.delivered", "message.failed"],
      "status": "active",
      "secret": "whsec_***",
      "created_at": "2024-01-15T10:00:00Z",
      "last_delivery": "2024-01-15T16:45:00Z",
      "delivery_stats": {
        "total_deliveries": 1250,
        "successful_deliveries": 1248,
        "failed_deliveries": 2,
        "success_rate": 99.8
      }
    }
  ]
}
```

### Create Webhook

Create a new webhook endpoint.

```http
POST /webhooks
```

#### Request Body

```json
{
  "url": "https://your-app.com/webhooks/flowforge",
  "events": [
    "message.sent",
    "message.delivered",
    "message.failed",
    "flow.activated"
  ],
  "secret": "your-webhook-secret",
  "description": "Main webhook for message events"
}
```

#### Example Response

```json
{
  "id": "wh_456",
  "url": "https://your-app.com/webhooks/flowforge",
  "events": ["message.sent", "message.delivered", "message.failed", "flow.activated"],
  "status": "active",
  "secret": "whsec_***",
  "created_at": "2024-01-15T17:00:00Z",
  "description": "Main webhook for message events"
}
```

### Update Webhook

Update webhook configuration.

```http
PUT /webhooks/{webhook_id}
```

### Delete Webhook

Delete a webhook endpoint.

```http
DELETE /webhooks/{webhook_id}
```

### Test Webhook

Send a test event to verify webhook configuration.

```http
POST /webhooks/{webhook_id}/test
```

#### Example Response

```json
{
  "webhook_id": "wh_123",
  "test_result": {
    "status": "success",
    "response_code": 200,
    "response_time_ms": 245,
    "timestamp": "2024-01-15T17:15:00Z"
  }
}
```

## Webhook Events

### Message Events

#### message.sent
Triggered when a message is successfully sent to a vendor.

```json
{
  "event": "message.sent",
  "data": {
    "message_id": "msg_789",
    "flow_id": "flow_123",
    "recipient": "+1234567890",
    "vendor": "twilio",
    "vendor_message_id": "SM1234567890",
    "cost": 0.045,
    "sent_at": "2024-01-15T16:45:15Z"
  },
  "timestamp": "2024-01-15T16:45:15Z",
  "webhook_id": "wh_123"
}
```

#### message.delivered
Triggered when a message is delivered to the recipient.

```json
{
  "event": "message.delivered",
  "data": {
    "message_id": "msg_789",
    "flow_id": "flow_123",
    "recipient": "+1234567890",
    "vendor": "twilio",
    "vendor_message_id": "SM1234567890",
    "delivered_at": "2024-01-15T16:45:28Z",
    "delivery_time_ms": 13000
  },
  "timestamp": "2024-01-15T16:45:28Z",
  "webhook_id": "wh_123"
}
```

#### message.failed
Triggered when a message fails to deliver.

```json
{
  "event": "message.failed",
  "data": {
    "message_id": "msg_790",
    "flow_id": "flow_123",
    "recipient": "+1234567890",
    "vendor": "twilio",
    "error_code": "INVALID_NUMBER",
    "error_message": "The recipient number is invalid",
    "failed_at": "2024-01-15T16:46:00Z",
    "retry_count": 2,
    "will_retry": false
  },
  "timestamp": "2024-01-15T16:46:00Z",
  "webhook_id": "wh_123"
}
```

### Flow Events

#### flow.activated
```json
{
  "event": "flow.activated",
  "data": {
    "flow_id": "flow_123",
    "name": "SMS Marketing Flow",
    "channel": "sms",
    "activated_by": "user_456",
    "activated_at": "2024-01-15T14:20:00Z"
  },
  "timestamp": "2024-01-15T14:20:00Z",
  "webhook_id": "wh_123"
}
```

## Webhook Security

### Signature Verification

FlowForge signs webhook payloads with your webhook secret. Verify signatures to ensure authenticity.

#### Signature Header
```http
X-FlowForge-Signature: sha256=<signature>
```

#### Verification Example (Node.js)
```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
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
```

### Retry Policy

- **Retry Attempts**: Up to 5 attempts
- **Retry Intervals**: 1s, 5s, 25s, 125s, 625s
- **Timeout**: 30 seconds per attempt
- **Success Criteria**: HTTP 2xx response

### Best Practices

1. **Idempotency**: Handle duplicate events gracefully
2. **Fast Response**: Respond within 30 seconds
3. **Signature Verification**: Always verify webhook signatures
4. **Error Handling**: Return appropriate HTTP status codes
5. **Logging**: Log webhook events for debugging