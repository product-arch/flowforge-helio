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
    totalCost: '$299.00'
  };

  const getRecentInvoices = () => {
    const invoices = [];
    for (let i = 0; i < 3; i++) {
      const invoiceDate = new Date(currentDate.getTime() - (i + 1) * 30 * 24 * 60 * 60 * 1000);
      invoices.push({
        date: invoiceDate.toISOString().split('T')[0],
        amount: '$299.00',
        status: 'Paid'
      });
    }
    return invoices;
  };

  const recentInvoices = getRecentInvoices();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Billing & Subscription</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
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
                  <Label className="text-sm text-muted-foreground">Monthly Cost</Label>
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
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentInvoices.map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                    <div>
                      <p className="font-medium">{invoice.date}</p>
                      <p className="text-sm text-muted-foreground">Monthly Subscription</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{invoice.amount}</p>
                      <Badge variant="outline" className="text-xs">
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between gap-2">
            <Button variant="outline">
              Upgrade Plan
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button className="bg-gradient-primary">
                Download Invoice
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};