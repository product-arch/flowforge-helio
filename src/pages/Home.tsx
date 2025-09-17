import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  PrivacyPolicyModal, 
  TermsOfServiceModal, 
  CookiePreferencesModal, 
  SystemStatusModal,
  VersionModal
} from '@/components/flow/FooterModals';
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
import { Separator } from '@/components/ui/separator';
import { 
  GitBranch, 
  BarChart3, 
  Plug, 
  FileText, 
  Play, 
  ArrowRight,
  Zap,
  Users,
  Settings,
  HelpCircle,
  User,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  Database,
  Keyboard,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Facebook,
  Github,
  Store
} from 'lucide-react';
import { useTheme, Theme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';

const modules = [
  {
    id: 'routing',
    title: 'Routing',
    description: 'Build intelligent message routing flows with multi-vendor support and fallback mechanisms',
    icon: GitBranch,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    hoverColor: 'hover:border-blue-500/40',
    route: '/flow-builder',
    isPriority: true,
    stats: 'Used by 3 campaigns',
    features: ['Multi-vendor routing', 'Fallback logic', 'Cost optimization']
  },
  {
    id: 'monitoring',
    title: 'Monitoring',
    description: 'Real-time analytics, performance tracking, and comprehensive reporting dashboards',
    icon: BarChart3,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    hoverColor: 'hover:border-emerald-500/40',
    route: '/monitoring',
    features: ['Real-time metrics', 'Custom dashboards', 'Alert management']
  },
  {
    id: 'integration',
    title: 'Integration',
    description: 'Connect with external systems, APIs, and databases for seamless data flow',
    icon: Plug,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    hoverColor: 'hover:border-purple-500/40',
    route: '/integration',
    features: ['API connectors', 'Webhook management', 'Data transformation']
  },
  {
    id: 'templates',
    title: 'Template Assistant',
    description: 'AI-powered template creation and management for all communication channels',
    icon: FileText,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    hoverColor: 'hover:border-orange-500/40',
    route: '/templates',
    features: ['AI template generation', 'Multi-channel support', 'Version control']
  },
  {
    id: 'vendors',
    title: 'Vendors',
    description: 'Manage vendor relationships, onboarding, and health monitoring for all channels',
    icon: Store,
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
    hoverColor: 'hover:border-cyan-500/40',
    route: '/vendors',
    features: ['Vendor marketplace', 'Health monitoring', 'Onboarding flows']
  }
];

const stats = [
  { label: 'Active Flows', value: '12', icon: Zap },
  { label: 'Messages Today', value: '15.4K', icon: Play },
  { label: 'Success Rate', value: '99.2%', icon: BarChart3 },
  { label: 'Active Users', value: '8', icon: Users }
];

const Home: React.FC = () => {
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
  const [footerPrivacyOpen, setFooterPrivacyOpen] = React.useState(false);
  const [footerTermsOpen, setFooterTermsOpen] = React.useState(false);
  const [cookiePreferencesOpen, setCookiePreferencesOpen] = React.useState(false);
  const [systemStatusOpen, setSystemStatusOpen] = React.useState(false);
  const [versionModalOpen, setVersionModalOpen] = React.useState(false);
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

  const handleModuleClick = (route: string) => {
    if (route === '/flow-builder') {
      navigate('/flows');
    } else {
      // Navigate to other modules
      navigate(route);
    }
  };


  const handleSettingClick = (setting: string) => {
    toast({
      title: "Setting Updated",
      description: `${setting} setting has been updated`,
      className: "border-status-info bg-status-info/10 text-status-info"
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
                <Button variant="ghost" className="text-sm">Home</Button>
                
                {/* Modules Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-sm">
                      Profiles
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem onClick={() => navigate('/user-profiles')}>
                      <Users className="w-4 h-4 mr-2" />
                      User Profiles
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
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
                    <Badge className="w-4 h-4 mr-2" />
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

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-heading font-heading-bold mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent leading-tight py-2">
            Build your first messaging flow with Hub
          </h2>
          <p className="text-xl font-body text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Create intelligent communication workflows with multi-vendor routing, 
            real-time analytics, and seamless integrations. Start building in minutes.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90 text-lg font-body-medium px-8 py-6 h-auto"
              onClick={() => navigate('/flows')}
            >
              <Play className="w-5 h-5 mr-2" />
              View Flows
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg font-body-medium px-8 py-6 h-auto"
              onClick={() => navigate('/documentation')}
            >
              View Documentation
            </Button>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <Card key={stat.label} className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm font-body text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Modules Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-heading font-heading-bold mb-4">Platform Modules</h3>
            <p className="text-lg font-body text-muted-foreground max-w-2xl mx-auto">
              Choose a module to get started. Each module is designed to work seamlessly together 
              for a complete communication automation platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Card className={`
                  relative overflow-hidden border-2 transition-all duration-300 cursor-pointer
                  ${module.borderColor} ${module.hoverColor} hover:shadow-xl hover:shadow-primary/10
                  ${module.isPriority ? 'ring-2 ring-primary/20' : ''}
                `}>
                  {module.isPriority && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary text-primary-foreground">Priority</Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-xl ${module.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                        <module.icon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl font-heading font-heading-semibold mb-2 flex items-center gap-2">
                          {module.title}
                          {module.stats && (
                            <Badge variant="secondary" className="text-xs">
                              {module.stats}
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-base font-body leading-relaxed">
                          {module.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {module.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      <Button 
                        className="w-full font-body-medium group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                        variant={module.isPriority ? "default" : "outline"}
                        size="lg"
                        onClick={() => handleModuleClick(module.route)}
                      >
                        Launch {module.title}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </div>
                  </CardContent>

                  {/* Gradient overlay for priority module */}
                  {module.isPriority && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-heading font-heading-bold mb-4">Ready to get started?</h3>
              <p className="font-body text-muted-foreground mb-6 max-w-2xl mx-auto">
                Jump straight into building your first routing flow, or explore our other modules 
                to see how Hub can transform your communication workflows.
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:opacity-90 font-body-medium"
                  onClick={() => navigate('/flow-builder')}
                >
                  <GitBranch className="w-5 h-5 mr-2" />
                  Build Routing Flow
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="font-body-medium"
                  onClick={() => navigate('/documentation')}
                >
                  <FileText className="w-5 h-5 mr-2" />
                  View Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative mt-16">
        <div className="bg-gradient-to-r from-muted/80 to-muted/60 backdrop-blur-xl border-t border-border/30 dark:from-muted/10 dark:to-muted/5">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Helo.ai by VivaConnect. All rights reserved.
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <button 
                  onClick={() => setSystemStatusOpen(true)}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span>All systems operational</span>
                </button>
                <span 
                  onClick={() => setVersionModalOpen(true)}
                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded cursor-pointer hover:bg-primary/20 transition-colors"
                >
                  v2.4.1
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Modals */}
      <PersonalInfoModal isOpen={personalInfoOpen} onClose={() => setPersonalInfoOpen(false)} />
      <AccountSettingsModal isOpen={accountSettingsOpen} onClose={() => setAccountSettingsOpen(false)} />
      <BillingModal isOpen={billingOpen} onClose={() => setBillingOpen(false)} />
      
      {/* Settings Modals */}
      <NotificationsModal isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <LanguageModal isOpen={languageOpen} onClose={() => setLanguageOpen(false)} />
      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <DataManagementModal isOpen={dataManagementOpen} onClose={() => setDataManagementOpen(false)} />
      <KeyboardShortcutsModal isOpen={keyboardShortcutsOpen} onClose={() => setKeyboardShortcutsOpen(false)} />
      
      <SupportModal isOpen={supportModalOpen} onClose={() => setSupportModalOpen(false)} />
      
      {/* Footer Modals */}
      <PrivacyPolicyModal isOpen={footerPrivacyOpen} onClose={() => setFooterPrivacyOpen(false)} />
      <TermsOfServiceModal isOpen={footerTermsOpen} onClose={() => setFooterTermsOpen(false)} />
      <CookiePreferencesModal isOpen={cookiePreferencesOpen} onClose={() => setCookiePreferencesOpen(false)} />
      <SystemStatusModal isOpen={systemStatusOpen} onClose={() => setSystemStatusOpen(false)} />
      <VersionModal isOpen={versionModalOpen} onClose={() => setVersionModalOpen(false)} />
      
      {/* Help Modal */}
      <Dialog open={helpModalOpen} onOpenChange={setHelpModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              About Hub
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Product Information</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Hub</strong> is an intelligent communication routing platform 
                  that enables businesses to build sophisticated messaging workflows with multi-vendor support, 
                  real-time analytics, and seamless integrations.
                </p>
                <p>
                  Our platform empowers teams to create, manage, and optimize communication flows across 
                  SMS, WhatsApp, Email, Voice, and RCS channels with advanced routing logic and fallback mechanisms.
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">About Helo.ai</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Helo.ai</strong> is a leading provider of AI-powered 
                  communication solutions, helping businesses automate and optimize their customer engagement 
                  across multiple channels.
                </p>
                <p>
                  Founded in 2001, Helo.ai serves over 500+ enterprises globally, processing millions of 
                  messages daily with industry-leading delivery rates and cost optimization.
                </p>
                <p>
                  <strong className="text-foreground">Mission:</strong> To democratize intelligent communication 
                  automation and make enterprise-grade messaging accessible to businesses of all sizes.
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Version & Licenses</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                  <span className="text-sm font-medium">Hub Platform Version</span>
                  <Badge variant="secondary">v2.4.1</Badge>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Open Source Licenses</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>React</span>
                      <span>MIT License</span>
                    </div>
                    <div className="flex justify-between">
                      <span>React Flow</span>
                      <span>MIT License</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tailwind CSS</span>
                      <span>MIT License</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Radix UI</span>
                      <span>MIT License</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Framer Motion</span>
                      <span>MIT License</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lucide Icons</span>
                      <span>ISC License</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                  <p>© {new Date().getFullYear()} Helo.ai. All rights reserved.</p>
                  <p>Built with ❤️ for intelligent communication automation.</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;