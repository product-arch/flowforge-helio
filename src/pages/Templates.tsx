import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { SupportModal } from '@/components/flow/SupportModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ThemeSelector } from '@/components/navigation/ThemeSelector';
import { SettingsDropdown } from '@/components/navigation/SettingsDropdown';
import { useModalStates } from '@/hooks/useModalStates';
import { ArrowLeft, FileText, Sparkles, List, Plus, Zap, Settings, HelpCircle, User, Bell, Moon, Sun, Globe, Shield, Database, Keyboard, LogOut } from 'lucide-react';
import { useTheme, Theme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { THEMES } from '@/constants/themes';

const Templates: React.FC = () => {
  const navigate = useNavigate();
  const modalStates = useModalStates();
  const [helpModalOpen, setHelpModalOpen] = React.useState(false);
  const { theme, mode, setTheme, setMode } = useTheme();
  const { toast } = useToast();

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    toast({
      title: "Theme Changed",
      description: `Switched to ${THEMES.find(t => t.value === newTheme)?.name}`,
      className: "border-status-success bg-status-success/10 text-status-success"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
                  Hub
                </h1>
              </div>
              
              <nav className="hidden md:flex items-center gap-6">
                <Button variant="ghost" className="text-sm" onClick={() => navigate('/')}>Home</Button>
                <Button variant="ghost" className="text-sm">Templates</Button>
                <Button variant="ghost" className="text-sm" onClick={() => modalStates.setSupportOpen(true)}>Support</Button>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setHelpModalOpen(true)}>
                <HelpCircle className="w-4 h-4" />
              </Button>
              
              {/* Settings Menu */}
              <SettingsDropdown 
                onNotificationsClick={() => modalStates.setNotificationsOpen(true)}
                onLanguageClick={() => modalStates.setLanguageOpen(true)}
                onPrivacyClick={() => modalStates.setPrivacyOpen(true)}
                onDataManagementClick={() => modalStates.setDataManagementOpen(true)}
                onKeyboardShortcutsClick={() => modalStates.setKeyboardShortcutsOpen(true)}
              />

              {/* Theme Selector */}
              <ThemeSelector />
            </div>
          </div>
        </div>
      </div>
      </header>

        {/* Content */}
        <main className="container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Business Message Templates</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Create and manage professional message templates for SMS, RCS, WhatsApp, Email, and Voice communications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Template Creator Block */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="h-64 cursor-pointer hover:shadow-lg transition-all duration-300 group bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:border-primary/40"
                      onClick={() => navigate('/template-creator')}>
                  <CardContent className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="p-4 bg-primary/20 rounded-full mb-4 group-hover:bg-primary/30 transition-colors">
                      <Plus className="w-12 h-12 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold mb-2">Template Creator</CardTitle>
                    <p className="text-muted-foreground">
                      Create new message templates with AI assistance for optimal engagement
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Template List Block */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="h-64 cursor-pointer hover:shadow-lg transition-all duration-300 group bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20 hover:border-secondary/40"
                      onClick={() => navigate('/template-list')}>
                  <CardContent className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="p-4 bg-secondary/20 rounded-full mb-4 group-hover:bg-secondary/30 transition-colors">
                      <List className="w-12 h-12 text-secondary-foreground" />
                    </div>
                    <CardTitle className="text-2xl font-bold mb-2">Template List</CardTitle>
                    <p className="text-muted-foreground">
                      View and manage all your existing message templates in one place
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Features Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16"
            >
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-center text-2xl">Supported Channels & Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
                    <div className="flex flex-col items-center">
                      <div className="p-3 bg-status-success/10 rounded-lg mb-2">
                        <Sparkles className="w-6 h-6 text-status-success" />
                      </div>
                      <span className="text-sm font-medium">SMS</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="p-3 bg-status-info/10 rounded-lg mb-2">
                        <Sparkles className="w-6 h-6 text-status-info" />
                      </div>
                      <span className="text-sm font-medium">RCS</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="p-3 bg-status-success/10 rounded-lg mb-2">
                        <Sparkles className="w-6 h-6 text-status-success" />
                      </div>
                      <span className="text-sm font-medium">WhatsApp</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="p-3 bg-status-info/10 rounded-lg mb-2">
                        <Sparkles className="w-6 h-6 text-status-info" />
                      </div>
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="p-3 bg-status-warning/10 rounded-lg mb-2">
                        <Sparkles className="w-6 h-6 text-status-warning" />
                      </div>
                      <span className="text-sm font-medium">Voice</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </main>

        <PersonalInfoModal isOpen={modalStates.personalInfoOpen} onClose={() => modalStates.setPersonalInfoOpen(false)} />
        <AccountSettingsModal isOpen={modalStates.accountSettingsOpen} onClose={() => modalStates.setAccountSettingsOpen(false)} />
        <BillingModal isOpen={modalStates.billingOpen} onClose={() => modalStates.setBillingOpen(false)} />
        <NotificationsModal isOpen={modalStates.settingsOpen} onClose={() => modalStates.setSettingsOpen(false)} />
        <LanguageModal isOpen={modalStates.settingsOpen} onClose={() => modalStates.setSettingsOpen(false)} />
        <PrivacyModal isOpen={modalStates.settingsOpen} onClose={() => modalStates.setSettingsOpen(false)} />
        <DataManagementModal isOpen={modalStates.settingsOpen} onClose={() => modalStates.setSettingsOpen(false)} />
        <KeyboardShortcutsModal isOpen={modalStates.settingsOpen} onClose={() => modalStates.setSettingsOpen(false)} />
        <SupportModal isOpen={modalStates.supportOpen} onClose={() => modalStates.setSupportOpen(false)} />
        
        <Dialog open={helpModalOpen} onOpenChange={setHelpModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Help & Documentation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Need help with Templates? Here are some quick resources:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Template creation best practices</li>
                <li>Multi-channel support guide</li>
                <li>Compliance requirements</li>
                <li>API integration documentation</li>
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default Templates;