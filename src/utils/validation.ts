// Flow validation rules and utilities
import { ValidationError, StartNodeProps, Environment } from '@/types/flow';
import { hasRecipientsArray } from './schema';

export interface FlowValidationContext {
  environment: Environment;
  nodes: any[];
  edges: any[];
  startNode: any;
}

/**
 * Validates Start node configuration
 */
export function validateStartNode(props: StartNodeProps, context: FlowValidationContext): ValidationError[] {
  const errors: ValidationError[] = [];

  // Schema validation for non-manual triggers
  if (props.trigger !== 'manual') {
    if (!props.inputSchemaRef) {
      errors.push({
        field: 'inputSchemaRef',
        message: `Schema is required for ${props.trigger} trigger`,
        severity: 'error'
      });
    }
  }

  // Production security requirements
  if (context.environment === 'prod') {
    if (props.trigger === 'webhook') {
      if (!props.auth || props.auth.kind === 'none') {
        errors.push({
          field: 'auth',
          message: 'Authentication is required for webhook triggers in production',
          severity: 'error'
        });
      }

      if (!props.rateLimit) {
        errors.push({
          field: 'rateLimit',
          message: 'Rate limiting is required for webhook triggers',
          severity: 'error'
        });
      }
    }

    // Check for inline secrets
    if (props.auth?.secretRef && !props.auth.secretRef.startsWith('vault://')) {
      errors.push({
        field: 'auth.secretRef',
        message: 'Inline secrets not allowed in production. Use vault:// references only.',
        severity: 'error'
      });
    }
  }

  // Batch configuration validation
  if (props.trigger === 'batch') {
    if (!props.batch?.maxItems) {
      errors.push({
        field: 'batch.maxItems',
        message: 'maxItems is required for batch trigger',
        severity: 'error'
      });
    }
    if (!props.batch?.maxConcurrency) {
      errors.push({
        field: 'batch.maxConcurrency',
        message: 'maxConcurrency is required for batch trigger',
        severity: 'error'
      });
    }
  }

  return errors;
}

/**
 * Validates flow graph structure
 */
export function validateFlowGraph(context: FlowValidationContext): ValidationError[] {
  const errors: ValidationError[] = [];
  const { nodes, edges, startNode } = context;

  // Check for recipients array → Iterator requirement
  if (startNode?.data?.inputSchemaRef) {
    try {
      // This would normally fetch the schema by reference
      const schemaString = startNode.data.inputSchemaRef;
      if (hasRecipientsArray(schemaString)) {
        const hasIteratorBeforeSend = checkIteratorBeforeSendNodes(nodes, edges);
        if (!hasIteratorBeforeSend) {
          errors.push({
            field: 'flow',
            message: 'Schema contains recipients array but no Iterator node found before Send nodes',
            severity: 'error'
          });
        }
      }
    } catch (error) {
      // Schema validation would happen elsewhere
    }
  }

  // Check async operation correlation requirements
  const hasAsyncNodes = nodes.some(node => 
    ['timer', 'webhook', 'dlr'].includes(node.type)
  );
  
  if (hasAsyncNodes && !startNode?.data?.correlation?.field) {
    errors.push({
      field: 'correlation',
      message: 'Correlation field required when flow contains async nodes (Timer, Webhook, DLR)',
      severity: 'error'
    });
  }

  // Validate conditional ports are connected
  const startNodeObj = nodes.find(node => node.type === 'start');
  if (startNodeObj) {
    const startNodeEdges = edges.filter(edge => edge.source === startNodeObj.id);
    
    if (startNodeObj.data?.ports?.invalid_input) {
      const hasInvalidInputEdge = startNodeEdges.some(edge => 
        edge.sourceHandle === 'invalid_input'
      );
      if (!hasInvalidInputEdge) {
        errors.push({
          field: 'ports',
          message: 'invalid_input port is enabled but not connected',
          severity: 'error'
        });
      }
    }

    if (startNodeObj.data?.ports?.throttled) {
      const hasThrottledEdge = startNodeEdges.some(edge => 
        edge.sourceHandle === 'throttled'
      );
      if (!hasThrottledEdge) {
        errors.push({
          field: 'ports',
          message: 'throttled port is enabled but not connected',
          severity: 'error'
        });
      }
    }
  }

  return errors;
}

