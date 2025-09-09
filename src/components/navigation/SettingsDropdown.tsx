import React from 'react';
import { Bell, Globe, Shield, Database, Keyboard, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';

interface SettingsDropdownProps {
  onNotificationsClick?: () => void;
  onLanguageClick?: () => void;
  onPrivacyClick?: () => void;
  onDataManagementClick?: () => void;
  onKeyboardShortcutsClick?: () => void;
  variant?: 'ghost' | 'outline' | 'default';
  size?: 'default' | 'sm' | 'lg';
  showLabel?: boolean;
}

export const SettingsDropdown: React.FC<SettingsDropdownProps> = ({ 
  onNotificationsClick,
  onLanguageClick,
  onPrivacyClick,
  onDataManagementClick,
  onKeyboardShortcutsClick,
  variant = 'ghost',
  size = 'default',
  showLabel = false
}) => {
  const { mode, setMode } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Settings className="w-4 h-4" />
          {showLabel && 'Settings'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onNotificationsClick}>
          <Bell className="w-4 h-4 mr-2" />
          Notifications
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLanguageClick}>
          <Globe className="w-4 h-4 mr-2" />
          Language & Region
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onPrivacyClick}>
          <Shield className="w-4 h-4 mr-2" />
          Privacy & Security
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDataManagementClick}>
          <Database className="w-4 h-4 mr-2" />
          Data Management
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onKeyboardShortcutsClick}>
          <Keyboard className="w-4 h-4 mr-2" />
          Keyboard Shortcuts
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
          {mode === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};