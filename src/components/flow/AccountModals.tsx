import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface PersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PersonalInfoModal: React.FC<PersonalInfoModalProps> = ({ isOpen, onClose }) => {
  const [personalData, setPersonalData] = React.useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Corporation',
    role: 'Marketing Manager',
    timezone: 'America/New_York'
  });

  const handleSave = () => {
    // Save logic here
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Personal Information</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={personalData.firstName}
                onChange={(e) => setPersonalData(prev => ({ ...prev, firstName: e.target.value }))}
                className="nodrag"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={personalData.lastName}
                onChange={(e) => setPersonalData(prev => ({ ...prev, lastName: e.target.value }))}
                className="nodrag"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={personalData.email}
              onChange={(e) => setPersonalData(prev => ({ ...prev, email: e.target.value }))}
              className="nodrag"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={personalData.phone}
              onChange={(e) => setPersonalData(prev => ({ ...prev, phone: e.target.value }))}
              className="nodrag"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={personalData.company}
              onChange={(e) => setPersonalData(prev => ({ ...prev, company: e.target.value }))}
              className="nodrag"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={personalData.role}
              onChange={(e) => setPersonalData(prev => ({ ...prev, role: e.target.value }))}
              className="nodrag"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input
              id="timezone"
              value={personalData.timezone}
              onChange={(e) => setPersonalData(prev => ({ ...prev, timezone: e.target.value }))}
              className="nodrag"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gradient-primary">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = React.useState({
    emailNotifications: true,
    smsNotifications: false,
    autoSave: true,
    darkMode: false,
    language: 'English',
    defaultFlowTimeout: '30'
  });

  const handleSave = () => {
    // Save logic here
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                  className="w-4 h-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="smsNotifications">SMS Notifications</Label>
                <input
                  type="checkbox"
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onChange={(e) => setSettings(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                  className="w-4 h-4"
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-3">Flow Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoSave">Auto-save flows</Label>
                <input
                  type="checkbox"
                  id="autoSave"
                  checked={settings.autoSave}
                  onChange={(e) => setSettings(prev => ({ ...prev, autoSave: e.target.checked }))}
                  className="w-4 h-4"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeout">Default Flow Timeout (seconds)</Label>
                <Input
                  id="timeout"
                  value={settings.defaultFlowTimeout}
                  onChange={(e) => setSettings(prev => ({ ...prev, defaultFlowTimeout: e.target.value }))}
                  className="nodrag"
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-3">Preferences</h3>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <select
                id="language"
                value={settings.language}
                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gradient-primary">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const BillingModal: React.FC<BillingModalProps> = ({ isOpen, onClose }) => {
  const currentDate = new Date();
  const nextBillingDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  
  const billingData = {
    plan: 'Professional',
    status: 'Active',
    nextBillingDate: nextBillingDate.toISOString().split('T')[0],
    monthlyUsage: '15,432',
    monthlyLimit: '50,000',
    totalCost: '$299.00',
    yearToDateSpend: '$2,392.00'
  };

  // Usage breakdown by channel
  const channelUsage = [
    { channel: 'SMS', used: 8420, cost: '$84.20', percentage: 54 },
    { channel: 'WhatsApp', used: 3890, cost: '$77.80', percentage: 25 },
    { channel: 'Email', used: 2100, cost: '$21.00', percentage: 14 },
    { channel: 'Voice', used: 850, cost: '$85.00', percentage: 5 },
    { channel: 'RCS', used: 172, cost: '$17.20', percentage: 2 }
  ];

  // Monthly usage trends (last 6 months)
  const usageTrends = [
    { month: 'Aug', usage: 15432, cost: 299 },
    { month: 'Jul', usage: 12850, cost: 257 },
    { month: 'Jun', usage: 18200, cost: 364 },
    { month: 'May', usage: 16750, cost: 335 },
    { month: 'Apr', usage: 14200, cost: 284 },
    { month: 'Mar', usage: 11900, cost: 238 }
  ];

  // Cost breakdown
  const costBreakdown = [
    { category: 'Base Subscription', amount: 199.00, description: 'Professional Plan' },
    { category: 'SMS Messages', amount: 84.20, description: '8,420 messages @ $0.01 each' },
    { category: 'WhatsApp Messages', amount: 77.80, description: '3,890 messages @ $0.02 each' },
    { category: 'Email Messages', amount: 21.00, description: '2,100 messages @ $0.01 each' },
    { category: 'Voice Minutes', amount: 85.00, description: '850 minutes @ $0.10 each' },
    { category: 'RCS Messages', amount: 17.20, description: '172 messages @ $0.10 each' },
    { category: 'Premium Support', amount: 50.00, description: 'Priority support included' }
  ];

  const getRecentInvoices = () => {
    const invoices = [];
    for (let i = 0; i < 6; i++) {
      const invoiceDate = new Date(currentDate.getTime() - (i + 1) * 30 * 24 * 60 * 60 * 1000);
      const amounts = ['$299.00', '$257.00', '$364.00', '$335.00', '$284.00', '$238.00'];
      invoices.push({
        date: invoiceDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: amounts[i] || '$299.00',
        status: 'Paid',
        invoice: `INV-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
      });
    }
    return invoices;
  };

  const recentInvoices = getRecentInvoices();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Billing & Subscription</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Plan & Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Current Plan
                  <Badge variant="default" className="bg-status-success text-white">
                    {billingData.status}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {billingData.plan} Plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Next Billing Date</Label>
                    <p className="font-medium">{billingData.nextBillingDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">This Month</Label>
                    <p className="font-medium">{billingData.totalCost}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-muted-foreground">Usage This Month</Label>
                  <p className="font-medium">{billingData.monthlyUsage} / {billingData.monthlyLimit} messages</p>
                  <div className="w-full bg-secondary rounded-full h-2 mt-1">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(parseInt(billingData.monthlyUsage.replace(',', '')) / parseInt(billingData.monthlyLimit.replace(',', ''))) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((parseInt(billingData.monthlyUsage.replace(',', '')) / parseInt(billingData.monthlyLimit.replace(',', ''))) * 100)}% of monthly limit used
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Spending Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">This Month</Label>
                    <p className="text-2xl font-bold text-primary">{billingData.totalCost}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Year to Date</Label>
                    <p className="text-2xl font-bold">{billingData.yearToDateSpend}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>vs. last month</span>
                    <span className="text-red-500">+16.4% ($42)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg. monthly spend</span>
                    <span className="text-muted-foreground">$299</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage by Channel */}
          <Card>
            <CardHeader>
              <CardTitle>Usage by Channel</CardTitle>
              <CardDescription>Breakdown of usage and costs by communication channel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channelUsage.map((channel, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-16 justify-center">
                          {channel.channel}
                        </Badge>
                        <span className="font-medium">{channel.used.toLocaleString()} messages</span>
                      </div>
                      <span className="font-medium">{channel.cost}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${channel.percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{channel.percentage}% of total usage</span>
                      <span>{((channel.used / parseInt(billingData.monthlyUsage.replace(',', ''))) * 100).toFixed(1)}% of monthly limit</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Usage Trends */}
          <Card>
            <CardHeader>
              <CardTitle>6-Month Usage Trends</CardTitle>
              <CardDescription>Monthly usage and cost trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-6 gap-2">
                  {usageTrends.reverse().map((trend, index) => (
                    <div key={index} className="text-center space-y-2">
                      <div className="text-xs text-muted-foreground">{trend.month}</div>
                      <div className="flex flex-col items-center">
                        <div 
                          className="w-8 bg-primary rounded-t" 
                          style={{ height: `${(trend.usage / 20000) * 80}px`, minHeight: '20px' }}
                        />
                        <div className="text-xs mt-1">{(trend.usage / 1000).toFixed(1)}k</div>
                        <div className="text-xs text-muted-foreground">${trend.cost}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Current Month Cost Breakdown</CardTitle>
              <CardDescription>Detailed breakdown of charges for this billing period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {costBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium">{item.category}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="text-right font-medium">
                      ${item.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2 border-t-2 border-primary font-bold">
                  <span>Total</span>
                  <span>${costBreakdown.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>Past 6 months billing history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentInvoices.map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium">{invoice.date}</p>
                      <p className="text-sm text-muted-foreground">Invoice #{invoice.invoice}</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="font-medium">{invoice.amount}</p>
                        <Badge variant="outline" className="text-xs">
                          {invoice.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <div className="flex justify-between gap-2">
            <div className="flex gap-2">
              <Button variant="outline">
                Upgrade Plan
              </Button>
              <Button variant="outline">
                Usage Alerts
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button className="bg-gradient-primary">
                Download Statement
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = React.useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    systemUpdates: true,
    securityAlerts: true,
    marketingEmails: false,
    weeklyReports: true,
    flowFailures: true,
    alertSound: 'default',
    quietHours: { enabled: false, start: '22:00', end: '07:00' },
    frequency: 'immediate',
    channels: ['email', 'push']
  });

  const handleSave = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Notification Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Alert Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alert Types</CardTitle>
              <CardDescription>Choose which types of notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">System Updates</Label>
                  <p className="text-sm text-muted-foreground">New features and system maintenance</p>
                </div>
                <Switch 
                  checked={settings.systemUpdates}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, systemUpdates: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Security Alerts</Label>
                  <p className="text-sm text-muted-foreground">Login attempts and security events</p>
                </div>
                <Switch 
                  checked={settings.securityAlerts}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, securityAlerts: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Flow Failures</Label>
                  <p className="text-sm text-muted-foreground">When your flows encounter errors</p>
                </div>
                <Switch 
                  checked={settings.flowFailures}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, flowFailures: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">Usage summaries and analytics</p>
                </div>
                <Switch 
                  checked={settings.weeklyReports}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, weeklyReports: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Delivery Channels */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Delivery Channels</CardTitle>
              <CardDescription>How would you like to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Email Notifications</Label>
                <Switch 
                  checked={settings.emailAlerts}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailAlerts: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="font-medium">SMS Alerts</Label>
                <Switch 
                  checked={settings.smsAlerts}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smsAlerts: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="font-medium">Push Notifications</Label>
                <Switch 
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Frequency & Timing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Frequency & Timing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Notification Frequency</Label>
                <Select value={settings.frequency} onValueChange={(value) => setSettings(prev => ({ ...prev, frequency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="hourly">Hourly digest</SelectItem>
                    <SelectItem value="daily">Daily digest</SelectItem>
                    <SelectItem value="weekly">Weekly digest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Quiet Hours</Label>
                  <Switch 
                    checked={settings.quietHours.enabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ 
                      ...prev, 
                      quietHours: { ...prev.quietHours, enabled: checked }
                    }))}
                  />
                </div>
                
                {settings.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4 pl-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Start time</Label>
                      <Input 
                        type="time" 
                        value={settings.quietHours.start}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          quietHours: { ...prev.quietHours, start: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">End time</Label>
                      <Input 
                        type="time" 
                        value={settings.quietHours.end}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          quietHours: { ...prev.quietHours, end: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gradient-primary">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = React.useState({
    language: 'English',
    region: 'United States',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12-hour',
    timezone: 'America/New_York',
    currency: 'USD',
    numberFormat: 'US',
    firstDayOfWeek: 'Sunday'
  });

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'fr', name: 'French', native: 'Français' },
    { code: 'de', name: 'German', native: 'Deutsch' },
    { code: 'it', name: 'Italian', native: 'Italiano' },
    { code: 'pt', name: 'Portuguese', native: 'Português' },
    { code: 'zh', name: 'Chinese', native: '中文' },
    { code: 'ja', name: 'Japanese', native: '日本語' },
    { code: 'ko', name: 'Korean', native: '한국어' },
    { code: 'ar', name: 'Arabic', native: 'العربية' }
  ];

  const regions = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
    'France', 'Spain', 'Italy', 'Japan', 'South Korea', 'China', 'India', 'Brazil'
  ];

  const timezones = [
    'America/New_York', 'America/Los_Angeles', 'America/Chicago', 'America/Denver',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai',
    'Asia/Kolkata', 'Australia/Sydney', 'Pacific/Auckland'
  ];

  const handleSave = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Language & Region Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Language</CardTitle>
              <CardDescription>Choose your preferred language for the interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Interface Language</Label>
                <Select value={settings.language} onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.name}>
                        {lang.name} ({lang.native})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Region Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Region</CardTitle>
              <CardDescription>Set your location and regional preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Country/Region</Label>
                <Select value={settings.region} onValueChange={(value) => setSettings(prev => ({ ...prev, region: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select value={settings.timezone} onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map(tz => (
                      <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={settings.currency} onValueChange={(value) => setSettings(prev => ({ ...prev, currency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Format Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Format Preferences</CardTitle>
              <CardDescription>Customize how dates, times, and numbers are displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select value={settings.dateFormat} onValueChange={(value) => setSettings(prev => ({ ...prev, dateFormat: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      <SelectItem value="DD-MM-YYYY">DD-MM-YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Time Format</Label>
                  <Select value={settings.timeFormat} onValueChange={(value) => setSettings(prev => ({ ...prev, timeFormat: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12-hour">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24-hour">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>First Day of Week</Label>
                <Select value={settings.firstDayOfWeek} onValueChange={(value) => setSettings(prev => ({ ...prev, firstDayOfWeek: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sunday">Sunday</SelectItem>
                    <SelectItem value="Monday">Monday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gradient-primary">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = React.useState({
    profileVisibility: 'private',
    shareAnalytics: false,
    cookieConsent: true,
    dataProcessing: true,
    thirdPartySharing: false,
    marketingConsent: false,
    sessionTimeout: '30',
    twoFactorAuth: false,
    loginNotifications: true,
    dataRetention: '12',
    anonymizeData: true
  });

  const handleSave = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Privacy & Security Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Account Security */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Security</CardTitle>
              <CardDescription>Protect your account with these security measures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch 
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, twoFactorAuth: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Login Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                </div>
                <Switch 
                  checked={settings.loginNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, loginNotifications: checked }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Select value={settings.sessionTimeout} onValueChange={(value) => setSettings(prev => ({ ...prev, sessionTimeout: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="480">8 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Data Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Privacy</CardTitle>
              <CardDescription>Control how your data is collected and used</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Share Usage Analytics</Label>
                  <p className="text-sm text-muted-foreground">Help improve our service by sharing anonymous usage data</p>
                </div>
                <Switch 
                  checked={settings.shareAnalytics}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, shareAnalytics: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Cookie Consent</Label>
                  <p className="text-sm text-muted-foreground">Allow non-essential cookies for enhanced experience</p>
                </div>
                <Switch 
                  checked={settings.cookieConsent}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, cookieConsent: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Anonymize Personal Data</Label>
                  <p className="text-sm text-muted-foreground">Remove personally identifiable information from analytics</p>
                </div>
                <Switch 
                  checked={settings.anonymizeData}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, anonymizeData: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Marketing & Communications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Marketing & Communications</CardTitle>
              <CardDescription>Manage how we communicate with you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Receive promotional emails and product updates</p>
                </div>
                <Switch 
                  checked={settings.marketingConsent}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, marketingConsent: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Third-Party Sharing</Label>
                  <p className="text-sm text-muted-foreground">Allow sharing data with trusted partners</p>
                </div>
                <Switch 
                  checked={settings.thirdPartySharing}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, thirdPartySharing: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Retention</CardTitle>
              <CardDescription>Control how long your data is stored</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Data Retention Period (months)</Label>
                <Select value={settings.dataRetention} onValueChange={(value) => setSettings(prev => ({ ...prev, dataRetention: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 months</SelectItem>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  How long to keep your activity logs and usage data
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Data Rights</CardTitle>
              <CardDescription>Request actions on your personal data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Download My Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Request Data Correction
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                Delete My Account
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gradient-primary">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const DataManagementModal: React.FC<DataManagementModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = React.useState({
    autoBackup: true,
    backupFrequency: 'daily',
    dataEncryption: true,
    compressionLevel: 'medium',
    storageLimit: '10GB',
    autoCleanup: true,
    cleanupPeriod: '90'
  });

  const storageStats = {
    used: '2.4GB',
    total: '10GB',
    percentage: 24,
    flows: '1.2GB',
    logs: '800MB',
    media: '300MB',
    backups: '100MB'
  };

  const handleSave = () => {
    onClose();
  };

  const handleExportData = () => {
    // Export logic here
    console.log('Exporting data...');
  };

  const handleImportData = () => {
    // Import logic here
    console.log('Importing data...');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Data Management</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Storage Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Storage Overview</CardTitle>
              <CardDescription>Current usage and breakdown of your data storage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Used Storage</span>
                  <span>{storageStats.used} of {storageStats.total}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full" 
                    style={{ width: `${storageStats.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {storageStats.percentage}% of storage limit used
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Flows</span>
                    <span className="text-sm font-medium">{storageStats.flows}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Logs</span>
                    <span className="text-sm font-medium">{storageStats.logs}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Media</span>
                    <span className="text-sm font-medium">{storageStats.media}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Backups</span>
                    <span className="text-sm font-medium">{storageStats.backups}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Backup Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Backup Settings</CardTitle>
              <CardDescription>Configure automatic backups of your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Automatic Backup</Label>
                  <p className="text-sm text-muted-foreground">Automatically backup your flows and settings</p>
                </div>
                <Switch 
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoBackup: checked }))}
                />
              </div>
              
              {settings.autoBackup && (
                <div className="space-y-2 pl-4">
                  <Label>Backup Frequency</Label>
                  <Select value={settings.backupFrequency} onValueChange={(value) => setSettings(prev => ({ ...prev, backupFrequency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Every hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Data Encryption</Label>
                  <p className="text-sm text-muted-foreground">Encrypt backups for enhanced security</p>
                </div>
                <Switch 
                  checked={settings.dataEncryption}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, dataEncryption: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Import/Export */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Import & Export</CardTitle>
              <CardDescription>Import or export your flows and configurations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={handleExportData} className="w-full">
                  Export All Data
                </Button>
                <Button variant="outline" onClick={handleImportData} className="w-full">
                  Import Data
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label>Compression Level</Label>
                <Select value={settings.compressionLevel} onValueChange={(value) => setSettings(prev => ({ ...prev, compressionLevel: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (faster, larger files)</SelectItem>
                    <SelectItem value="medium">Medium (balanced)</SelectItem>
                    <SelectItem value="high">High (slower, smaller files)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Export Options</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="flows" defaultChecked />
                    <Label htmlFor="flows" className="text-sm">Flows and configurations</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="settings" defaultChecked />
                    <Label htmlFor="settings" className="text-sm">User settings</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="logs" />
                    <Label htmlFor="logs" className="text-sm">Activity logs</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Auto-Cleanup */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Auto-Cleanup</CardTitle>
              <CardDescription>Automatically remove old data to free up storage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Enable Auto-Cleanup</Label>
                  <p className="text-sm text-muted-foreground">Automatically delete old logs and temporary files</p>
                </div>
                <Switch 
                  checked={settings.autoCleanup}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoCleanup: checked }))}
                />
              </div>
              
              {settings.autoCleanup && (
                <div className="space-y-2 pl-4">
                  <Label>Cleanup Period (days)</Label>
                  <Select value={settings.cleanupPeriod} onValueChange={(value) => setSettings(prev => ({ ...prev, cleanupPeriod: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Files older than this will be automatically deleted
                  </p>
                </div>
              )}
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  Run Cleanup Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gradient-primary">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = React.useState({
    enabled: true,
    showTooltips: true,
    customShortcuts: {},
    globalShortcuts: true
  });

  const shortcuts = [
    {
      category: 'General',
      items: [
        { action: 'Search', shortcut: 'Ctrl + K', description: 'Open search dialog' },
        { action: 'Save', shortcut: 'Ctrl + S', description: 'Save current work' },
        { action: 'Help', shortcut: 'F1', description: 'Open help documentation' },
        { action: 'Settings', shortcut: 'Ctrl + ,', description: 'Open settings menu' }
      ]
    },
    {
      category: 'Flow Builder',
      items: [
        { action: 'New Flow', shortcut: 'Ctrl + N', description: 'Create a new flow' },
        { action: 'Duplicate Node', shortcut: 'Ctrl + D', description: 'Duplicate selected node' },
        { action: 'Delete Node', shortcut: 'Delete', description: 'Delete selected node' },
        { action: 'Undo', shortcut: 'Ctrl + Z', description: 'Undo last action' },
        { action: 'Redo', shortcut: 'Ctrl + Y', description: 'Redo last undone action' },
        { action: 'Zoom In', shortcut: 'Ctrl + +', description: 'Zoom into canvas' },
        { action: 'Zoom Out', shortcut: 'Ctrl + -', description: 'Zoom out of canvas' },
        { action: 'Fit to Screen', shortcut: 'Ctrl + 0', description: 'Fit flow to screen' }
      ]
    },
    {
      category: 'Navigation',
      items: [
        { action: 'Dashboard', shortcut: 'Alt + D', description: 'Go to dashboard' },
        { action: 'Flows', shortcut: 'Alt + F', description: 'Go to flows page' },
        { action: 'Analytics', shortcut: 'Alt + A', description: 'Go to analytics' },
        { action: 'Settings', shortcut: 'Alt + S', description: 'Go to settings' }
      ]
    },
    {
      category: 'Data Management',
      items: [
        { action: 'Export Data', shortcut: 'Ctrl + E', description: 'Export current data' },
        { action: 'Import Data', shortcut: 'Ctrl + I', description: 'Import data' },
        { action: 'Refresh', shortcut: 'F5', description: 'Refresh current view' }
      ]
    }
  ];

  const handleSave = () => {
    onClose();
  };

  const handleResetDefaults = () => {
    setSettings(prev => ({ ...prev, customShortcuts: {} }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shortcut Settings</CardTitle>
              <CardDescription>Configure how keyboard shortcuts work</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Enable Keyboard Shortcuts</Label>
                  <p className="text-sm text-muted-foreground">Turn on/off all keyboard shortcuts</p>
                </div>
                <Switch 
                  checked={settings.enabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enabled: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Show Shortcut Tooltips</Label>
                  <p className="text-sm text-muted-foreground">Display keyboard shortcuts in button tooltips</p>
                </div>
                <Switch 
                  checked={settings.showTooltips}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showTooltips: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Global Shortcuts</Label>
                  <p className="text-sm text-muted-foreground">Enable shortcuts even when not focused on the app</p>
                </div>
                <Switch 
                  checked={settings.globalShortcuts}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, globalShortcuts: checked }))}
                />
              </div>
              
              <div className="pt-2">
                <Button variant="outline" onClick={handleResetDefaults}>
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Shortcut Categories */}
          {shortcuts.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="text-lg">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                      <div className="flex-1">
                        <p className="font-medium">{item.action}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="font-mono text-xs">
                          {item.shortcut}
                        </Badge>
                        <Button variant="ghost" size="sm" className="text-xs">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Custom Shortcuts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Custom Shortcuts</CardTitle>
              <CardDescription>Create your own keyboard shortcuts for frequently used actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <Input placeholder="Action name" />
                  <Input placeholder="Shortcut (e.g., Ctrl+Alt+X)" />
                  <Button variant="outline">Add Shortcut</Button>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Tips for creating shortcuts:</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Use Ctrl, Alt, and Shift as modifiers</li>
                  <li>• Avoid conflicts with existing shortcuts</li>
                  <li>• Use function keys (F1-F12) for less common actions</li>
                  <li>• Test shortcuts to ensure they work as expected</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSave} className="bg-gradient-primary">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};