/**
 * Checks if Iterator node exists before Send nodes
 */
function checkIteratorBeforeSendNodes(nodes: any[], edges: any[]): boolean {
  const sendNodes = nodes.filter(node => 
    ['sms', 'whatsapp', 'email', 'voice', 'rcs'].includes(node.type)
  );
  
  const iteratorNodes = nodes.filter(node => 
    node.type === 'iterator' || node.data?.isIterator
  );

  if (iteratorNodes.length === 0) {
    return false;
  }

  // Check if there's a path from Iterator to Send nodes
  for (const sendNode of sendNodes) {
    const hasIteratorInPath = hasNodeTypeInPath(
      'iterator', 
      sendNode.id, 
      nodes, 
      edges, 
      new Set()
    );
    if (!hasIteratorInPath) {
      return false;
    }
  }

  return true;
}

/**
 * Checks if a node type exists in the path to a target node
 */
function hasNodeTypeInPath(
  nodeType: string, 
  targetNodeId: string, 
  nodes: any[], 
  edges: any[], 
  visited: Set<string>
): boolean {
  if (visited.has(targetNodeId)) {
    return false;
  }
  visited.add(targetNodeId);

  const targetNode = nodes.find(node => node.id === targetNodeId);
  if (!targetNode) {
    return false;
  }

  if (targetNode.type === nodeType || targetNode.data?.isIterator) {
    return true;
  }

  // Check incoming edges
  const incomingEdges = edges.filter(edge => edge.target === targetNodeId);
  
  for (const edge of incomingEdges) {
    if (hasNodeTypeInPath(nodeType, edge.source, nodes, edges, new Set(visited))) {
      return true;
    }
  }

  return false;
}

/**
 * Validates rate limiting configuration
 */
export function validateRateLimit(rateLimit: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (rateLimit) {
    if (!rateLimit.rps || rateLimit.rps <= 0) {
      errors.push({
        field: 'rateLimit.rps',
        message: 'RPS must be a positive number',
        severity: 'error'
      });
    }

    if (!rateLimit.burst || rateLimit.burst <= 0) {
      errors.push({
        field: 'rateLimit.burst',
        message: 'Burst must be a positive number',
        severity: 'error'
      });
    }

    if (rateLimit.burst < rateLimit.rps) {
      errors.push({
        field: 'rateLimit.burst',
        message: 'Burst should be greater than or equal to RPS',
        severity: 'warning'
      });
    }
  }

  return errors;
}

/**
 * Validates auth configuration
 */
export function validateAuth(auth: any, environment: Environment): ValidationError[] {
  const errors: ValidationError[] = [];

  if (auth) {
    if (auth.secretRef) {
      if (!auth.secretRef.startsWith('vault://')) {
        const severity = environment === 'prod' ? 'error' : 'warning';
        errors.push({
          field: 'auth.secretRef',
          message: 'Secret references should use vault:// format',
          severity
        });
      }
    }

    if (auth.kind !== 'none' && !auth.secretRef) {
      errors.push({
        field: 'auth.secretRef',
        message: 'Secret reference required for authentication',
        severity: 'error'
      });
    }
  }

  return errors;
}

/**
 * Comprehensive validation function
 */
export function validateFlow(context: FlowValidationContext): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate start node
  if (context.startNode?.data) {
    errors.push(...validateStartNode(context.startNode.data, context));
  }

  // Validate flow graph
  errors.push(...validateFlowGraph(context));

  // Additional validations can be added here

  return errors;
}