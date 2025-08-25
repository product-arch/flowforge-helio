# Flows API

Manage communication routing flows programmatically.

## Endpoints

### List Flows

Retrieve a paginated list of flows.

```http
GET /flows
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Number of flows to return (1-100, default: 20) |
| `cursor` | string | No | Pagination cursor |
| `status` | string | No | Filter by status: `draft`, `active`, `archived` |
| `channel` | string | No | Filter by channel: `sms`, `whatsapp`, `email`, `voice`, `rcs` |
| `created_after` | string | No | ISO 8601 timestamp |
| `created_before` | string | No | ISO 8601 timestamp |

#### Example Request

```bash
curl -X GET "https://api.flowforge.com/v1/flows?limit=10&status=active" \
  -H "Authorization: Bearer your-api-token" \
  -H "Content-Type: application/json"
```

#### Example Response

```json
{
  "data": [
    {
      "id": "flow_123",
      "name": "SMS Marketing Flow",
      "description": "Automated SMS routing for marketing campaigns",
      "status": "active",
      "channel": "sms",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T14:20:00Z",
      "activated_at": "2024-01-15T14:20:00Z",
      "configuration": {
        "routing_strategy": "weighted_split",
        "vendors": [
          {
            "id": "twilio",
            "weight": 60,
            "priority": 1
          },
          {
            "id": "msg91",
            "weight": 40,
            "priority": 2
          }
        ],
        "fallback_enabled": true
      },
      "metrics": {
        "total_messages": 15432,
        "success_rate": 98.5,
        "avg_cost_per_message": 0.045
      }
    }
  ],
  "pagination": {
    "has_more": true,
    "next_cursor": "eyJpZCI6IjEyMyJ9",
    "total_count": 25
  }
}
```

### Get Flow

Retrieve a specific flow by ID.

```http
GET /flows/{flow_id}
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `flow_id` | string | Yes | Unique flow identifier |

#### Example Request

```bash
curl -X GET "https://api.flowforge.com/v1/flows/flow_123" \
  -H "Authorization: Bearer your-api-token"
```

#### Example Response

```json
{
  "id": "flow_123",
  "name": "SMS Marketing Flow",
  "description": "Automated SMS routing for marketing campaigns",
  "status": "active",
  "channel": "sms",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T14:20:00Z",
  "activated_at": "2024-01-15T14:20:00Z",
  "configuration": {
    "nodes": [
      {
        "id": "start-1",
        "type": "start",
        "position": { "x": 100, "y": 100 },
        "data": {
          "label": "Start",
          "channel": "sms"
        }
      },
      {
        "id": "sms-1",
        "type": "sms",
        "position": { "x": 300, "y": 100 },
        "data": {
          "senderId": "FLOWFORGE",
          "messageType": "promotional",
          "selectedVendors": ["twilio", "msg91"]
        }
      }
    ],
    "edges": [
      {
        "id": "edge-1",
        "source": "start-1",
        "target": "sms-1",
        "type": "custom"
      }
    ]
  },
  "metrics": {
    "total_messages": 15432,
    "success_rate": 98.5,
    "avg_cost_per_message": 0.045,
    "last_24h": {
      "messages": 1250,
      "success_rate": 99.2
    }
  }
}
```

### Create Flow

Create a new communication flow.

```http
POST /flows
```

#### Request Body

```json
{
  "name": "New SMS Flow",
  "description": "Description of the flow",
  "channel": "sms",
  "configuration": {
    "nodes": [
      {
        "id": "start-1",
        "type": "start",
        "position": { "x": 100, "y": 100 },
        "data": {
          "label": "Start",
          "channel": "sms"
        }
      }
    ],
    "edges": []
  }
}
```

#### Example Request

```bash
curl -X POST "https://api.flowforge.com/v1/flows" \
  -H "Authorization: Bearer your-api-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New SMS Flow",
    "description": "Test flow for SMS routing",
    "channel": "sms",
    "configuration": {
      "nodes": [
        {
          "id": "start-1",
          "type": "start",
          "position": { "x": 100, "y": 100 },
          "data": { "label": "Start", "channel": "sms" }
        }
      ],
      "edges": []
    }
  }'
```

#### Example Response

```json
{
  "id": "flow_456",
  "name": "New SMS Flow",
  "description": "Test flow for SMS routing",
  "status": "draft",
  "channel": "sms",
  "created_at": "2024-01-15T15:30:00Z",
  "updated_at": "2024-01-15T15:30:00Z",
  "configuration": {
    "nodes": [
      {
        "id": "start-1",
        "type": "start",
        "position": { "x": 100, "y": 100 },
        "data": {
          "label": "Start",
          "channel": "sms"
        }
      }
    ],
    "edges": []
  }
}
```

