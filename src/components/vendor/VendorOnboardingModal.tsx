import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, AlertCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Vendor, ChannelOnboardingFlow, OnboardingStepData } from '@/types/vendor-integration';
import { getOnboardingSteps, getChannelRequirements } from '@/constants/onboarding-flows';

interface VendorOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor | null;
  onComplete: (integrationData: any) => void;
}

export const VendorOnboardingModal: React.FC<VendorOnboardingModalProps> = ({
  isOpen,
  onClose,
  vendor,
  onComplete
}) => {
  const { toast } = useToast();
  const [onboardingFlow, setOnboardingFlow] = useState<ChannelOnboardingFlow | null>(null);

  useEffect(() => {
    if (vendor && isOpen) {
      const steps = getOnboardingSteps(vendor.type);
      setOnboardingFlow({
        steps,
        currentStep: 0,
        data: {}
      });
    }
  }, [vendor, isOpen]);

  const handleNext = () => {
    if (!onboardingFlow) return;
    
    if (onboardingFlow.currentStep < onboardingFlow.steps.length - 1) {
      setOnboardingFlow(prev => prev ? {
        ...prev,
        currentStep: prev.currentStep + 1
      } : null);
    }
  };

  const handlePrevious = () => {
    if (!onboardingFlow) return;
    
    if (onboardingFlow.currentStep > 0) {
      setOnboardingFlow(prev => prev ? {
        ...prev,
        currentStep: prev.currentStep - 1
      } : null);
    }
  };

  const handleComplete = () => {
    if (!vendor || !onboardingFlow) return;

    // Simulate integration creation
    const integrationData = {
      vendor,
      channel: vendor.type,
      status: 'configuring',
      data: onboardingFlow.data
    };

    onComplete(integrationData);
    
    toast({
      title: "Integration Started",
      description: `${vendor.name} integration has been initiated for ${vendor.type.toUpperCase()}`,
      className: "border-status-success bg-status-success/10 text-status-success"
    });

    onClose();
  };

  const getStepIcon = (stepIndex: number) => {
    if (stepIndex < onboardingFlow!.currentStep) {
      return <CheckCircle className="w-5 h-5 text-status-success" />;
    } else if (stepIndex === onboardingFlow!.currentStep) {
      return <Circle className="w-5 h-5 text-primary fill-primary" />;
    } else {
      return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  if (!vendor || !onboardingFlow) {
    return null;
  }

  const currentStep = onboardingFlow.steps[onboardingFlow.currentStep];
  const progress = ((onboardingFlow.currentStep + 1) / onboardingFlow.steps.length) * 100;
  const requirements = getChannelRequirements(vendor.type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <img 
              src={vendor.logo} 
              alt={vendor.name}
              className="w-8 h-8 rounded object-contain"
            />
            {vendor.name} Integration Setup
            <Badge variant="outline" className="ml-auto">
              {vendor.type.toUpperCase()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Step {onboardingFlow.currentStep + 1} of {onboardingFlow.steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Navigator */}
          <div className="flex items-center justify-between">
            {onboardingFlow.steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  {getStepIcon(index)}
                  <span className={`text-xs font-medium ${
                    index === onboardingFlow.currentStep 
                      ? 'text-primary' 
                      : index < onboardingFlow.currentStep 
                        ? 'text-status-success' 
                        : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < onboardingFlow.steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    index < onboardingFlow.currentStep ? 'bg-status-success' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Current Step Content */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold">{currentStep.title}</h3>
                <p className="text-sm text-muted-foreground">{currentStep.description}</p>
              </div>
            </div>

            {/* Step-specific content */}
            {onboardingFlow.currentStep === 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Prerequisites for {vendor.type.toUpperCase()} Integration:</h4>
                <ul className="space-y-2">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Circle className="w-3 h-3 mt-1 text-muted-foreground" />
                      {req}
                    </li>
                  ))}
                </ul>
                <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <ExternalLink className="w-4 h-4" />
                    <span className="font-medium">Complete these prerequisites in {vendor.name}'s portal before proceeding.</span>
                  </div>
                </div>
              </div>
            )}

            {onboardingFlow.currentStep === 1 && vendor.type === 'sms' && (
              <div className="space-y-4">
                <h4 className="font-medium">SMS Compliance & Use Case Information:</h4>
                <div className="text-sm space-y-2">
                  <p>• Specify your SMS use cases (OTP, promotional, transactional)</p>
                  <p>• Provide sample message templates</p>
                  <p>• Confirm A2P 10DLC registration status</p>
                  <p>• Upload required compliance documents</p>
                </div>
              </div>
            )}

            {onboardingFlow.currentStep === 1 && vendor.type === 'whatsapp' && (
              <div className="space-y-4">
                <h4 className="font-medium">WhatsApp Business Verification:</h4>
                <div className="text-sm space-y-2">
                  <p>• Verify your business profile with Meta</p>
                  <p>• Upload business registration documents</p>
                  <p>• Configure business display name and profile</p>
                  <p>• Set up phone number verification</p>
                </div>
              </div>
            )}

            {onboardingFlow.currentStep === 1 && vendor.type === 'rcs' && (
              <div className="space-y-4">
                <h4 className="font-medium">RCS Brand Verification:</h4>
                <div className="text-sm space-y-2">
                  <p>• Register your brand with RCS Business Messaging</p>
                  <p>• Submit brand verification documents</p>
                  <p>• Configure brand logo and messaging identity</p>
                  <p>• Set up carrier partnerships</p>
                </div>
              </div>
            )}

            {(onboardingFlow.currentStep === 2 || (onboardingFlow.currentStep === 1 && ['email', 'voice'].includes(vendor.type))) && (
              <div className="space-y-4">
                <h4 className="font-medium">API Credentials Configuration:</h4>
                <div className="text-sm space-y-2">
                  <p>• Enter your {vendor.name} API credentials</p>
                  <p>• Configure authentication settings</p>
                  <p>• Set up endpoint URLs and webhooks</p>
                  <p>• Test API connectivity</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={onboardingFlow.currentStep === 0}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              
              {onboardingFlow.currentStep === onboardingFlow.steps.length - 1 ? (
                <Button onClick={handleComplete}>
                  Complete Integration
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};