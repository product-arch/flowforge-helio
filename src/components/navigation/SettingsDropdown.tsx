import React from 'react';
import { Settings, User, CreditCard, HelpCircle, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

interface SettingsDropdownProps {
  onPersonalInfoClick?: () => void;
  onAccountSettingsClick?: () => void;
  onBillingClick?: () => void;
  onSupportClick?: () => void;
  variant?: 'ghost' | 'outline' | 'default';
  size?: 'default' | 'sm' | 'lg';
  showLabel?: boolean;
}

export const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
  onPersonalInfoClick,
  onAccountSettingsClick,
  onBillingClick,
  onSupportClick,
  variant = 'ghost',
  size = 'default',
  showLabel = false
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Settings className="w-4 h-4" />
          {showLabel && 'Settings'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onPersonalInfoClick}>
          <User className="w-4 h-4 mr-2" />
          Personal Information
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onAccountSettingsClick}>
          <Building className="w-4 h-4 mr-2" />
          Account Settings
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onBillingClick}>
          <CreditCard className="w-4 h-4 mr-2" />
          Billing & Subscription
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onSupportClick}>
          <HelpCircle className="w-4 h-4 mr-2" />
          Support & Help
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};