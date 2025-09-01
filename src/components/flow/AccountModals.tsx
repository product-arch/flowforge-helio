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