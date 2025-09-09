import React from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AccountMenuProps {
  onPersonalInfoClick?: () => void;
  onAccountSettingsClick?: () => void;
  onBillingClick?: () => void;
  onSupportClick?: () => void;
  variant?: 'ghost' | 'outline' | 'default';
  size?: 'default' | 'sm' | 'lg';
  showLabel?: boolean;
}

export const AccountMenu: React.FC<AccountMenuProps> = ({ 
  onPersonalInfoClick,
  onAccountSettingsClick,
  onBillingClick,
  onSupportClick,
  variant = 'ghost',
  size = 'sm',
  showLabel = false
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <User className="w-4 h-4" />
          {showLabel && 'Account'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onPersonalInfoClick}>
          <User className="w-4 h-4 mr-2" />
          Personal Information
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onAccountSettingsClick}>
          <Settings className="w-4 h-4 mr-2" />
          Account Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onBillingClick}>
          <Settings className="w-4 h-4 mr-2" />
          Billing & Subscription
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSupportClick}>
          <Settings className="w-4 h-4 mr-2" />
          Support & Help
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};