### Update Flow

Update an existing flow configuration.

```http
PUT /flows/{flow_id}
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `flow_id` | string | Yes | Unique flow identifier |

#### Request Body

```json
{
  "name": "Updated Flow Name",
  "description": "Updated description",
  "configuration": {
    "nodes": [...],
    "edges": [...]
  }
}
```

#### Example Request

```bash
curl -X PUT "https://api.flowforge.com/v1/flows/flow_123" \
  -H "Authorization: Bearer your-api-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated SMS Flow",
    "description": "Updated flow description"
  }'
```

### Activate Flow

Activate a flow to start processing messages.

```http
POST /flows/{flow_id}/activate
```

#### Example Request

```bash
curl -X POST "https://api.flowforge.com/v1/flows/flow_123/activate" \
  -H "Authorization: Bearer your-api-token"
```

#### Example Response

```json
{
  "id": "flow_123",
  "status": "active",
  "activated_at": "2024-01-15T16:00:00Z",
  "message": "Flow activated successfully"
}
```

### Deactivate Flow

Deactivate a flow to stop processing messages.

```http
POST /flows/{flow_id}/deactivate
```

#### Example Request

```bash
curl -X POST "https://api.flowforge.com/v1/flows/flow_123/deactivate" \
  -H "Authorization: Bearer your-api-token"
```

### Delete Flow

Delete a flow permanently.

```http
DELETE /flows/{flow_id}
```

#### Example Request

```bash
curl -X DELETE "https://api.flowforge.com/v1/flows/flow_123" \
  -H "Authorization: Bearer your-api-token"
```

#### Example Response

```json
{
  "message": "Flow deleted successfully",
  "deleted_at": "2024-01-15T16:30:00Z"
}
```

### Simulate Flow

Test a flow configuration without sending actual messages.

```http
POST /flows/{flow_id}/simulate
```

#### Request Body

```json
{
  "test_parameters": {
    "app_id": "HELO_BROADCAST_001",
    "channel": "sms",
    "message_type": "promotional",
    "message_id": "MSG_1234567890",
    "overrides": {
      "vendor_status": {
        "twilio": "active",
        "msg91": "down"
      },
      "quotas": {
        "twilio": 1000,
        "msg91": 0
      }
    }
  }
}
```

#### Example Response

```json
{
  "simulation_id": "sim_789",
  "flow_id": "flow_123",
  "results": [
    {
      "step": 1,
      "node_id": "start-1",
      "node_type": "start",
      "status": "success",
      "message": "Flow execution started",
      "timestamp": "2024-01-15T16:45:00.000Z"
    },
    {
      "step": 2,
      "node_id": "sms-1",
      "node_type": "sms",
      "status": "success",
      "message": "Routed to Twilio (MSG91 unavailable)",
      "selected_vendor": "twilio",
      "cost": 0.045,
      "timestamp": "2024-01-15T16:45:00.100Z"
    }
  ],
  "summary": {
    "total_steps": 2,
    "execution_time_ms": 150,
    "final_status": "success",
    "selected_vendor": "twilio",
    "estimated_cost": 0.045
  }
}
```

## Flow Configuration Schema

### Node Types

#### Start Node
```json
{
  "id": "start-1",
  "type": "start",
  "position": { "x": 100, "y": 100 },
  "data": {
    "label": "Start",
    "channel": "sms",
    "app_id": "HELO_BROADCAST_001"
  }
}
```

#### SMS Channel Node
```json
{
  "id": "sms-1",
  "type": "sms",
  "position": { "x": 300, "y": 100 },
  "data": {
    "label": "SMS Channel",
    "senderId": "FLOWFORGE",
    "messageType": "promotional",
    "encoding": "utf8",
    "selectedVendors": ["twilio", "msg91"],
    "routingConfig": {
      "mode": "weighted",
      "vendors": [
        { "id": "twilio", "weight": 60 },
        { "id": "msg91", "weight": 40 }
      ]
    }
  }
}
```

#### Terminal Node
```json
{
  "id": "terminal-1",
  "type": "terminal",
  "position": { "x": 500, "y": 100 },
  "data": {
    "label": "Sent",
    "state": "sent",
    "reason": "Message delivered successfully"
  }
}
```

### Edge Configuration
```json
{
  "id": "edge-1",
  "source": "start-1",
  "target": "sms-1",
  "type": "custom",
  "style": {
    "strokeWidth": 2,
    "stroke": "#3b82f6"
  }
}
```