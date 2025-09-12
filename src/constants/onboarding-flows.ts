import type { OnboardingStep } from '@/types/vendor-integration';

export const SMS_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'business',
    title: 'Business Details',
    description: 'Provide your business information',
    required: true,
    component: 'BusinessDetailsForm'
  },
  {
    id: 'compliance',
    title: 'Compliance & Use Case',
    description: 'Specify your SMS use cases and compliance requirements',
    required: true,
    component: 'SMSComplianceForm'
  },
  {
    id: 'credentials',
    title: 'API Credentials',
    description: 'Enter your SMS provider API credentials',
    required: true,
    component: 'SMSCredentialsForm'
  },
  {
    id: 'configuration',
    title: 'Configuration',
    description: 'Configure rate limits and sender ID',
    required: false,
    component: 'SMSConfigurationForm'
  },
  {
    id: 'testing',
    title: 'Test Integration',
    description: 'Send test messages to verify setup',
    required: false,
    component: 'SMSTestingForm'
  }
];

export const WHATSAPP_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'business',
    title: 'Business Details',
    description: 'Provide your business information',
    required: true,
    component: 'BusinessDetailsForm'
  },
  {
    id: 'verification',
    title: 'Business Verification',
    description: 'Verify your business profile',
    required: true,
    component: 'WhatsAppVerificationForm'
  },
  {
    id: 'credentials',
    title: 'WhatsApp Credentials',
    description: 'Configure WhatsApp Business API access',
    required: true,
    component: 'WhatsAppCredentialsForm'
  },
  {
    id: 'templates',
    title: 'Message Templates',
    description: 'Set up your WhatsApp message templates',
    required: false,
    component: 'WhatsAppTemplatesForm'
  },
  {
    id: 'webhooks',
    title: 'Webhook Configuration',
    description: 'Configure webhooks for delivery status',
    required: false,
    component: 'WhatsAppWebhooksForm'
  },
  {
    id: 'testing',
    title: 'Test Integration',
    description: 'Send test messages to verify setup',
    required: false,
    component: 'WhatsAppTestingForm'
  }
];

export const RCS_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'business',
    title: 'Business Details',
    description: 'Provide your business information',
    required: true,
    component: 'BusinessDetailsForm'
  },
  {
    id: 'brand-verification',
    title: 'Brand Verification',
    description: 'Verify your brand with RCS provider',
    required: true,
    component: 'RCSBrandVerificationForm'
  },
  {
    id: 'agent-setup',
    title: 'Agent Configuration',
    description: 'Set up your RCS agent and messaging',
    required: true,
    component: 'RCSAgentSetupForm'
  },
  {
    id: 'credentials',
    title: 'RCS Credentials',
    description: 'Configure RCS API credentials',
    required: true,
    component: 'RCSCredentialsForm'
  },
  {
    id: 'rich-cards',
    title: 'Rich Card Templates',
    description: 'Create rich message templates',
    required: false,
    component: 'RCSRichCardsForm'
  },
  {
    id: 'testing',
    title: 'Test Integration',
    description: 'Send test RCS messages',
    required: false,
    component: 'RCSTestingForm'
  }
];

export const EMAIL_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'business',
    title: 'Business Details',
    description: 'Provide your business information',
    required: true,
    component: 'BusinessDetailsForm'
  },
  {
    id: 'credentials',
    title: 'Email Credentials',
    description: 'Configure email provider settings',
    required: true,
    component: 'EmailCredentialsForm'
  },
  {
    id: 'configuration',
    title: 'Email Configuration',
    description: 'Set up sender details and limits',
    required: false,
    component: 'EmailConfigurationForm'
  },
  {
    id: 'testing',
    title: 'Test Integration',
    description: 'Send test emails to verify setup',
    required: false,
    component: 'EmailTestingForm'
  }
];

export const VOICE_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'business',
    title: 'Business Details',
    description: 'Provide your business information',
    required: true,
    component: 'BusinessDetailsForm'
  },
  {
    id: 'credentials',
    title: 'Voice Credentials',
    description: 'Configure voice provider API settings',
    required: true,
    component: 'VoiceCredentialsForm'
  },
  {
    id: 'configuration',
    title: 'Voice Configuration',
    description: 'Set up caller ID and voice settings',
    required: false,
    component: 'VoiceConfigurationForm'
  },
  {
    id: 'testing',
    title: 'Test Integration',
    description: 'Make test calls to verify setup',
    required: false,
    component: 'VoiceTestingForm'
  }
];

export const getOnboardingSteps = (channel: string): OnboardingStep[] => {
  switch (channel) {
    case 'sms':
      return SMS_ONBOARDING_STEPS;
    case 'whatsapp':
      return WHATSAPP_ONBOARDING_STEPS;
    case 'rcs':
      return RCS_ONBOARDING_STEPS;
    case 'email':
      return EMAIL_ONBOARDING_STEPS;
    case 'voice':
      return VOICE_ONBOARDING_STEPS;
    default:
      return [];
  }
};

export const getChannelRequirements = (channel: string): string[] => {
  switch (channel) {
    case 'sms':
      return [
        'A2P 10DLC registration (for US traffic)',
        'Sender ID registration (for international traffic)',
        'Valid business documentation',
        'API credentials from SMS provider'
      ];
    case 'whatsapp':
      return [
        'Facebook Business Manager account',
        'WhatsApp Business API approval',
        'Business verification documents',
        'Phone number verification',
        'Message template approval'
      ];
    case 'rcs':
      return [
        'Google RCS partner registration',
        'Brand verification with carrier',
        'Agent configuration and approval',
        'Rich messaging capabilities setup'
      ];
    case 'email':
      return [
        'Domain verification',
        'SPF/DKIM/DMARC setup',
        'Email provider API access',
        'Sender reputation management'
      ];
    case 'voice':
      return [
        'Caller ID registration',
        'Voice provider account setup',
        'Local number provisioning',
        'Call routing configuration'
      ];
    default:
      return [];
  }
};