// Flow Builder Type System
export type TriggerType = "manual" | "webhook" | "batch" | "schedule" | "event_bus";
export type AuthType = "none" | "token" | "hmac" | "oauth2";
export type ContentType = "json" | "form";
export type Environment = "dev" | "stage" | "prod";

export interface RateLimit {
  rps: number;
  burst: number;
}

export interface BatchConfig {
  maxItems: number;
  maxConcurrency: number;
  itemsPerSecond?: number;
}

export interface ScheduleConfig {
  cron: string;
}

export interface EventBusConfig {
  topic: string;
}

export interface AuthConfig {
  kind: AuthType;
  secretRef?: string;
  header?: string;
}

export interface NetworkConfig {
  ipAllow?: string[];
  contentType?: ContentType;
  maxBytes?: number;
}

export interface IdempotencyConfig {
  enabled: boolean;
  header?: string;
  deriveFrom?: string[];
}

export interface CorrelationConfig {
  field: string;
}

export interface DeadLetterConfig {
  target: string;
  retentionDays: number;
}

export interface StartNodeProps {
  trigger: TriggerType;
  inputSchemaRef?: string;
  rateLimit?: RateLimit;
  batch?: BatchConfig;
  schedule?: ScheduleConfig;
  eventBus?: EventBusConfig;
  auth?: AuthConfig;
  network?: NetworkConfig;
  idempotency?: IdempotencyConfig;
  correlation?: CorrelationConfig;
  deadLetter?: DeadLetterConfig;
  lockPosition?: boolean;
}

export interface StartNodePorts {
  success: string;
  invalid_input?: string;
  throttled?: string;
}

export interface StartNode {
  id: string;
  type: "start";
  name?: string;
  props: StartNodeProps;
  ports: StartNodePorts;
}

export interface FlowEnvironment {
  current: Environment;
  overrides?: {
    [key in Environment]?: Partial<StartNodeProps>;
  };
}

export interface ValidationError {
  field: string;
  message: string;
  severity: "error" | "warning";
}

export interface TestResult {
  timestamp: number;
  status: "success" | "error" | "warning";
  message: string;
  payload?: any;
  response?: any;
  latency?: number;
}