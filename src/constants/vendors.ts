export interface Vendor {
  id: string;
  name: string;
  logo: string;
  type: 'sms' | 'email' | 'rcs' | 'voice' | 'whatsapp';
  description?: string;
}

export const SMS_VENDORS: Vendor[] = [
  { id: 'msg91', name: 'MSG91', logo: 'https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1455514364/pim02bzqvgz0hibsra6i.png', type: 'sms', description: 'Leading SMS provider with global reach' },
  { id: 'twilio', name: 'Twilio', logo: 'https://avatars.githubusercontent.com/u/109142?s=200&v=4', type: 'sms', description: 'Global communications platform' },
  { id: 'textlocal', name: 'Textlocal', logo: 'https://www.textlocal.com/img/logo.png', type: 'sms', description: 'UK-based SMS gateway service' },
  { id: 'karix', name: 'Karix', logo: 'https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1397183267/bed7e1da3b0875a4f68e91e1550b0dc7.png', type: 'sms', description: 'Cloud communications platform' },
  { id: 'exotel', name: 'Exotel', logo: 'https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1445417537/ykhzyuzgsuihp8lmnqxh.png', type: 'sms', description: 'Customer engagement platform' },
  { id: 'knowlarity', name: 'Knowlarity', logo: 'https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1397180373/6ce8e605fa90a09d7ac18f7b5a89bc79.png', type: 'sms', description: 'Cloud telephony solutions' }
];

export const EMAIL_VENDORS: Vendor[] = [
  { id: 'sendgrid', name: 'SendGrid', logo: 'https://avatars.githubusercontent.com/u/181234?s=200&v=4', type: 'email', description: 'Trusted email delivery service' },
  { id: 'mailgun', name: 'Mailgun', logo: 'https://documentation.mailgun.com/en/latest/_images/mailgun.png', type: 'email', description: 'Powerful email API service' },
  { id: 'amazonses', name: 'Amazon SES', logo: 'https://d0.awsstatic.com/logos/powered-by-aws.png', type: 'email', description: 'Amazon Simple Email Service' },
  { id: 'postmark', name: 'Postmark', logo: 'https://postmarkapp.com/images/postmark-logo.svg', type: 'email', description: 'Transactional email experts' },
  { id: 'sparkpost', name: 'SparkPost', logo: 'https://www.sparkpost.com/wp-content/uploads/2020/06/sparkpost-logo.svg', type: 'email', description: 'Email delivery platform' }
];

export const RCS_VENDORS: Vendor[] = [
  { id: 'google', name: 'Google RCS', logo: 'https://developers.google.com/static/identity/images/g-logo.png', type: 'rcs', description: 'Google Rich Communication Services' },
  { id: 'sinch', name: 'Sinch', logo: 'https://www.sinch.com/wp-content/uploads/2021/04/sinch-logo.svg', type: 'rcs', description: 'Cloud communications platform' },
  { id: 'infobip', name: 'Infobip', logo: 'https://www.infobip.com/wp-content/uploads/2021/04/infobip-logo.svg', type: 'rcs', description: 'Omnichannel communications' },
  { id: 'messagebird', name: 'MessageBird', logo: 'https://avatars.githubusercontent.com/u/2567936?s=200&v=4', type: 'rcs', description: 'Customer communications platform' }
];

export const VOICE_VENDORS: Vendor[] = [
  { id: 'twilio-voice', name: 'Twilio Voice', logo: 'https://avatars.githubusercontent.com/u/109142?s=200&v=4', type: 'voice', description: 'Voice communication platform' },
  { id: 'vonage', name: 'Vonage', logo: 'https://www.vonage.com/wp-content/uploads/2021/06/vonage-logo.svg', type: 'voice', description: 'Cloud communications' },
  { id: 'plivo', name: 'Plivo', logo: 'https://www.plivo.com/assets/img/plivo-logo.svg', type: 'voice', description: 'Voice API platform' }
];

export const WHATSAPP_VENDORS: Vendor[] = [
  { id: 'meta', name: 'Meta Business', logo: 'https://about.meta.com/wp-content/uploads/2022/10/meta-logo.png', type: 'whatsapp', description: 'Official WhatsApp Business API' },
  { id: 'twilio-whatsapp', name: 'Twilio WhatsApp', logo: 'https://avatars.githubusercontent.com/u/109142?s=200&v=4', type: 'whatsapp', description: 'WhatsApp via Twilio platform' },
  { id: 'infobip-whatsapp', name: 'Infobip WhatsApp', logo: 'https://www.infobip.com/wp-content/uploads/2021/04/infobip-logo.svg', type: 'whatsapp', description: 'WhatsApp Business Solution' }
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