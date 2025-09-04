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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, FileText, Sparkles, List, Plus, Zap, Settings, HelpCircle, User, Bell, Moon, Sun, Globe, Shield, Database, Keyboard, LogOut } from 'lucide-react';
import { useTheme, Theme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';

const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [personalInfoOpen, setPersonalInfoOpen] = React.useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = React.useState(false);
  const [billingOpen, setBillingOpen] = React.useState(false);
  const [supportModalOpen, setSupportModalOpen] = React.useState(false);
  const [helpModalOpen, setHelpModalOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [languageOpen, setLanguageOpen] = React.useState(false);
  const [privacyOpen, setPrivacyOpen] = React.useState(false);
  const [dataManagementOpen, setDataManagementOpen] = React.useState(false);
  const [keyboardShortcutsOpen, setKeyboardShortcutsOpen] = React.useState(false);
  const { theme, mode, setTheme, setMode } = useTheme();
  const { toast } = useToast();

  const themes: Array<{ value: Theme; label: string; color: string }> = [
    { value: 'blue', label: 'Professional Blue', color: 'bg-blue-500' },
    { value: 'emerald', label: 'Growth Green', color: 'bg-emerald-500' },
    { value: 'purple', label: 'Creative Purple', color: 'bg-purple-500' },
    { value: 'orange', label: 'Energy Orange', color: 'bg-orange-500' },
    { value: 'rose', label: 'Warm Rose', color: 'bg-rose-500' },
    { value: 'indigo', label: 'Deep Indigo', color: 'bg-indigo-500' },
    { value: 'solarized-osaka', label: 'Solarized Osaka', color: 'bg-teal-600' },
    { value: 'monochrome', label: 'Black & White', color: 'bg-gray-900' },
  ];

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    toast({
      title: "Theme Changed",
      description: `Switched to ${themes.find(t => t.value === newTheme)?.label}`,
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
                <Button variant="ghost" className="text-sm" onClick={() => setSupportModalOpen(true)}>Support</Button>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setHelpModalOpen(true)}>
                <HelpCircle className="w-4 h-4" />
              </Button>
              
              {/* Settings Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setNotificationsOpen(true)}>
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguageOpen(true)}>
                    <Globe className="w-4 h-4 mr-2" />
                    Language & Region
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPrivacyOpen(true)}>
                    <Shield className="w-4 h-4 mr-2" />
                    Privacy & Security
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDataManagementOpen(true)}>
                    <Database className="w-4 h-4 mr-2" />
                    Data Management
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setKeyboardShortcutsOpen(true)}>
                    <Keyboard className="w-4 h-4 mr-2" />
                    Keyboard Shortcuts
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  
                  <div className="px-2 py-1">
                    <div className="text-xs font-medium text-muted-foreground mb-2">Themes</div>
                    <div className="grid grid-cols-3 gap-1">
                      {themes.map((themeOption) => (
                        <button
                          key={themeOption.value}
                          onClick={() => handleThemeChange(themeOption.value)}
                          className={`w-6 h-6 rounded-full ${themeOption.color} hover:scale-110 transition-transform ${
                            theme === themeOption.value ? 'ring-2 ring-ring ring-offset-2 ring-offset-background' : ''
                          }`}
                          title={themeOption.label}
                        />
                      ))}
                    </div>
                    <div className="mt-2 flex gap-1">
                      <button
                        onClick={() => setMode('light')}
                        className={`px-2 py-1 text-xs rounded ${
                          mode === 'light' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                        }`}
                      >
                        Light
                      </button>
                      <button
                        onClick={() => setMode('dark')}
                        className={`px-2 py-1 text-xs rounded ${
                          mode === 'dark' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                        }`}
                      >
                        Dark
                      </button>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
                    {mode === 'light' ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
                    {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Account Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setPersonalInfoOpen(true)}>
                    <User className="w-4 h-4 mr-2" />
                    Personal Info
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setAccountSettingsOpen(true)}>
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setBillingOpen(true)}>
                    <Settings className="w-4 h-4 mr-2" />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  
                  <div className="px-2 py-1">
                    <div className="text-xs font-medium text-muted-foreground mb-2">Themes</div>
                    <div className="grid grid-cols-3 gap-1">
                      {themes.map((themeOption) => (
                        <button
                          key={themeOption.value}
                          onClick={() => handleThemeChange(themeOption.value)}
                          className={`w-6 h-6 rounded-full ${themeOption.color} hover:scale-110 transition-transform ${
                            theme === themeOption.value ? 'ring-2 ring-ring ring-offset-2 ring-offset-background' : ''
                          }`}
                          title={themeOption.label}
                        />
                      ))}
                    </div>
                    <div className="mt-2 flex gap-1">
                      <button
                        onClick={() => setMode('light')}
                        className={`px-2 py-1 text-xs rounded ${
                          mode === 'light' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                        }`}
                      >
                        Light
                      </button>
                      <button
                        onClick={() => setMode('dark')}
                        className={`px-2 py-1 text-xs rounded ${
                          mode === 'dark' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                        }`}
                      >
                        Dark
                      </button>
                    </div>
                  </div>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

        <PersonalInfoModal isOpen={personalInfoOpen} onClose={() => setPersonalInfoOpen(false)} />
        <AccountSettingsModal isOpen={accountSettingsOpen} onClose={() => setAccountSettingsOpen(false)} />
        <BillingModal isOpen={billingOpen} onClose={() => setBillingOpen(false)} />
        <NotificationsModal isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
        <LanguageModal isOpen={languageOpen} onClose={() => setLanguageOpen(false)} />
        <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
        <DataManagementModal isOpen={dataManagementOpen} onClose={() => setDataManagementOpen(false)} />
        <KeyboardShortcutsModal isOpen={keyboardShortcutsOpen} onClose={() => setKeyboardShortcutsOpen(false)} />
        <SupportModal isOpen={supportModalOpen} onClose={() => setSupportModalOpen(false)} />
        
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