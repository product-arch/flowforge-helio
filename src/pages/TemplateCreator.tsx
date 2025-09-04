import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ArrowLeft, Plus, User, Settings, CreditCard, MoreVertical, FileDown, FileUp, Copy, History, LogOut } from 'lucide-react';
import { useTheme, Theme } from '@/contexts/ThemeContext';
import { PersonalInfoModal, AccountSettingsModal, BillingModal } from '@/components/flow/AccountModals';
import { useToast } from '@/hooks/use-toast';

const TemplateCreator: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme, mode, setMode } = useTheme();
  const { toast } = useToast();
  const [personalInfoOpen, setPersonalInfoOpen] = useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);

  // Theme options
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

  const handleExport = () => {
    toast({
      title: "Export Started", 
      description: "Templates are being exported...",
    });
  };

  const handleImport = () => {
    toast({
      title: "Import Started",
      description: "Ready to import templates...",
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
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                      Template Creator
                    </h1>
                  </div>
                  
                  <nav className="hidden md:flex items-center gap-6">
                    <Button variant="ghost" className="text-sm" onClick={() => navigate('/')}>Home</Button>
                    <Button variant="ghost" className="text-sm" onClick={() => navigate('/templates')}>Templates</Button>
                  </nav>
                </div>

                <div className="flex items-center gap-3">
                  {/* Settings Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={handleExport}>
                        <FileDown className="w-4 h-4 mr-2" />
                        Export Templates
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleImport}>
                        <FileUp className="w-4 h-4 mr-2" />
                        Import Templates
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
                        <CreditCard className="w-4 h-4 mr-2" />
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
            className="text-center"
          >
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Plus className="w-12 h-12 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold mb-4">Template Creator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-muted-foreground">
                  AI-powered template creation for business communications. 
                  Create optimized templates for SMS, RCS, WhatsApp, Email, and Voice channels.
                </p>
                
                <div className="bg-muted/50 border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground">
                    The template creator is currently under development. 
                    It will provide intelligent template generation with:
                  </p>
                  <ul className="text-left text-muted-foreground mt-4 space-y-2">
                    <li>• AI-powered content optimization</li>
                    <li>• Multi-channel template support</li>
                    <li>• Compliance checking for different regions</li>
                    <li>• A/B testing recommendations</li>
                    <li>• Dynamic variable insertion</li>
                  </ul>
                </div>

                <Button 
                  onClick={() => navigate('/templates')}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Templates
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </main>

        <PersonalInfoModal isOpen={personalInfoOpen} onClose={() => setPersonalInfoOpen(false)} />
        <AccountSettingsModal isOpen={accountSettingsOpen} onClose={() => setAccountSettingsOpen(false)} />
        <BillingModal isOpen={billingOpen} onClose={() => setBillingOpen(false)} />
    </div>
  );
};

export default TemplateCreator;