# API Documentation Tools & Automation

## Recommended Tools for Automatic API Documentation

### 1. OpenAPI/Swagger Tools

#### Swagger UI
- **Purpose**: Interactive API documentation
- **Features**: Try-it-out functionality, schema validation
- **Setup**: Host Swagger UI with your OpenAPI spec
- **URL**: https://swagger.io/tools/swagger-ui/

```bash
# Docker setup
docker run -p 8080:8080 -e SWAGGER_JSON=/app/openapi.yaml -v $(pwd)/docs/api:/app swaggerapi/swagger-ui
```

#### Redoc
- **Purpose**: Beautiful, responsive API documentation
- **Features**: Three-panel layout, search, code samples
- **Setup**: Static HTML generation or hosted solution

```bash
# Generate static documentation
npx redoc-cli build docs/api/openapi.yaml --output docs/api-docs.html
```

### 2. Code-First Documentation

#### TypeScript + OpenAPI Generator

```bash
# Install dependencies
npm install @apidevtools/swagger-jsdoc swagger-ui-express
npm install -D @types/swagger-jsdoc @types/swagger-ui-express
```

Example implementation:
```typescript
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FlowForge API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts'], // Path to API files
};

const specs = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

#### NestJS + Swagger (Recommended for Node.js)

```bash
npm install @nestjs/swagger swagger-ui-express
```

```typescript
// main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('FlowForge API')
  .setDescription('Communication routing flow management')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);
```

### 3. Documentation Hosting Platforms

#### GitBook
- **Features**: Beautiful docs, Git integration, collaboration
- **Pricing**: Free tier available
- **Best for**: Comprehensive documentation with guides

#### Notion
- **Features**: Easy editing, team collaboration, public sharing
- **Pricing**: Free tier available
- **Best for**: Internal documentation and team wikis

#### Postman Documentation
- **Features**: Auto-generated from collections, interactive examples
- **Pricing**: Free tier available
- **Best for**: API testing and documentation in one place

### 4. Automated Documentation Generation

#### GitHub Actions Workflow

Create `.github/workflows/docs.yml`:

```yaml
name: Generate API Documentation

on:
  push:
    branches: [main]
    paths: ['docs/api/openapi.yaml']

jobs:
  generate-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Generate Redoc Documentation
        run: |
          npx redoc-cli build docs/api/openapi.yaml --output docs/api-docs.html
          
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

#### Pre-commit Hooks

```bash
# Install pre-commit
pip install pre-commit

# Create .pre-commit-config.yaml
```

```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: check-yaml
      - id: check-json
      
  - repo: https://github.com/APIDevTools/swagger-parser
    rev: v10.0.3
    hooks:
      - id: swagger-parser
        files: docs/api/openapi.yaml
```

### 5. API Testing and Documentation

#### Insomnia/Postman Collections

Export your API collection and keep it version-controlled:

```json
{
  "info": {
    "name": "FlowForge API",
    "description": "Complete API collection for FlowForge",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Flows",
      "item": [
        {
          "name": "List Flows",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{api_token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/flows",
              "host": ["{{base_url}}"],
              "path": ["flows"]
            }
          }
        }
      ]
    }
  ]
}
```

### 6. Documentation Validation

#### Spectral (OpenAPI Linting)

```bash
# Install Spectral
npm install -g @stoplight/spectral-cli

# Create .spectral.yaml
```

```yaml
extends: ["spectral:oas"]
rules:
  operation-description: error
  operation-summary: error
  operation-tags: error
  path-params: error
  contact-properties: error
  info-description: error
  license-url: error
  openapi-tags: error
  operation-operationId: error
```

```bash
# Validate OpenAPI spec
spectral lint docs/api/openapi.yaml
```

## Implementation Checklist

### Phase 1: Basic Setup
- [ ] Create OpenAPI specification
- [ ] Set up Swagger UI for interactive docs
- [ ] Implement basic endpoint documentation
- [ ] Add authentication documentation

### Phase 2: Enhanced Documentation
- [ ] Add comprehensive examples for all endpoints
- [ ] Document error responses and status codes
- [ ] Create SDK documentation
- [ ] Add webhook documentation

### Phase 3: Automation
- [ ] Set up automated documentation generation
- [ ] Implement OpenAPI validation in CI/CD
- [ ] Create Postman/Insomnia collections
- [ ] Set up documentation hosting

### Phase 4: Advanced Features
- [ ] Add interactive code samples
- [ ] Implement documentation versioning
- [ ] Create developer onboarding guides
- [ ] Add performance and rate limiting docs

## Best Practices

### 1. Keep Documentation in Sync
- Use code annotations to generate docs
- Implement validation in CI/CD pipeline
- Version documentation with API changes

### 2. Provide Comprehensive Examples
- Include request/response examples for every endpoint
- Show different scenarios (success, error, edge cases)
- Use realistic data in examples

### 3. Make It Interactive
- Use Swagger UI or similar tools
- Provide "try it out" functionality
- Include SDKs and code samples

### 4. Maintain Consistency
- Use consistent naming conventions
- Follow OpenAPI best practices
- Standardize error response formats

### 5. Monitor and Improve
- Track documentation usage analytics
- Collect developer feedback
- Regular reviews and updates

## Maintenance Schedule

### Daily
- Monitor API documentation build status
- Check for broken links or examples

### Weekly
- Review and update examples
- Check for new endpoints to document
- Update SDK documentation

### Monthly
- Comprehensive documentation review
- Update getting started guides
- Review and improve error documentation

### Quarterly
- Major documentation restructuring if needed
- Update tooling and automation
- Developer experience assessment