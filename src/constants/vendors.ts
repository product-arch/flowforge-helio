export interface Vendor {
  id: string;
  name: string;
  logo: string;
  type: 'sms' | 'email' | 'rcs' | 'voice' | 'whatsapp';
  description?: string;
}

export const SMS_VENDORS: Vendor[] = [
  { id: 'msg91', name: 'MSG91', logo: '/vendors/msg91.svg', type: 'sms', description: 'Leading SMS provider with global reach' },
  { id: 'twilio', name: 'Twilio', logo: '/vendors/twilio.svg', type: 'sms', description: 'Global communications platform' },
  { id: 'textlocal', name: 'Textlocal', logo: '/vendors/textlocal.svg', type: 'sms', description: 'UK-based SMS gateway service' },
  { id: 'karix', name: 'Karix', logo: '/vendors/karix.svg', type: 'sms', description: 'Cloud communications platform' },
  { id: 'exotel', name: 'Exotel', logo: '/vendors/exotel.svg', type: 'sms', description: 'Customer engagement platform' },
  { id: 'knowlarity', name: 'Knowlarity', logo: '/vendors/knowlarity.svg', type: 'sms', description: 'Cloud telephony solutions' }
];

export const EMAIL_VENDORS: Vendor[] = [
  { id: 'sendgrid', name: 'SendGrid', logo: '/vendors/sendgrid.svg', type: 'email', description: 'Trusted email delivery service' },
  { id: 'mailgun', name: 'Mailgun', logo: '/vendors/mailgun.svg', type: 'email', description: 'Powerful email API service' },
  { id: 'amazonses', name: 'Amazon SES', logo: '/vendors/amazonses.svg', type: 'email', description: 'Amazon Simple Email Service' },
  { id: 'postmark', name: 'Postmark', logo: '/vendors/postmark.svg', type: 'email', description: 'Transactional email experts' },
  { id: 'sparkpost', name: 'SparkPost', logo: '/vendors/sparkpost.svg', type: 'email', description: 'Email delivery platform' }
];

export const RCS_VENDORS: Vendor[] = [
  { id: 'google', name: 'Google RCS', logo: '/vendors/google.svg', type: 'rcs', description: 'Google Rich Communication Services' },
  { id: 'sinch', name: 'Sinch', logo: '/vendors/sinch.svg', type: 'rcs', description: 'Cloud communications platform' },
  { id: 'infobip', name: 'Infobip', logo: '/vendors/infobip.svg', type: 'rcs', description: 'Omnichannel communications' },
  { id: 'messagebird', name: 'MessageBird', logo: '/vendors/messagebird.svg', type: 'rcs', description: 'Customer communications platform' }
];

export const VOICE_VENDORS: Vendor[] = [
  { id: 'twilio-voice', name: 'Twilio Voice', logo: '/vendors/twilio.svg', type: 'voice', description: 'Voice communication platform' },
  { id: 'vonage', name: 'Vonage', logo: '/vendors/vonage.svg', type: 'voice', description: 'Cloud communications' },
  { id: 'plivo', name: 'Plivo', logo: '/vendors/plivo.svg', type: 'voice', description: 'Voice API platform' }
];

export const WHATSAPP_VENDORS: Vendor[] = [
  { id: 'meta', name: 'Meta Business', logo: '/vendors/meta.svg', type: 'whatsapp', description: 'Official WhatsApp Business API' },
  { id: 'twilio-whatsapp', name: 'Twilio WhatsApp', logo: '/vendors/twilio.svg', type: 'whatsapp', description: 'WhatsApp via Twilio platform' },
  { id: 'infobip-whatsapp', name: 'Infobip WhatsApp', logo: '/vendors/infobip.svg', type: 'whatsapp', description: 'WhatsApp Business Solution' }
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