import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IslandNavbar } from '@/components/navigation/IslandNavbar';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  BarChart3, 
  Zap,
  Users,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github,
  Facebook
} from 'lucide-react';
import { PrivacyPolicyModal, TermsOfServiceModal, CookiePreferencesModal, SystemStatusModal, VersionModal } from '@/components/flow/FooterModals';
import { SupportModal } from '@/components/flow/SupportModal';

const stats = [
  { label: 'Active Flows', value: '12', icon: Zap },
  { label: 'Messages Today', value: '15.4K', icon: Play },
  { label: 'Success Rate', value: '99.2%', icon: BarChart3 },
  { label: 'Active Users', value: '8', icon: Users }
];

const trustedBy = [
  'Aditya Birla Group',
  'Axis Bank', 
  'Bajaj Finserv',
  'Bandhan Bank',
  'HDFC Bank',
  'Tata Power'
];

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Footer modal states
  const [footerPrivacyOpen, setFooterPrivacyOpen] = useState(false);
  const [footerTermsOpen, setFooterTermsOpen] = useState(false);
  const [cookiePreferencesOpen, setCookiePreferencesOpen] = useState(false);
  const [systemStatusOpen, setSystemStatusOpen] = useState(false);
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  const handleSignIn = () => {
    toast({
      title: "Sign In",
      description: "Sign in functionality coming soon",
      className: "border-status-info bg-status-info/10 text-status-info"
    });
  };

  const handleScheduleDemo = () => {
    toast({
      title: "Demo Scheduled",
      description: "Demo scheduling functionality coming soon",
      className: "border-status-success bg-status-success/10 text-status-success"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <IslandNavbar 
        onSignInClick={handleSignIn}
        onScheduleDemoClick={handleScheduleDemo}
      />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
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
          
          <div className="flex items-center justify-center">
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
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Company Logos Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-heading font-heading-semibold mb-4 text-muted-foreground">
              Trusted by leading enterprises
            </h3>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              Join thousands of businesses that rely on Hub for their communication workflows
            </p>
          </div>
          
          <div className="relative overflow-hidden">
            {/* Gradient overlays for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
            
            {/* Animated logo carousel */}
            <div className="flex items-center justify-center gap-12 md:gap-16 lg:gap-20 animate-pulse">
              <div className="flex items-center justify-center min-w-[120px] h-16 opacity-60 hover:opacity-100 transition-opacity duration-300 group">
                <img 
                  src="/logo_hdfc_bank.svg" 
                  alt="HDFC Bank" 
                  className="h-18 md:h-22 w-auto filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
              
              <div className="flex items-center justify-center min-w-[120px] h-16 opacity-60 hover:opacity-100 transition-opacity duration-300 group">
                <img 
                  src="/logo_axis_bank.svg" 
                  alt="Axis Bank" 
                  className="h-18 md:h-22 w-auto filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
              
              <div className="flex items-center justify-center min-w-[120px] h-16 opacity-60 hover:opacity-100 transition-opacity duration-300 group">
                <img 
                  src="/logo_bajaj_finserv.svg" 
                  alt="Bajaj Finserv" 
                  className="h-18 md:h-22 w-auto filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
              
              <div className="flex items-center justify-center min-w-[120px] h-16 opacity-60 hover:opacity-100 transition-opacity duration-300 group">
                <img 
                  src="/logo_aditya_birla.svg" 
                  alt="Aditya Birla Group" 
                  className="h-18 md:h-22 w-auto filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>

              <div className="flex items-center justify-center min-w-[120px] h-16 opacity-60 hover:opacity-100 transition-opacity duration-300 group">
                <img 
                  src="/logo_tata_power.svg" 
                  alt="Tata Power" 
                  className="h-18 md:h-22 w-auto filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
              
              <div className="flex items-center justify-center min-w-[120px] h-16 opacity-60 hover:opacity-100 transition-opacity duration-300 group">
                <img 
                  src="/logo_bandhan_bank.svg" 
                  alt="Bandhan Bank" 
                  className="h-18 md:h-22 w-auto filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-8 mt-8 text-sm font-body text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span>500+ Enterprises</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span>10M+ Messages/Month</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-12 border border-primary/10"
        >
          <h3 className="text-3xl font-heading font-heading-bold mb-4">
            Ready to get started?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using Hub to streamline their communication workflows.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90 text-lg font-body-medium px-8 py-6 h-auto"
              onClick={() => setSupportModalOpen(true)}
            >
              Contact Support
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg font-body-medium px-8 py-6 h-auto"
              onClick={handleScheduleDemo}
            >
              Schedule a Demo
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative mt-20">
        {/* Main Footer */}
        <div className="bg-gradient-to-br from-card/95 to-card/90 backdrop-blur-xl border-t border-border/50 dark:from-card/20 dark:to-card/10">
          <div className="container mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              
              {/* Company Info & Logo */}
              <div className="lg:col-span-1">
                <div className="flex items-center gap-3 mb-6">
                  <img 
                    src="/lovable-uploads/7f409758-69d3-4918-a9f3-f2b8444f85a0.png" 
                    alt="Helo.ai Logo" 
                    className="h-10 w-auto"
                  />
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Intelligent communication routing platform designed for enterprise-scale 
                  messaging automation with multi-vendor support and advanced analytics.
                </p>
                
                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>contact@helo.ai</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>San Francisco, CA</span>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h3 className="font-semibold text-foreground mb-6">Products</h3>
                <ul className="space-y-3">
                  <li><a href="/flow-builder" className="text-muted-foreground hover:text-primary transition-colors">Flow Builder</a></li>
                  <li><a href="/monitoring" className="text-muted-foreground hover:text-primary transition-colors">Analytics Dashboard</a></li>
                  <li><a href="/templates" className="text-muted-foreground hover:text-primary transition-colors">Template Manager</a></li>
                  <li><a href="/integration" className="text-muted-foreground hover:text-primary transition-colors">API Integration</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Multi-Channel Routing</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Vendor Management</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Cost Optimization</a></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="font-semibold text-foreground mb-6">Company</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Careers</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Press</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Case Studies</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Partners</a></li>
                  <li><a href="/documentation" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
                </ul>
              </div>

              {/* Support & Legal */}
              <div>
                <h3 className="font-semibold text-foreground mb-6">Support & Legal</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact Support</a></li>
                  <li><button onClick={() => setSystemStatusOpen(true)} className="text-muted-foreground hover:text-primary transition-colors">System Status</button></li>
                  <li><button onClick={() => setFooterPrivacyOpen(true)} className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</button></li>
                  <li><button onClick={() => setFooterTermsOpen(true)} className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</button></li>
                  <li><button onClick={() => setCookiePreferencesOpen(true)} className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</button></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Security</a></li>
                </ul>
              </div>
            </div>

            {/* Social Media & Newsletter */}
            <div className="border-t border-border/50 mt-12 pt-8">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                
                {/* Social Media */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <span className="text-sm font-medium text-muted-foreground">Follow us:</span>
                  <div className="flex items-center gap-4">
                    <a 
                      href="#" 
                      className="p-2 rounded-lg bg-muted/20 hover:bg-muted/40 text-muted-foreground hover:text-primary transition-all duration-200"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a 
                      href="#" 
                      className="p-2 rounded-lg bg-muted/20 hover:bg-muted/40 text-muted-foreground hover:text-primary transition-all duration-200"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a 
                      href="#" 
                      className="p-2 rounded-lg bg-muted/20 hover:bg-muted/40 text-muted-foreground hover:text-primary transition-all duration-200"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a 
                      href="#" 
                      className="p-2 rounded-lg bg-muted/20 hover:bg-muted/40 text-muted-foreground hover:text-primary transition-all duration-200"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Newsletter Signup */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Stay updated:</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="px-4 py-2 bg-background/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                    />
                    <Button size="sm" className="whitespace-nowrap">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-gradient-to-r from-muted/80 to-muted/60 backdrop-blur-xl border-t border-border/30 dark:from-muted/10 dark:to-muted/5">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span>© {new Date().getFullYear()} Helo.ai by VivaConnect. All rights reserved.</span>
                <div className="hidden sm:flex items-center gap-4">
                  <button 
                    onClick={() => setFooterPrivacyOpen(true)}
                    className="hover:text-primary transition-colors"
                  >
                    Privacy
                  </button>
                  <button 
                    onClick={() => setFooterTermsOpen(true)}
                    className="hover:text-primary transition-colors"
                  >
                    Terms
                  </button>
                  <button 
                    onClick={() => setCookiePreferencesOpen(true)}
                    className="hover:text-primary transition-colors"
                  >
                    Cookies
                  </button>
                </div>
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
      
      {/* Footer Modals */}
      <PrivacyPolicyModal isOpen={footerPrivacyOpen} onClose={() => setFooterPrivacyOpen(false)} />
      <TermsOfServiceModal isOpen={footerTermsOpen} onClose={() => setFooterTermsOpen(false)} />
      <CookiePreferencesModal isOpen={cookiePreferencesOpen} onClose={() => setCookiePreferencesOpen(false)} />
      <SystemStatusModal isOpen={systemStatusOpen} onClose={() => setSystemStatusOpen(false)} />
      <VersionModal isOpen={versionModalOpen} onClose={() => setVersionModalOpen(false)} />
      
      <SupportModal isOpen={supportModalOpen} onClose={() => setSupportModalOpen(false)} />
    </div>
  );
};

export default Landing;