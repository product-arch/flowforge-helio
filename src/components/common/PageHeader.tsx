import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeSelector } from '@/components/navigation/ThemeSelector';
import { SettingsDropdown } from '@/components/navigation/SettingsDropdown';
import { AccountMenu } from '@/components/navigation/AccountMenu';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  backTo?: string;
  showBackButton?: boolean;
  showThemeSelector?: boolean;
  showSettings?: boolean;
  showAccount?: boolean;
  children?: React.ReactNode;
  onPersonalInfoClick?: () => void;
  onAccountSettingsClick?: () => void;
  onBillingClick?: () => void;
  onSupportClick?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  backTo = '/home',
  showBackButton = true,
  showThemeSelector = true,
  showSettings = true,
  showAccount = true,
  children,
  onPersonalInfoClick,
  onAccountSettingsClick,
  onBillingClick,
  onSupportClick
}) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 pt-4">
      <div className="container mx-auto px-6">
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg shadow-black/5 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {showBackButton && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(backTo)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              )}
              <div className="flex items-center gap-3">
                {icon && (
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                    {icon}
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {children}
              {showSettings && (
                <SettingsDropdown 
                  onPersonalInfoClick={onPersonalInfoClick}
                  onAccountSettingsClick={onAccountSettingsClick}
                  onBillingClick={onBillingClick}
                  onSupportClick={onSupportClick}
                />
              )}
              {showThemeSelector && <ThemeSelector />}
              {showAccount && (
                <AccountMenu 
                  onPersonalInfoClick={onPersonalInfoClick}
                  onAccountSettingsClick={onAccountSettingsClick}
                  onBillingClick={onBillingClick}
                  onSupportClick={onSupportClick}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};