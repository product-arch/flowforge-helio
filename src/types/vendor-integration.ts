export interface Vendor {
  id: string;
  name: string;
  logo: string;
  type: 'sms' | 'email' | 'rcs' | 'voice' | 'whatsapp';
  description?: string;
}

export interface VendorCredentials {
  // SMS Credentials
  apiKey?: string;
  apiSecret?: string;
  secretKey?: string;
  senderId?: string;
  
  // Email Credentials
  smtpHost?: string;
  smtpPort?: number;
  username?: string;
  password?: string;
  fromEmail?: string;
  
  // WhatsApp Credentials
  accessToken?: string;
  phoneNumberId?: string;
  businessAccountId?: string;
  verifyToken?: string;
  
  // Voice Credentials
  accountSid?: string;
  authToken?: string;
  twimlAppSid?: string;
  
  // RCS Credentials
  agentId?: string;
  brandId?: string;
  serviceAccountKey?: string;
  
  // Validation fields
  isValid?: boolean;
  lastVerified?: Date;
}

export interface VendorConfiguration {
  // Rate Limiting
  tpsLimit?: number;
  dailyLimit?: number;
  
  // Webhook Settings
  webhookUrl?: string;
  webhookSecret?: string;
  
  // Channel-specific config
  template?: string;
  defaultTemplate?: string;
  enableDeliveryReceipts?: boolean;
  
  // Feature flags
  enableRetry?: boolean;
  healthMonitoring?: boolean;
  
  // Advanced settings
  customConfig?: string;
  
  // Routing preferences
  priority?: number;
  weight?: number;
  costPerMessage?: number;
}

export interface VendorIntegration {
  id: string;
  vendor: Vendor;
  channel: Vendor['type'];
  status: 'inactive' | 'configuring' | 'testing' | 'active' | 'suspended' | 'error';
  credentials: VendorCredentials;
  configuration: VendorConfiguration;
  testResults?: {
    lastTested: Date;
    success: boolean;
    latency?: number;
    errorMessage?: string;
  };
  healthMetrics?: VendorHealth;
  createdAt: Date;
  updatedAt: Date;
}

export interface VendorHealth {
  id: string;
  vendorIntegrationId: string;
  uptimePercentage: number;
  errorRate: number;
  avgLatency: number;
  incidents: number;
  lastIncident?: Date;
  status: 'healthy' | 'warning' | 'critical';
  lastUpdated: Date;
}

export interface OnboardingStepData {
  // Step 1: Business Details
  businessName?: string;
  contactEmail?: string;
  contactPhone?: string;
  businessType?: string;
  
  // Step 2: Use Case
  useCases?: string;
  expectedVolume?: string;
  peakHours?: string;
  
  // Step 3: Credentials (channel-specific)
  credentials?: Partial<VendorCredentials>;
  
  // Step 4: Configuration
  configuration?: Partial<VendorConfiguration>;
  
  // Step 5: Testing
  testMessages?: {
    phoneNumber?: string;
    email?: string;
    message?: string;
  };
}

export interface ChannelOnboardingFlow {
  steps: OnboardingStep[];
  currentStep: number;
  data: OnboardingStepData;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  required: boolean;
  component: string; // Component name to render
}

export interface TestResult {
  id: string;
  timestamp: Date;
  success: boolean;
  latency: number;
  statusCode: number;
  response: string;
  testType: 'manual' | 'automated';
  recipientType: 'phone' | 'email' | 'message';
}