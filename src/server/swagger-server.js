const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const app = express();
const PORT = 8080;

// Enable CORS for all routes
app.use(cors());

// Middleware for JSON parsing
app.use(express.json());

// Load OpenAPI specification
let swaggerDocument;
try {
  const openApiPath = path.join(__dirname, '../../docs/api/openapi.yaml');
  const fileContents = fs.readFileSync(openApiPath, 'utf8');
  swaggerDocument = yaml.load(fileContents);
  console.log('✅ OpenAPI specification loaded successfully');
} catch (error) {
  console.error('❌ Failed to load OpenAPI specification:', error.message);
  process.exit(1);
}

// Swagger UI options
const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showRequestDuration: true,
    tryItOutEnabled: true,
    requestInterceptor: (req) => {
      // Add API key to requests automatically
      if (!req.headers.Authorization && process.env.FLOWFORGE_API_TOKEN) {
        req.headers.Authorization = `Bearer ${process.env.FLOWFORGE_API_TOKEN}`;
      }
      return req;
    }
  },
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info { margin: 20px 0; }
    .swagger-ui .info .title { color: #3b82f6; }
    .swagger-ui .scheme-container { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .swagger-ui .btn.authorize { background-color: #3b82f6; border-color: #3b82f6; }
    .swagger-ui .btn.authorize:hover { background-color: #2563eb; }
  `,
  customSiteTitle: 'FlowForge API Documentation',
  customfavIcon: '/favicon.ico'
};

// Serve Swagger UI at the specified endpoint
app.use('/swagger-ui.html', swaggerUi.serve);
app.get('/swagger-ui.html', swaggerUi.setup(swaggerDocument, swaggerOptions));

// Also serve at /docs for convenience
app.use('/docs', swaggerUi.serve);
app.get('/docs', swaggerUi.setup(swaggerDocument, swaggerOptions));

// Serve the raw OpenAPI spec
app.get('/openapi.yaml', (req, res) => {
  res.setHeader('Content-Type', 'application/x-yaml');
  const openApiPath = path.join(__dirname, '../../docs/api/openapi.yaml');
  res.sendFile(openApiPath);
});

app.get('/openapi.json', (req, res) => {
  res.json(swaggerDocument);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    documentation: {
      swagger_ui: `http://localhost:${PORT}/swagger-ui.html`,
      openapi_spec: `http://localhost:${PORT}/openapi.yaml`
    }
  });
});

// Root endpoint with links to documentation
app.get('/', (req, res) => {
  res.json({
    message: 'FlowForge API Documentation Server',
    documentation: {
      interactive: `http://localhost:${PORT}/swagger-ui.html`,
      alternative: `http://localhost:${PORT}/docs`,
      openapi_yaml: `http://localhost:${PORT}/openapi.yaml`,
      openapi_json: `http://localhost:${PORT}/openapi.json`
    },
    health: `http://localhost:${PORT}/health`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An internal server error occurred',
      timestamp: new Date().toISOString()
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Endpoint ${req.method} ${req.path} not found`,
      available_endpoints: [
        'GET /',
        'GET /swagger-ui.html',
        'GET /docs',
        'GET /openapi.yaml',
        'GET /openapi.json',
        'GET /health'
      ]
    }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 FlowForge API Documentation Server running on port ${PORT}`);
  console.log(`📚 Swagger UI available at: http://localhost:${PORT}/swagger-ui.html`);
  console.log(`📖 Alternative docs at: http://localhost:${PORT}/docs`);
  console.log(`📄 OpenAPI spec at: http://localhost:${PORT}/openapi.yaml`);
  console.log(`💚 Health check at: http://localhost:${PORT}/health`);
  console.log('');
  console.log('💡 Tip: Set FLOWFORGE_API_TOKEN environment variable to auto-authenticate requests');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully');
  process.exit(0);
});