# FlowForge API Documentation

## Overview

The FlowForge API provides programmatic access to create, manage, and execute communication routing flows. This RESTful API enables developers to integrate flow management capabilities into their applications.

## Base URL

```
Production: https://api.flowforge.com/v1
Staging: https://staging-api.flowforge.com/v1
Development: http://localhost:8080/api/v1
```

## Authentication

All API requests require authentication using Bearer tokens.

### Authentication Header
```http
Authorization: Bearer <your-api-token>
```

### Getting an API Token

1. Log in to your FlowForge dashboard
2. Navigate to Settings > API Keys
3. Generate a new API key with appropriate permissions

## Rate Limiting

- **Rate Limit**: 1000 requests per hour per API key
- **Burst Limit**: 100 requests per minute
- **Headers**: Rate limit information is included in response headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Error Handling

The API uses conventional HTTP response codes to indicate success or failure.

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request parameters |
| 401 | Unauthorized - Invalid or missing authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation errors |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - Service temporarily unavailable |

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid parameters",
    "details": [
      {
        "field": "email",
        "message": "Email address is required"
      }
    ],
    "request_id": "req_1234567890",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## Pagination

List endpoints support pagination using cursor-based pagination for optimal performance.

### Request Parameters
- `limit` (optional): Number of items to return (default: 20, max: 100)
- `cursor` (optional): Cursor for pagination

### Response Format
```json
{
  "data": [...],
  "pagination": {
    "has_more": true,
    "next_cursor": "eyJpZCI6IjEyMyJ9",
    "total_count": 150
  }
}
```

## Webhooks

FlowForge can send webhook notifications for various events. Configure webhooks in your dashboard under Settings > Webhooks.

### Webhook Events
- `flow.created` - New flow created
- `flow.updated` - Flow configuration updated
- `flow.activated` - Flow activated
- `flow.deactivated` - Flow deactivated
- `message.sent` - Message successfully sent
- `message.failed` - Message delivery failed

### Webhook Payload Format
```json
{
  "event": "flow.activated",
  "data": {
    "flow_id": "flow_123",
    "name": "SMS Marketing Flow",
    "activated_at": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "webhook_id": "wh_456"
}
```

## SDKs and Libraries

Official SDKs are available for popular programming languages:

- [Node.js SDK](https://github.com/flowforge/node-sdk)
- [Python SDK](https://github.com/flowforge/python-sdk)
- [PHP SDK](https://github.com/flowforge/php-sdk)
- [Java SDK](https://github.com/flowforge/java-sdk)

## Support

- **Documentation**: [https://docs.flowforge.com](https://docs.flowforge.com)
- **Support Email**: api-support@flowforge.com
- **Status Page**: [https://status.flowforge.com](https://status.flowforge.com)