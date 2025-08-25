import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    workEmail: '',
    phoneNumber: '',
    company: '',
    primaryUsecase: '',
    detailedRequirement: '',
    agreeToTerms: false,
    captchaVerified: false
  });

  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.workEmail || !formData.phoneNumber) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        className: "border-status-error bg-status-error/10 text-status-error"
      });
      return;
    }

    if (!formData.agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the Terms and Conditions and Privacy Policy.",
        className: "border-status-error bg-status-error/10 text-status-error"
      });
      return;
    }

    if (!formData.captchaVerified) {
      toast({
        title: "Verification Required",
        description: "Please complete the reCAPTCHA verification.",
        className: "border-status-error bg-status-error/10 text-status-error"
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "Contact Request Submitted",
      description: "Thank you for your interest! Our sales team will contact you within 24 hours.",
      className: "border-status-success bg-status-success/10 text-status-success"
    });

    // Reset form and close modal
    setFormData({
      firstName: '',
      lastName: '',
      workEmail: '',
      phoneNumber: '',
      company: '',
      primaryUsecase: '',
      detailedRequirement: '',
      agreeToTerms: false,
      captchaVerified: false
    });
    onClose();
  };

  const handleCaptchaClick = () => {
    // Simulate captcha verification
    setTimeout(() => {
      setFormData(prev => ({ ...prev, captchaVerified: true }));
      toast({
        title: "Verification Complete",
        description: "reCAPTCHA verification successful.",
        className: "border-status-success bg-status-success/10 text-status-success"
      });
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">
            Contact Sales
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            Get in touch with our team to learn more about Hub and how it can transform your communication workflows.
          </p>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="Jane"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="nodrag"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="nodrag"
                required
              />
            </div>
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workEmail" className="text-sm font-medium">
                Work Email
              </Label>
              <Input
                id="workEmail"
                type="email"
                placeholder="name@company.com"
                value={formData.workEmail}
                onChange={(e) => handleInputChange('workEmail', e.target.value)}
                className="nodrag"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium">
                Phone Number
              </Label>
              <div className="flex">
                <div className="flex items-center px-3 border border-r-0 border-input bg-muted rounded-l-md">
                  <span className="text-sm">🇮🇳</span>
                  <span className="text-sm ml-1">+91</span>
                </div>
                <Input
                  id="phoneNumber"
                  placeholder="9876543210"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="nodrag rounded-l-none border-l-0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Company Field */}
          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm font-medium">
              Company (optional)
            </Label>
            <Input
              id="company"
              placeholder="Add your company name"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="nodrag"
            />
          </div>

          {/* Primary Usecase */}
          <div className="space-y-2">
            <Label htmlFor="primaryUsecase" className="text-sm font-medium">
              Primary Usecase
            </Label>
            <Select
              value={formData.primaryUsecase}
              onValueChange={(value) => handleInputChange('primaryUsecase', value)}
            >
              <SelectTrigger className="nodrag">
                <SelectValue placeholder="Select your use case" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marketing">Marketing Campaigns</SelectItem>
                <SelectItem value="transactional">Transactional Messages</SelectItem>
                <SelectItem value="notifications">System Notifications</SelectItem>
                <SelectItem value="authentication">Authentication & OTP</SelectItem>
                <SelectItem value="customer-support">Customer Support</SelectItem>
                <SelectItem value="alerts">Alerts & Monitoring</SelectItem>
                <SelectItem value="multi-channel">Multi-channel Communication</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Detailed Requirement */}
          <div className="space-y-2">
            <Label htmlFor="detailedRequirement" className="text-sm font-medium">
              Detailed Requirement
            </Label>
            <Textarea
              id="detailedRequirement"
              placeholder="Tell us about your monthly requirement, spend and needs"
              value={formData.detailedRequirement}
              onChange={(e) => handleInputChange('detailedRequirement', e.target.value)}
              className="nodrag min-h-[120px] resize-none"
              rows={5}
            />
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                className="mt-1"
              />
              <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                By continuing, I confirm that I have read, understood, and agreed to{' '}
                <span className="text-red-500 hover:text-red-600 cursor-pointer underline">
                  Helo.ai's Terms and Conditions
                </span>{' '}
                and{' '}
                <span className="text-red-500 hover:text-red-600 cursor-pointer underline">
                  Privacy Policy
                </span>
                .
              </Label>
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-start">
              <div 
                className={`
                  border border-border rounded-md p-4 bg-card cursor-pointer transition-all duration-200
                  ${formData.captchaVerified ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'hover:border-primary/50'}
                `}
                onClick={!formData.captchaVerified ? handleCaptchaClick : undefined}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-6 h-6 border-2 rounded flex items-center justify-center transition-all duration-200
                    ${formData.captchaVerified 
                      ? 'border-green-500 bg-green-500' 
                      : 'border-muted-foreground hover:border-primary'
                    }
                  `}>
                    {formData.captchaVerified && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium">
                    {formData.captchaVerified ? "Verified - You're not a robot" : "I'm not a robot"}
                  </span>
                  <div className="ml-auto">
                    <div className="text-xs text-muted-foreground">
                      <div>reCAPTCHA</div>
                      <div className="flex items-center gap-1">
                        <span>Privacy</span>
                        <span>•</span>
                        <span>Terms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            className="w-full bg-gradient-primary hover:opacity-90 text-white font-medium py-6 text-lg rounded-lg"
            size="lg"
            disabled={!formData.agreeToTerms || !formData.captchaVerified}
          >
            Contact Sales
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};