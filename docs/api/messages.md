# Messages API

Send and track messages through your configured flows.

## Endpoints

### Send Message

Send a message through a specific flow.

```http
POST /flows/{flow_id}/messages
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `flow_id` | string | Yes | Flow ID to process the message |

#### Request Body

```json
{
  "recipient": "+1234567890",
  "message": {
    "text": "Hello! This is a test message from FlowForge.",
    "template_id": "welcome_template_v1",
    "variables": {
      "customer_name": "John Doe",
      "order_id": "ORD-12345"
    }
  },
  "metadata": {
    "campaign_id": "SUMMER_SALE_2024",
    "user_segment": "premium_customers",
    "priority": "high"
  },
  "options": {
    "schedule_at": "2024-01-15T18:00:00Z",
    "retry_attempts": 3,
    "callback_url": "https://your-app.com/webhooks/message-status"
  }
}
```

#### Example Request

```bash
curl -X POST "https://api.flowforge.com/v1/flows/flow_123/messages" \
  -H "Authorization: Bearer your-api-token" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "+1234567890",
    "message": {
      "text": "Your order #12345 has been confirmed!",
      "template_id": "order_confirmation"
    },
    "metadata": {
      "campaign_id": "ORDER_CONFIRMATIONS",
      "priority": "high"
    }
  }'
```

#### Example Response

```json
{
  "message_id": "msg_789",
  "flow_id": "flow_123",
  "recipient": "+1234567890",
  "status": "queued",
  "created_at": "2024-01-15T16:45:00Z",
  "estimated_delivery": "2024-01-15T16:45:30Z",
  "routing": {
    "selected_vendor": "twilio",
    "routing_reason": "least_cost",
    "estimated_cost": 0.045
  },
  "tracking": {
    "tracking_id": "trk_456",
    "webhook_url": "https://your-app.com/webhooks/message-status"
  }
}
```

### Get Message Status

Retrieve the current status of a message.

```http
GET /messages/{message_id}
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message_id` | string | Yes | Unique message identifier |

#### Example Request

```bash
curl -X GET "https://api.flowforge.com/v1/messages/msg_789" \
  -H "Authorization: Bearer your-api-token"
```

#### Example Response

```json
{
  "message_id": "msg_789",
  "flow_id": "flow_123",
  "recipient": "+1234567890",
  "status": "delivered",
  "created_at": "2024-01-15T16:45:00Z",
  "sent_at": "2024-01-15T16:45:15Z",
  "delivered_at": "2024-01-15T16:45:28Z",
  "message": {
    "text": "Your order #12345 has been confirmed!",
    "template_id": "order_confirmation"
  },
  "routing": {
    "selected_vendor": "twilio",
    "routing_reason": "least_cost",
    "actual_cost": 0.045,
    "attempts": [
      {
        "vendor": "twilio",
        "status": "delivered",
        "timestamp": "2024-01-15T16:45:28Z",
        "vendor_message_id": "SM1234567890",
        "cost": 0.045
      }
    ]
  },
  "metadata": {
    "campaign_id": "ORDER_CONFIRMATIONS",
    "priority": "high"
  }
}
```

### List Messages

Retrieve messages for a specific flow.

```http
GET /flows/{flow_id}/messages
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Number of messages to return (1-100, default: 20) |
| `cursor` | string | No | Pagination cursor |
| `status` | string | No | Filter by status: `queued`, `sent`, `delivered`, `failed` |
| `sent_after` | string | No | ISO 8601 timestamp |
| `sent_before` | string | No | ISO 8601 timestamp |

#### Example Response

```json
{
  "data": [
    {
      "message_id": "msg_789",
      "recipient": "+1234567890",
      "status": "delivered",
      "sent_at": "2024-01-15T16:45:15Z",
      "delivered_at": "2024-01-15T16:45:28Z",
      "cost": 0.045,
      "vendor": "twilio"
    }
  ],
  "pagination": {
    "has_more": false,
    "next_cursor": null,
    "total_count": 1
  }
}
```

### Bulk Send Messages

Send multiple messages in a single request.

```http
POST /flows/{flow_id}/messages/bulk
```

#### Request Body

```json
{
  "messages": [
    {
      "recipient": "+1234567890",
      "message": {
        "text": "Hello John!",
        "template_id": "welcome_template"
      },
      "metadata": {
        "user_id": "user_123"
      }
    },
    {
      "recipient": "+0987654321",
      "message": {
        "text": "Hello Jane!",
        "template_id": "welcome_template"
      },
      "metadata": {
        "user_id": "user_456"
      }
    }
  ],
  "options": {
    "batch_size": 100,
    "rate_limit": 10,
    "callback_url": "https://your-app.com/webhooks/bulk-status"
  }
}
```

#### Example Response

```json
{
  "batch_id": "batch_123",
  "flow_id": "flow_123",
  "total_messages": 2,
  "status": "processing",
  "created_at": "2024-01-15T17:00:00Z",
  "estimated_completion": "2024-01-15T17:05:00Z",
  "messages": [
    {
      "message_id": "msg_790",
      "recipient": "+1234567890",
      "status": "queued"
    },
    {
      "message_id": "msg_791",
      "recipient": "+0987654321",
      "status": "queued"
    }
  ]
}
```

## Message Status Lifecycle

```
queued → processing → sent → delivered
                   ↘ failed
```

### Status Descriptions

- **queued**: Message is in the queue waiting to be processed
- **processing**: Message is being processed by the flow
- **sent**: Message has been sent to the vendor
- **delivered**: Message has been delivered to the recipient
- **failed**: Message delivery failed

## Error Codes

### Message-Specific Error Codes

| Code | Description |
|------|-------------|
| `INVALID_RECIPIENT` | Recipient phone number is invalid |
| `FLOW_INACTIVE` | Target flow is not active |
| `VENDOR_UNAVAILABLE` | No vendors available for routing |
| `QUOTA_EXCEEDED` | Message quota exceeded |
| `COST_LIMIT_EXCEEDED` | Message cost exceeds limit |
| `TEMPLATE_NOT_FOUND` | Specified template does not exist |
| `RATE_LIMIT_EXCEEDED` | Rate limit exceeded for this flow |