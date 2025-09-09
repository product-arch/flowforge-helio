import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeSelector } from '@/components/navigation/ThemeSelector';
import { SettingsDropdown } from '@/components/navigation/SettingsDropdown';
import { AccountMenu } from '@/components/navigation/AccountMenu';
import { useModalStates } from '@/hooks/useModalStates';
import { 
  PersonalInfoModal, 
  AccountSettingsModal, 
  BillingModal,
  NotificationsModal,
  LanguageModal,
  PrivacyModal,
  DataManagementModal,
  KeyboardShortcutsModal
} from '@/components/flow/AccountModals';
import { Zap } from 'lucide-react';

interface NavigationHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  rightActions?: React.ReactNode;
  showBackButton?: boolean;
  backTo?: string;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title = 'Hub',
  subtitle,
  icon: Icon,
  rightActions,
  showBackButton = false,
  backTo = '/'
}) => {
  const navigate = useNavigate();
  const modalStates = useModalStates();

  return (
    <>
      <header className="sticky top-0 z-50 pt-4">
        <div className="container mx-auto px-6">
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg shadow-black/5 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    {title}
                  </h1>
                </div>
                
                {(subtitle || Icon) && (
                  <nav className="hidden md:flex items-center gap-6">
                    {showBackButton && (
                      <Button variant="ghost" className="text-sm" onClick={() => navigate(backTo)}>
                        Home
                      </Button>
                    )}
                    
                    {subtitle && Icon && (
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/10 rounded-lg">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{subtitle}</span>
                      </div>
                    )}
                  </nav>
                )}
              </div>

              <div className="flex items-center gap-3">
                {rightActions}
                
                <SettingsDropdown
                  onNotificationsClick={() => modalStates.setNotificationsOpen(true)}
                  onLanguageClick={() => modalStates.setLanguageOpen(true)}
                  onPrivacyClick={() => modalStates.setPrivacyOpen(true)}
                  onDataManagementClick={() => modalStates.setDataManagementOpen(true)}
                  onKeyboardShortcutsClick={() => modalStates.setKeyboardShortcutsOpen(true)}
                />

                <AccountMenu
                  onPersonalInfoClick={() => modalStates.setPersonalInfoOpen(true)}
                  onAccountSettingsClick={() => modalStates.setAccountSettingsOpen(true)}
                  onBillingClick={() => modalStates.setBillingOpen(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <PersonalInfoModal 
        isOpen={modalStates.personalInfoOpen} 
        onClose={() => modalStates.setPersonalInfoOpen(false)} 
      />
      <AccountSettingsModal 
        isOpen={modalStates.accountSettingsOpen} 
        onClose={() => modalStates.setAccountSettingsOpen(false)} 
      />
      <BillingModal 
        isOpen={modalStates.billingOpen} 
        onClose={() => modalStates.setBillingOpen(false)} 
      />
      <NotificationsModal 
        isOpen={modalStates.notificationsOpen} 
        onClose={() => modalStates.setNotificationsOpen(false)} 
      />
      <LanguageModal 
        isOpen={modalStates.languageOpen} 
        onClose={() => modalStates.setLanguageOpen(false)} 
      />
      <PrivacyModal 
        isOpen={modalStates.privacyOpen} 
        onClose={() => modalStates.setPrivacyOpen(false)} 
      />
      <DataManagementModal 
        isOpen={modalStates.dataManagementOpen} 
        onClose={() => modalStates.setDataManagementOpen(false)} 
      />
      <KeyboardShortcutsModal 
        isOpen={modalStates.keyboardShortcutsOpen} 
        onClose={() => modalStates.setKeyboardShortcutsOpen(false)} 
      />
    </>
  );
};