# API Endpoint Template

Use this template when documenting new API endpoints.

## [Endpoint Name]

[Brief description of what this endpoint does]

```http
[METHOD] /[endpoint-path]
```

### Authentication

- **Required**: Yes/No
- **Type**: Bearer Token / API Key / Basic Auth
- **Permissions**: [List required permissions]

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `param_name` | string | Yes | Description of parameter |

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `param_name` | string | No | `default_value` | Description of parameter |

### Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | Must be `application/json` |
| `Authorization` | Yes | Bearer token for authentication |

### Request Body

```json
{
  "field_name": "value",
  "nested_object": {
    "sub_field": "value"
  },
  "array_field": ["item1", "item2"]
}
```

#### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `field_name` | string | Yes | Description of field |
| `nested_object.sub_field` | string | No | Description of nested field |

### Example Request

```bash
curl -X [METHOD] "https://api.flowforge.com/v1/[endpoint]" \
  -H "Authorization: Bearer your-api-token" \
  -H "Content-Type: application/json" \
  -d '{
    "field_name": "example_value"
  }'
```

### Response

#### Success Response (200/201)

```json
{
  "id": "resource_123",
  "field_name": "value",
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### Error Responses

##### 400 Bad Request
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "field_name",
        "message": "Field is required"
      }
    ]
  }
}
```

##### 404 Not Found
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier for the resource |
| `field_name` | string | Description of response field |

### Rate Limiting

- **Limit**: X requests per hour
- **Burst**: Y requests per minute

### Examples

#### [Scenario 1]
[Description of use case]

```bash
# Request
curl -X [METHOD] "..." \
  -H "..." \
  -d '{...}'

# Response
{...}
```

#### [Scenario 2]
[Description of another use case]

### Notes

- [Important notes about the endpoint]
- [Limitations or special considerations]
- [Related endpoints or workflows]

### Changelog

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2024-01-15 | Initial release |