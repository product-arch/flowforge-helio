# Vendors API

Manage vendor configurations and monitor vendor health.

## Endpoints

### List Vendors

Retrieve all configured vendors.

```http
GET /vendors
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `channel` | string | No | Filter by channel: `sms`, `whatsapp`, `email`, `voice`, `rcs` |
| `status` | string | No | Filter by status: `active`, `inactive`, `maintenance` |

#### Example Request

```bash
curl -X GET "https://api.flowforge.com/v1/vendors?channel=sms" \
  -H "Authorization: Bearer your-api-token"
```

#### Example Response

```json
{
  "data": [
    {
      "id": "twilio",
      "name": "Twilio",
      "channel": "sms",
      "status": "active",
      "configuration": {
        "account_sid": "AC***",
        "auth_token": "***",
        "sender_id": "FLOWFORGE"
      },
      "capabilities": {
        "max_tps": 1000,
        "supports_unicode": true,
        "supports_delivery_reports": true
      },
      "pricing": {
        "cost_per_message": 0.045,
        "currency": "USD"
      },
      "health": {
        "status": "healthy",
        "last_check": "2024-01-15T16:40:00Z",
        "response_time_ms": 120,
        "success_rate_24h": 99.8
      }
    }
  ]
}
```

### Get Vendor

Retrieve details for a specific vendor.

```http
GET /vendors/{vendor_id}
```

#### Example Response

```json
{
  "id": "twilio",
  "name": "Twilio",
  "channel": "sms",
  "status": "active",
  "configuration": {
    "account_sid": "AC***",
    "sender_id": "FLOWFORGE",
    "webhook_url": "https://api.flowforge.com/webhooks/twilio"
  },
  "capabilities": {
    "max_tps": 1000,
    "supports_unicode": true,
    "supports_delivery_reports": true,
    "supported_countries": ["US", "CA", "GB", "IN"]
  },
  "pricing": {
    "cost_per_message": 0.045,
    "currency": "USD",
    "volume_discounts": [
      { "min_volume": 10000, "discount_percent": 5 },
      { "min_volume": 100000, "discount_percent": 10 }
    ]
  },
  "health": {
    "status": "healthy",
    "last_check": "2024-01-15T16:40:00Z",
    "response_time_ms": 120,
    "success_rate_24h": 99.8,
    "error_rate_24h": 0.2,
    "quota_remaining": 85000,
    "quota_reset": "2024-01-16T00:00:00Z"
  },
  "metrics": {
    "messages_sent_24h": 15000,
    "avg_delivery_time_ms": 2500,
    "total_cost_24h": 675.00
  }
}
```

### Update Vendor Configuration

Update vendor settings and configuration.

```http
PUT /vendors/{vendor_id}
```

#### Request Body

```json
{
  "configuration": {
    "sender_id": "NEWBRAND",
    "webhook_url": "https://api.flowforge.com/webhooks/twilio-new"
  },
  "capabilities": {
    "max_tps": 1500
  }
}
```

### Test Vendor Connection

Test connectivity and authentication with a vendor.

```http
POST /vendors/{vendor_id}/test
```

#### Example Response

```json
{
  "vendor_id": "twilio",
  "test_result": {
    "status": "success",
    "response_time_ms": 145,
    "authentication": "valid",
    "quota_available": true,
    "test_message_sent": true,
    "timestamp": "2024-01-15T17:00:00Z"
  },
  "recommendations": [
    "Consider increasing TPS limit for better performance",
    "Enable delivery reports for better tracking"
  ]
}
```

### Get Vendor Health

Get real-time health status for a vendor.

```http
GET /vendors/{vendor_id}/health
```

#### Example Response

```json
{
  "vendor_id": "twilio",
  "status": "healthy",
  "checks": {
    "connectivity": {
      "status": "pass",
      "response_time_ms": 120,
      "last_check": "2024-01-15T16:59:00Z"
    },
    "authentication": {
      "status": "pass",
      "last_check": "2024-01-15T16:59:00Z"
    },
    "quota": {
      "status": "pass",
      "remaining": 85000,
      "limit": 100000,
      "reset_at": "2024-01-16T00:00:00Z"
    },
    "rate_limit": {
      "status": "pass",
      "current_tps": 45,
      "max_tps": 1000
    }
  },
  "metrics": {
    "success_rate_1h": 99.9,
    "success_rate_24h": 99.8,
    "avg_response_time_ms": 125,
    "error_count_1h": 2
  }
}
```

## Vendor Status Codes

| Status | Description |
|--------|-------------|
| `active` | Vendor is operational and accepting messages |
| `inactive` | Vendor is disabled |
| `maintenance` | Vendor is under maintenance |
| `degraded` | Vendor is experiencing issues but still functional |
| `down` | Vendor is completely unavailable |

## Health Check Status

| Status | Description |
|--------|-------------|
| `healthy` | All checks passing |
| `warning` | Some non-critical issues detected |
| `critical` | Critical issues affecting functionality |
| `unknown` | Health status cannot be determined |