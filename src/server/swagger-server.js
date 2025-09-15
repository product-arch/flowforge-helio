import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.DOCS_PORT || 8081;

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
    supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
    validatorUrl: null,
    requestInterceptor: (req) => {
      // Add API key to requests automatically
      if (!req.headers.Authorization && process.env.FLOWFORGE_API_TOKEN) {
        req.headers.Authorization = `Bearer ${process.env.FLOWFORGE_API_TOKEN}`;
      }
      // Add content-type header for POST/PUT requests
      if (['POST', 'PUT', 'PATCH'].includes(req.method) && !req.headers['Content-Type']) {
        req.headers['Content-Type'] = 'application/json';
      }
      return req;
    },
    responseInterceptor: (res) => {
      // Log responses for debugging
      console.log('API Response:', res.status, res.url);
      return res;
    }
  },
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info { margin: 20px 0; }
    .swagger-ui .info .title { color: hsl(221.2 83.2% 53.3%); font-size: 2rem; font-weight: 700; }
    .swagger-ui .info .description { color: hsl(215.4 16.3% 46.9%); line-height: 1.6; }
    .swagger-ui .scheme-container { 
      background: hsl(210 40% 98%); 
      border: 1px solid hsl(214.3 31.8% 91.4%);
      padding: 20px; 
      border-radius: 12px; 
      margin: 20px 0; 
    }
    .swagger-ui .btn.authorize { 
      background-color: hsl(221.2 83.2% 53.3%); 
      border-color: hsl(221.2 83.2% 53.3%);
      border-radius: 8px;
      font-weight: 500;
    }
    .swagger-ui .btn.authorize:hover { 
      background-color: hsl(221.2 83.2% 45%); 
    }
    .swagger-ui .opblock.opblock-post { border-color: hsl(142.1 76.2% 36.3%); }
    .swagger-ui .opblock.opblock-get { border-color: hsl(221.2 83.2% 53.3%); }
    .swagger-ui .opblock.opblock-put { border-color: hsl(32.6 94.6% 43.7%); }
    .swagger-ui .opblock.opblock-delete { border-color: hsl(0 84.2% 60.2%); }
    .swagger-ui .opblock-summary-method { border-radius: 6px; font-weight: 600; }
    .swagger-ui .opblock-summary-path { font-family: ui-monospace, monospace; }
    .swagger-ui .response-content-type { font-family: ui-monospace, monospace; }
    .swagger-ui .model { font-family: ui-monospace, monospace; }
    .swagger-ui .btn.execute { 
      background-color: hsl(142.1 76.2% 36.3%); 
      color: hsl(210 40% 98%); 
      border-radius: 8px;
      font-weight: 500;
    }
    .swagger-ui .btn.execute:hover { 
      background-color: hsl(142.1 76.2% 30%); 
    }
  `,
  customSiteTitle: 'FlowForge API Documentation - Interactive Testing',
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