import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
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
  Github
} from 'lucide-react';
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
  const [supportModalOpen, setSupportModalOpen] = React.useState(false);
  const [helpModalOpen, setHelpModalOpen] = React.useState(false);
  const [footerPrivacyOpen, setFooterPrivacyOpen] = React.useState(false);
  const [footerTermsOpen, setFooterTermsOpen] = React.useState(false);
  const [cookiePreferencesOpen, setCookiePreferencesOpen] = React.useState(false);
  const [systemStatusOpen, setSystemStatusOpen] = React.useState(false);
  const [versionModalOpen, setVersionModalOpen] = React.useState(false);
  const { toast } = useToast();

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
      <NavigationHeader 
        rightActions={
          <>
            <Button variant="ghost" size="sm" onClick={() => setHelpModalOpen(true)}>
              <HelpCircle className="w-4 h-4" />
            </Button>
            
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
          </>
        }
      />

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
            <h3 className="text-3xl font-heading font-heading-bold mb-4">Powerful Modules</h3>
            <p className="text-lg text-muted-foreground">Everything you need to manage communication workflows</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card 
                  className={`h-full ${module.bgColor} ${module.borderColor} border-2 ${module.hoverColor} transition-all duration-300 cursor-pointer group hover:shadow-lg`}
                  onClick={() => handleModuleClick(module.route)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 bg-gradient-to-br ${module.color} rounded-lg`}>
                        <module.icon className="w-5 h-5 text-white" />
                      </div>
                      {module.isPriority && (
                        <Badge className="bg-gradient-primary text-white text-xs">
                          Priority
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {module.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {module.stats && (
                      <div className="text-xs text-muted-foreground mb-3 font-body-medium">
                        {module.stats}
                      </div>
                    )}
                    <div className="space-y-1">
                      {module.features.map((feature, i) => (
                        <div key={i} className="flex items-center text-xs text-muted-foreground">
                          <ArrowRight className="w-3 h-3 mr-1 text-primary" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="border-t border-border pt-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div className="space-y-4">
              <h4 className="font-semibold">About Hub</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Enterprise-grade communication platform for intelligent message routing and workflow automation.
              </p>
              <div className="flex space-x-4">
                <Twitter className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                <Linkedin className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                <Facebook className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                <Github className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">Features</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">Integrations</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">Pricing</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">API</div>
              </div>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h4 className="font-semibold">Resources</h4>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" onClick={() => navigate('/documentation')}>Documentation</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">Help Center</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">Blog</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">Community</div>
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" onClick={() => setFooterPrivacyOpen(true)}>Privacy Policy</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" onClick={() => setFooterTermsOpen(true)}>Terms of Service</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" onClick={() => setCookiePreferencesOpen(true)}>Cookie Preferences</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" onClick={() => setSystemStatusOpen(true)}>System Status</div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <div>© 2024 Hub. All rights reserved.</div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                support@hub.com
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                San Francisco, CA
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setVersionModalOpen(true)}
                className="text-xs"
              >
                v1.0.0
              </Button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Modals */}
      <SupportModal isOpen={supportModalOpen} onClose={() => setSupportModalOpen(false)} />
      
      {/* Footer Modals */}
      <PrivacyPolicyModal isOpen={footerPrivacyOpen} onClose={() => setFooterPrivacyOpen(false)} />
      <TermsOfServiceModal isOpen={footerTermsOpen} onClose={() => setFooterTermsOpen(false)} />
      <CookiePreferencesModal isOpen={cookiePreferencesOpen} onClose={() => setCookiePreferencesOpen(false)} />
      <SystemStatusModal isOpen={systemStatusOpen} onClose={() => setSystemStatusOpen(false)} />
      <VersionModal isOpen={versionModalOpen} onClose={() => setVersionModalOpen(false)} />

      {/* Help Modal */}
      <Dialog open={helpModalOpen} onOpenChange={setHelpModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Help & Support</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Welcome to Hub! Here are some helpful resources to get you started:</p>
            <ul className="space-y-2 text-sm">
              <li>• Use the Flow Builder to create intelligent routing workflows</li>
              <li>• Monitor your campaigns in real-time with our analytics dashboard</li>
              <li>• Integrate with external systems using our powerful API</li>
              <li>• Create templates with our AI-powered assistant</li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;