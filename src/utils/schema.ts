// JSON Schema parsing and validation utilities
import { z } from 'zod';

export interface SchemaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface SampleData {
  [key: string]: any;
}

// Basic JSON Schema interface
export interface JSONSchema {
  type: string;
  properties?: { [key: string]: JSONSchema };
  items?: JSONSchema;
  required?: string[];
  enum?: any[];
  format?: string;
  pattern?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  description?: string;
  example?: any;
}

/**
 * Validates a JSON Schema string
 */
export function validateSchema(schemaString: string): SchemaValidationResult {
  const result: SchemaValidationResult = {
    isValid: false,
    errors: [],
    warnings: []
  };

  try {
    const schema = JSON.parse(schemaString);
    
    // Basic validation
    if (!schema.type) {
      result.errors.push("Schema must have a 'type' property");
    }

    // Check for common patterns
    if (schema.properties && schema.properties.recipients && 
        schema.properties.recipients.type === 'array') {
      result.warnings.push("Schema contains recipients array - Iterator node required before Send nodes");
    }

    // Validate required fields are properly defined
    if (schema.required && Array.isArray(schema.required)) {
      schema.required.forEach((field: string) => {
        if (!schema.properties || !schema.properties[field]) {
          result.errors.push(`Required field '${field}' not defined in properties`);
        }
      });
    }

    result.isValid = result.errors.length === 0;
    return result;
  } catch (error) {
    result.errors.push(`Invalid JSON: ${(error as Error).message}`);
    return result;
  }
}

/**
 * Generates sample data from a JSON Schema
 */
export function generateSampleFromSchema(schemaString: string): SampleData | null {
  try {
    const schema: JSONSchema = JSON.parse(schemaString);
    return generateSampleFromSchemaObject(schema);
  } catch (error) {
    console.error('Failed to generate sample from schema:', error);
    return null;
  }
}

function generateSampleFromSchemaObject(schema: JSONSchema): any {
  // Use example if provided
  if (schema.example !== undefined) {
    return schema.example;
  }

  switch (schema.type) {
    case 'object':
      const obj: SampleData = {};
      if (schema.properties) {
        Object.keys(schema.properties).forEach(key => {
          obj[key] = generateSampleFromSchemaObject(schema.properties![key]);
        });
      }
      return obj;

    case 'array':
      if (schema.items) {
        return [generateSampleFromSchemaObject(schema.items)];
      }
      return [];

    case 'string':
      if (schema.enum) {
        return schema.enum[0];
      }
      if (schema.format === 'email') {
        return 'user@example.com';
      }
      if (schema.format === 'date-time') {
        return new Date().toISOString();
      }
      if (schema.format === 'uuid') {
        return '123e4567-e89b-12d3-a456-426614174000';
      }
      if (schema.pattern) {
        // Simple pattern matching for phone numbers
        if (schema.pattern.includes('\\+') || schema.pattern.includes('91')) {
          return '+919876543210';
        }
      }
      return 'sample text';

    case 'number':
    case 'integer':
      if (schema.minimum !== undefined) {
        return schema.minimum;
      }
      if (schema.maximum !== undefined) {
        return Math.min(100, schema.maximum);
      }
      return schema.type === 'integer' ? 42 : 42.5;

    case 'boolean':
      return true;

    default:
      return null;
  }
}

/**
 * Validates if schema contains recipients array
 */
export function hasRecipientsArray(schemaString: string): boolean {
  try {
    const schema = JSON.parse(schemaString);
    return schema.properties && 
           schema.properties.recipients && 
           schema.properties.recipients.type === 'array';
  } catch {
    return false;
  }
}

/**
 * Generates idempotency key from sample data
 */
export function generateIdempotencyKey(sampleData: SampleData, deriveFrom: string[]): string {
  const values = deriveFrom.map(field => {
    const fieldValue = getNestedValue(sampleData, field);
    return fieldValue ? String(fieldValue) : '';
  });
  
  // Simple hash function (for demonstration - use proper crypto in production)
  const combined = values.join('|');
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key];
  }, obj);
}

/**
 * Common schema templates
 */
export const SCHEMA_TEMPLATES = {
  smsMessage: {
    type: 'object',
    properties: {
      to: { type: 'string', pattern: '^\\+[1-9]\\d{1,14}$', description: 'Phone number in E.164 format' },
      message: { type: 'string', maxLength: 1600, description: 'SMS message content' },
      senderId: { type: 'string', maxLength: 11, description: 'Sender ID' },
      messageType: { type: 'string', enum: ['transactional', 'promotional'], description: 'Message type' }
    },
    required: ['to', 'message']
  },
  
  bulkSms: {
    type: 'object',
    properties: {
      recipients: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            to: { type: 'string', pattern: '^\\+[1-9]\\d{1,14}$' },
            message: { type: 'string', maxLength: 1600 },
            customFields: { type: 'object' }
          },
          required: ['to', 'message']
        }
      },
      senderId: { type: 'string', maxLength: 11 },
      scheduledAt: { type: 'string', format: 'date-time' }
    },
    required: ['recipients']
  },

  whatsappMessage: {
    type: 'object',
    properties: {
      to: { type: 'string', pattern: '^\\+[1-9]\\d{1,14}$' },
      templateName: { type: 'string', description: 'WhatsApp template name' },
      parameters: { type: 'array', items: { type: 'string' } },
      language: { type: 'string', default: 'en' }
    },
    required: ['to', 'templateName']
  }
};