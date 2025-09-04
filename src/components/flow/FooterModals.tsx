import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Shield, Cookie, FileText, Activity, CheckCircle, AlertCircle, Clock, Tag, Star, Bug, Zap } from 'lucide-react';

interface FooterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<FooterModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Privacy Policy
          </DialogTitle>
          <DialogDescription>
            Last updated: December 2024
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 text-sm">
          <section>
            <h3 className="text-lg font-semibold mb-3">Information We Collect</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Account information (name, email, company details)</li>
                <li>Communication data processed through our platform</li>
                <li>Usage analytics and performance metrics</li>
                <li>Technical information (IP address, browser type, device information)</li>
              </ul>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">How We Use Your Information</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>We use the information we collect to provide, maintain, and improve our services:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Process and route your communications through our platform</li>
                <li>Provide customer support and respond to your requests</li>
                <li>Send important service announcements and updates</li>
                <li>Analyze usage patterns to improve our platform performance</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">Data Security & Protection</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>We implement industry-standard security measures to protect your data:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>End-to-end encryption for all communication data</li>
                <li>SOC 2 Type II compliance and regular security audits</li>
                <li>Role-based access controls and multi-factor authentication</li>
                <li>Data centers with 99.9% uptime and geographic redundancy</li>
                <li>GDPR and CCPA compliance for data protection rights</li>
              </ul>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">Your Rights & Choices</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Access and review your personal data</li>
                <li>Request corrections to inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Export your data in a machine-readable format</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="text-muted-foreground">
              <p>If you have questions about this Privacy Policy, please contact us:</p>
              <p className="mt-2">
                <strong>Email:</strong> privacy@helo.ai<br />
                <strong>Address:</strong> 123 Communication St, Tech City, TC 12345
              </p>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const TermsOfServiceModal: React.FC<FooterModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Terms of Service
          </DialogTitle>
          <DialogDescription>
            Last updated: December 2024
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 text-sm">
          <section>
            <h3 className="text-lg font-semibold mb-3">Acceptance of Terms</h3>
            <p className="text-muted-foreground">
              By accessing or using the Helo.ai Hub platform ("Service"), you agree to be bound by these Terms of Service. 
              If you disagree with any part of these terms, you may not access the Service.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">Service Description</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>Helo.ai Hub provides intelligent communication routing and automation services including:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Multi-channel message routing (SMS, WhatsApp, Email, Voice, RCS)</li>
                <li>Flow builder for creating communication workflows</li>
                <li>Real-time analytics and monitoring dashboards</li>
                <li>API integrations and webhook management</li>
                <li>Template management and AI-powered content generation</li>
              </ul>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">User Responsibilities</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>You are responsible for:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Providing accurate account information and keeping it updated</li>
                <li>Maintaining the security of your account credentials</li>
                <li>Complying with all applicable laws and regulations</li>
                <li>Respecting opt-out requests and consent requirements</li>
                <li>Not using the service for spam or fraudulent activities</li>
                <li>Monitoring your usage to stay within plan limits</li>
              </ul>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">Service Level Agreement</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>We commit to providing reliable service with the following guarantees:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>99.9% uptime for platform availability</li>
                <li>Message delivery within industry standard timeframes</li>
                <li>24/7 customer support for enterprise customers</li>
                <li>Data backup and disaster recovery procedures</li>
                <li>Regular security updates and maintenance</li>
              </ul>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">Billing & Payment</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>Payment terms and conditions:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Subscription fees are billed monthly or annually in advance</li>
                <li>Usage-based charges are calculated monthly in arrears</li>
                <li>All fees are non-refundable except as required by law</li>
                <li>Price changes require 30 days advance notice</li>
                <li>Accounts may be suspended for non-payment</li>
              </ul>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">Limitation of Liability</h3>
            <p className="text-muted-foreground">
              To the maximum extent permitted by law, Helo.ai shall not be liable for any indirect, incidental, 
              special, or consequential damages arising out of your use of the Service. Our total liability 
              shall not exceed the amount paid by you in the twelve months preceding the claim.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="text-muted-foreground">
              <p>Questions about these Terms of Service? Contact us:</p>
              <p className="mt-2">
                <strong>Email:</strong> legal@helo.ai<br />
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const CookiePreferencesModal: React.FC<FooterModalProps> = ({ isOpen, onClose }) => {
  const [cookiePreference, setCookiePreference] = React.useState('essential');

  const handleSavePreferences = () => {
    // Save cookie preferences to localStorage
    localStorage.setItem('cookiePreferences', cookiePreference);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Cookie className="w-4 h-4 text-primary" />
            Cookie Preferences
          </DialogTitle>
          <DialogDescription className="text-xs">
            Manage your cookie preferences and privacy settings
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          <section>
            <h3 className="text-sm font-semibold mb-2">About Cookies</h3>
            <p className="text-xs text-muted-foreground">
              We use cookies to improve your experience and analyze usage patterns. 
              Control which cookies you accept below.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold mb-3">Cookie Categories</h3>
            
            <RadioGroup value={cookiePreference} onValueChange={setCookiePreference} className="space-y-3">
              <div className="border rounded-md p-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="text-sm font-medium">Accept All Cookies</Label>
                </div>
                <p className="text-xs text-muted-foreground ml-5">
                  Allow all cookies including analytics and marketing for the best experience.
                </p>
                <div className="ml-5">
                  <div className="flex items-center gap-1 flex-wrap">
                    <Badge variant="secondary" className="text-xs px-2 py-0">Essential</Badge>
                    <Badge variant="secondary" className="text-xs px-2 py-0">Analytics</Badge>
                    <Badge variant="secondary" className="text-xs px-2 py-0">Marketing</Badge>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="essential" id="essential" />
                  <Label htmlFor="essential" className="text-sm font-medium">Essential Only</Label>
                </div>
                <p className="text-xs text-muted-foreground ml-5">
                  Only cookies required for basic functionality. Some features may be limited.
                </p>
                <div className="ml-5">
                  <Badge variant="secondary" className="text-xs px-2 py-0">Essential</Badge>
                </div>
              </div>

              <div className="border rounded-md p-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reject" id="reject" />
                  <Label htmlFor="reject" className="text-sm font-medium">Reject All</Label>
                </div>
                <p className="text-xs text-muted-foreground ml-5">
                  Block all non-essential cookies. Limited functionality.
                </p>
                <div className="ml-5">
                  <Badge variant="outline" className="text-xs px-2 py-0">None</Badge>
                </div>
              </div>
            </RadioGroup>
          </section>

          <Separator />

          <section>
            <h3 className="text-sm font-semibold mb-2">Cookie Details</h3>
            <div className="space-y-2 text-xs">
              <div>
                <h4 className="font-medium text-xs">Essential Cookies</h4>
                <p className="text-muted-foreground">Authentication, security, and core functionality.</p>
              </div>
              <div>
                <h4 className="font-medium text-xs">Analytics Cookies</h4>
                <p className="text-muted-foreground">Usage analytics to improve platform performance.</p>
              </div>
              <div>
                <h4 className="font-medium text-xs">Marketing Cookies</h4>
                <p className="text-muted-foreground">Relevant advertisements and campaign tracking.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="flex-shrink-0 flex justify-end gap-2 pt-3 border-t">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSavePreferences}>
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Status Heatmap Component
const StatusHeatmap: React.FC = () => {
  // Generate year data with better distribution across months
  const generateYearData = () => {
    const data = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const blocksPerMonth = 30; // ~30 blocks per month for better spread
    
    for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
      for (let blockIdx = 0; blockIdx < blocksPerMonth; blockIdx++) {
        // Generate random status based on probability
        const rand = Math.random();
        let status: 'operational' | 'minor' | 'major';
        
        if (rand > 0.95) status = 'major';
        else if (rand > 0.85) status = 'minor';
        else status = 'operational';
        
        data.push({
          month: months[monthIdx],
          monthIdx,
          blockIdx,
          status,
          row: blockIdx % 7, // Limit to 7 rows
          col: Math.floor(blockIdx / 7) + (monthIdx * 5) // Spread across columns
        });
      }
    }
    return data;
  };

  const yearData = generateYearData();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const totalCols = 60; // Spread across more columns for better distribution
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-emerald-500';
      case 'minor':
        return 'bg-yellow-500';
      case 'major':
        return 'bg-red-500';
      default:
        return 'bg-gray-200 dark:bg-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">System reliability over 12 months</span>
        <div className="flex items-center gap-2 text-xs">
          <span>Less issues</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-sm"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-sm"></div>
            <div className="w-2 h-2 bg-red-500 rounded-sm"></div>
          </div>
          <span>More issues</span>
        </div>
      </div>
      
      {/* Month labels */}
      <div className="flex justify-between text-xs text-muted-foreground mb-2">
        {months.map((month, idx) => (
          <span key={idx}>{month}</span>
        ))}
      </div>
      
      {/* Heatmap grid - 7 rows, distributed columns */}
      <div className="w-full overflow-x-auto">
        <div 
          className="grid gap-[2px]" 
          style={{ 
            gridTemplateColumns: `repeat(${totalCols}, 1fr)`,
            gridTemplateRows: 'repeat(7, 1fr)',
            minWidth: '600px'
          }}
        >
          {Array.from({ length: 7 * totalCols }, (_, index) => {
            const row = index % 7;
            const col = Math.floor(index / 7);
            
            // Find matching data point
            const dataPoint = yearData.find(d => d.row === row && d.col === col);
            
            if (!dataPoint) {
              return (
                <div
                  key={index}
                  className="w-2 h-2 bg-gray-100 dark:bg-gray-800 rounded-sm"
                />
              );
            }
            
            return (
              <div
                key={index}
                className={`w-2 h-2 rounded-sm ${getStatusColor(dataPoint.status)} hover:scale-125 transition-transform cursor-pointer`}
                title={`${dataPoint.month}: ${dataPoint.status}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const SystemStatusModal: React.FC<FooterModalProps> = ({ isOpen, onClose }) => {
  const services = [
    {
      name: 'API Gateway',
      status: 'operational',
      description: 'Core API services and authentication',
      uptime: '99.98%',
      responseTime: '45ms'
    },
    {
      name: 'Message Routing Engine',
      status: 'operational',
      description: 'SMS, WhatsApp, and Email routing',
      uptime: '99.95%',
      responseTime: '12ms'
    },
    {
      name: 'Analytics Pipeline',
      status: 'operational',
      description: 'Real-time data processing and reporting',
      uptime: '99.92%',
      responseTime: '78ms'
    },
    {
      name: 'Webhook Delivery',
      status: 'operational',
      description: 'Event notifications and callbacks',
      uptime: '99.97%',
      responseTime: '23ms'
    },
    {
      name: 'Template Engine',
      status: 'maintenance',
      description: 'Message template processing and AI generation',
      uptime: '99.89%',
      responseTime: '156ms'
    },
    {
      name: 'Voice Services',
      status: 'operational',
      description: 'Voice call routing and IVR systems',
      uptime: '99.94%',
      responseTime: '67ms'
    }
  ];

  const incidents = [
    {
      date: '2024-12-01 14:30 UTC',
      title: 'Scheduled maintenance for Template Engine',
      status: 'in-progress',
      description: 'Deploying performance improvements to AI template generation. Expected completion: 16:00 UTC.',
      impact: 'Minor'
    },
    {
      date: '2024-11-28 09:15 UTC',
      title: 'Brief WhatsApp delivery delays resolved',
      status: 'resolved',
      description: 'Temporary delays in WhatsApp message delivery due to upstream provider issues. Fully resolved.',
      impact: 'Minor'
    },
    {
      date: '2024-11-25 18:45 UTC',
      title: 'Analytics dashboard intermittent loading',
      status: 'resolved',
      description: 'Some users experienced slow loading times for analytics dashboards. Database optimization completed.',
      impact: 'Low'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'maintenance':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'degraded':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'outage':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'maintenance':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'degraded':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'outage':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            System Status Dashboard
          </DialogTitle>
          <DialogDescription>
            Real-time status of all Helo.ai platform services and infrastructure
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Overall Status */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
              <div>
                <h3 className="text-lg font-semibold text-emerald-800">All Systems Operational</h3>
                <p className="text-sm text-emerald-600">Platform is running smoothly with no major incidents</p>
              </div>
            </div>
          </div>

          {/* Status History Heatmap */}
          <section>
            <h3 className="text-lg font-semibold mb-4">System Reliability History</h3>
            <div className="border rounded-lg p-4 bg-card">
              <StatusHeatmap />
            </div>
          </section>

          {/* Service Status */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Service Status</h3>
            <div className="grid gap-3">
              {services.map((service) => (
                <div key={service.name} className="border rounded-lg p-4 bg-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold">{service.uptime}</div>
                        <div className="text-muted-foreground">Uptime</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{service.responseTime}</div>
                        <div className="text-muted-foreground">Response</div>
                      </div>
                      <Badge className={`${getStatusColor(service.status)}`}>
                        {service.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Incidents */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Recent Incidents</h3>
            <div className="space-y-3">
              {incidents.map((incident, index) => (
                <div key={index} className="border rounded-lg p-4 bg-card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{incident.title}</h4>
                        <Badge variant={incident.status === 'resolved' ? 'default' : 'secondary'}>
                          {incident.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {incident.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{incident.description}</p>
                      <p className="text-xs text-muted-foreground">{incident.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Performance Metrics */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-accent/30 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">99.96%</div>
                <div className="text-xs text-muted-foreground">Overall Uptime</div>
              </div>
              <div className="text-center p-3 bg-accent/30 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">47ms</div>
                <div className="text-xs text-muted-foreground">Avg Response Time</div>
              </div>
              <div className="text-center p-3 bg-accent/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-xs text-muted-foreground">Active Incidents</div>
              </div>
            </div>
          </section>

          <div className="text-xs text-muted-foreground text-center">
            Status page updates automatically every 30 seconds. Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const VersionModal: React.FC<FooterModalProps> = ({ isOpen, onClose }) => {
  const versions = [
    {
      version: 'v2.4.1',
      releaseDate: 'December 15, 2024',
      status: 'Current',
      changes: {
        features: [
          'Enhanced flow builder with drag-and-drop template components',
          'Real-time collaboration on flow editing with team members',
          'Advanced analytics dashboard with custom metric builders',
          'Multi-language support for message templates (15+ languages)',
          'Smart routing algorithms with ML-powered cost optimization'
        ],
        fixes: [
          'Resolved webhook delivery timeout issues for high-volume campaigns',
          'Fixed analytics dashboard loading delays on large datasets',
          'Corrected message template variable substitution edge cases',
          'Improved SMS delivery rate reporting accuracy',
          'Fixed flow export/import functionality for complex workflows'
        ],
        qol: [
          'Streamlined onboarding process with interactive tutorials',
          'Enhanced search functionality across all platform modules',
          'Improved mobile responsiveness for monitoring dashboards',
          'Added keyboard shortcuts for common flow builder actions',
          'Updated notification system with better categorization'
        ]
      }
    },
    {
      version: 'v2.3.8',
      releaseDate: 'November 28, 2024',
      status: 'Previous',
      changes: {
        features: [
          'Introduction of RCS messaging channel support',
          'Advanced message scheduling with timezone intelligence',
          'Custom webhook authentication methods (OAuth 2.0, API Key)',
          'Batch operations for managing large contact lists',
          'Integration marketplace with 50+ pre-built connectors'
        ],
        fixes: [
          'Resolved memory leak in long-running flow processes',
          'Fixed WhatsApp media upload size validation issues',
          'Corrected timezone handling in scheduled message campaigns',
          'Improved error handling for failed API integrations',
          'Fixed duplicate message prevention in high-frequency flows'
        ],
        qol: [
          'Enhanced dark mode support across all interfaces',
          'Improved bulk import/export performance for large datasets',
          'Added context-sensitive help tooltips throughout the platform',
          'Streamlined billing and usage reporting interface',
          'Enhanced audit logging with detailed activity tracking'
        ]
      }
    },
    {
      version: 'v2.2.5',
      releaseDate: 'October 10, 2024',
      status: 'Legacy',
      changes: {
        features: [
          'Voice channel integration with IVR support',
          'Advanced message personalization using AI content generation',
          'Multi-vendor failover configuration with priority routing',
          'Campaign performance A/B testing framework',
          'Enterprise-grade security with SOC 2 Type II compliance'
        ],
        fixes: [
          'Resolved concurrent user access issues in flow builder',
          'Fixed message queue processing delays during peak traffic',
          'Corrected template validation for complex conditional logic',
          'Improved database connection pooling for better performance',
          'Fixed cross-browser compatibility issues in flow visualizer'
        ],
        qol: [
          'Redesigned navigation with improved information architecture',
          'Enhanced user permission management with granular controls',
          'Added comprehensive API documentation with interactive examples',
          'Improved system health monitoring with proactive alerts',
          'Enhanced customer support integration with in-app ticketing'
        ]
      }
    }
  ];

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'features':
        return <Star className="w-4 h-4 text-blue-500" />;
      case 'fixes':
        return <Bug className="w-4 h-4 text-red-500" />;
      case 'qol':
        return <Zap className="w-4 h-4 text-yellow-500" />;
      default:
        return <Tag className="w-4 h-4 text-gray-500" />;
    }
  };

  const getChangeTypeLabel = (type: string) => {
    switch (type) {
      case 'features':
        return 'New Features';
      case 'fixes':
        return 'Bug Fixes';
      case 'qol':
        return 'Quality of Life';
      default:
        return 'Changes';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" />
            Release Notes
          </DialogTitle>
          <DialogDescription>
            Latest updates, features, and improvements to the Helo.ai Hub platform
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {versions.map((version, index) => (
            <div key={version.version} className="border rounded-lg bg-card">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{version.version}</h3>
                    <Badge variant={version.status === 'Current' ? 'default' : 'secondary'}>
                      {version.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {version.releaseDate}
                  </div>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {Object.entries(version.changes).map(([type, items]) => (
                  <div key={type}>
                    <div className="flex items-center gap-2 mb-3">
                      {getChangeIcon(type)}
                      <h4 className="font-medium">{getChangeTypeLabel(type)}</h4>
                    </div>
                    <ul className="space-y-2 ml-6">
                      {items.map((item: string, itemIndex: number) => (
                        <li key={itemIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                          <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex-shrink-0 flex justify-between items-center pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            Need help with the latest updates? Contact our support team.
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};