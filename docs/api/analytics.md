# Analytics API

Access flow performance metrics and analytics data.

## Endpoints

### Get Flow Analytics

Retrieve analytics data for a specific flow.

```http
GET /flows/{flow_id}/analytics
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `period` | string | No | Time period: `1h`, `24h`, `7d`, `30d` (default: `24h`) |
| `metrics` | string | No | Comma-separated metrics to include |
| `granularity` | string | No | Data granularity: `minute`, `hour`, `day` |

#### Example Request

```bash
curl -X GET "https://api.flowforge.com/v1/flows/flow_123/analytics?period=24h&granularity=hour" \
  -H "Authorization: Bearer your-api-token"
```

#### Example Response

```json
{
  "flow_id": "flow_123",
  "period": "24h",
  "granularity": "hour",
  "summary": {
    "total_messages": 15432,
    "successful_messages": 15201,
    "failed_messages": 231,
    "success_rate": 98.5,
    "avg_delivery_time_ms": 2450,
    "total_cost": 694.44,
    "avg_cost_per_message": 0.045
  },
  "vendor_breakdown": [
    {
      "vendor_id": "twilio",
      "messages": 9259,
      "success_rate": 99.2,
      "avg_cost": 0.048,
      "total_cost": 444.43
    },
    {
      "vendor_id": "msg91",
      "messages": 6173,
      "success_rate": 97.3,
      "avg_cost": 0.041,
      "total_cost": 253.09
    }
  ],
  "time_series": [
    {
      "timestamp": "2024-01-15T00:00:00Z",
      "messages": 642,
      "success_rate": 98.9,
      "avg_delivery_time_ms": 2300,
      "cost": 28.89
    },
    {
      "timestamp": "2024-01-15T01:00:00Z",
      "messages": 589,
      "success_rate": 99.1,
      "avg_delivery_time_ms": 2250,
      "cost": 26.51
    }
  ],
  "error_breakdown": [
    {
      "error_code": "INVALID_NUMBER",
      "count": 145,
      "percentage": 62.8
    },
    {
      "error_code": "VENDOR_TIMEOUT",
      "count": 86,
      "percentage": 37.2
    }
  ]
}
```

### Get Global Analytics

Retrieve analytics across all flows.

```http
GET /analytics
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `period` | string | No | Time period: `1h`, `24h`, `7d`, `30d` (default: `24h`) |
| `channel` | string | No | Filter by channel |
| `group_by` | string | No | Group results by: `flow`, `vendor`, `channel` |

#### Example Response

```json
{
  "period": "24h",
  "summary": {
    "total_messages": 45896,
    "total_flows": 12,
    "active_flows": 8,
    "success_rate": 98.7,
    "total_cost": 2067.32,
    "cost_savings": 312.45
  },
  "channel_breakdown": [
    {
      "channel": "sms",
      "messages": 32145,
      "success_rate": 98.9,
      "cost": 1445.53
    },
    {
      "channel": "whatsapp",
      "messages": 8934,
      "success_rate": 97.8,
      "cost": 402.03
    },
    {
      "channel": "email",
      "messages": 4817,
      "success_rate": 99.5,
      "cost": 219.76
    }
  ],
  "top_performing_flows": [
    {
      "flow_id": "flow_123",
      "name": "SMS Marketing Flow",
      "messages": 15432,
      "success_rate": 99.2,
      "cost_efficiency": 0.043
    }
  ]
}
```

### Export Analytics

Export analytics data in various formats.

```http
POST /analytics/export
```

#### Request Body

```json
{
  "flows": ["flow_123", "flow_456"],
  "period": "7d",
  "format": "csv",
  "metrics": [
    "messages_sent",
    "success_rate",
    "cost_per_message",
    "delivery_time"
  ],
  "email_to": "analytics@yourcompany.com"
}
```

#### Example Response

```json
{
  "export_id": "exp_789",
  "status": "processing",
  "estimated_completion": "2024-01-15T17:10:00Z",
  "download_url": null,
  "email_sent": true
}
```

## Available Metrics

### Flow Metrics
- `messages_sent` - Total messages processed
- `success_rate` - Percentage of successful deliveries
- `failure_rate` - Percentage of failed deliveries
- `avg_delivery_time` - Average time from send to delivery
- `cost_per_message` - Average cost per message
- `vendor_distribution` - Distribution across vendors

### Vendor Metrics
- `vendor_success_rate` - Success rate per vendor
- `vendor_response_time` - Average response time per vendor
- `vendor_cost_efficiency` - Cost efficiency per vendor
- `vendor_quota_usage` - Quota utilization per vendor

### Error Metrics
- `error_breakdown` - Categorized error analysis
- `retry_success_rate` - Success rate of retry attempts
- `fallback_usage` - Frequency of fallback routing