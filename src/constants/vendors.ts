export interface Vendor {
  id: string;
  name: string;
  logo: string;
  type: 'sms' | 'email' | 'rcs' | 'voice' | 'whatsapp';
  description?: string;
}

export const SMS_VENDORS: Vendor[] = [
  { id: 'msg91', name: 'MSG91', logo: '🔴', type: 'sms', description: 'Leading SMS provider' },
  { id: 'twilio', name: 'Twilio', logo: '🔴', type: 'sms', description: 'Global communications platform' },
  { id: 'textlocal', name: 'Textlocal', logo: '🟡', type: 'sms', description: 'UK-based SMS gateway' },
  { id: 'karix', name: 'Karix', logo: '🟢', type: 'sms', description: 'Cloud communications' },
  { id: 'exotel', name: 'Exotel', logo: '🔵', type: 'sms', description: 'Customer engagement platform' },
  { id: 'knowlarity', name: 'Knowlarity', logo: '🟣', type: 'sms', description: 'Cloud telephony solutions' }
];

export const EMAIL_VENDORS: Vendor[] = [
  { id: 'sendgrid', name: 'SendGrid', logo: '🔵', type: 'email', description: 'Email delivery service' },
  { id: 'mailgun', name: 'Mailgun', logo: '🟡', type: 'email', description: 'Email API service' },
  { id: 'amazonses', name: 'Amazon SES', logo: '🟠', type: 'email', description: 'Amazon Simple Email Service' },
  { id: 'postmark', name: 'Postmark', logo: '🟢', type: 'email', description: 'Transactional email service' },
  { id: 'sparkpost', name: 'SparkPost', logo: '🔴', type: 'email', description: 'Email delivery platform' }
];

export const RCS_VENDORS: Vendor[] = [
  { id: 'google', name: 'Google RCS', logo: '🔵', type: 'rcs', description: 'Google Rich Communication Services' },
  { id: 'sinch', name: 'Sinch', logo: '🟡', type: 'rcs', description: 'Cloud communications platform' },
  { id: 'infobip', name: 'Infobip', logo: '🟠', type: 'rcs', description: 'Omnichannel communications' },
  { id: 'messagebird', name: 'MessageBird', logo: '🔵', type: 'rcs', description: 'Customer communications platform' }
];

export const VOICE_VENDORS: Vendor[] = [
  { id: 'twilio', name: 'Twilio', logo: '🔴', type: 'voice', description: 'Voice communication platform' },
  { id: 'vonage', name: 'Vonage', logo: '🟣', type: 'voice', description: 'Cloud communications' },
  { id: 'plivo', name: 'Plivo', logo: '🟢', type: 'voice', description: 'Voice API platform' }
];

export const WHATSAPP_VENDORS: Vendor[] = [
  { id: 'meta', name: 'Meta Business', logo: '🟢', type: 'whatsapp', description: 'Official WhatsApp Business API' },
  { id: 'twilio', name: 'Twilio', logo: '🔴', type: 'whatsapp', description: 'WhatsApp via Twilio' },
  { id: 'infobip', name: 'Infobip', logo: '🟠', type: 'whatsapp', description: 'WhatsApp Business Solution' }
];

export const ALL_VENDORS = [
  ...SMS_VENDORS,
  ...EMAIL_VENDORS,
  ...RCS_VENDORS,
  ...VOICE_VENDORS,
  ...WHATSAPP_VENDORS
];

export const getVendorsByType = (type: Vendor['type']): Vendor[] => {
  switch (type) {
    case 'sms': return SMS_VENDORS;
    case 'email': return EMAIL_VENDORS;
    case 'rcs': return RCS_VENDORS;
    case 'voice': return VOICE_VENDORS;
    case 'whatsapp': return WHATSAPP_VENDORS;
    default: return [];
  }
};

export const getVendorById = (id: string): Vendor | undefined => {
  return ALL_VENDORS.find(vendor => vendor.id === id);
};