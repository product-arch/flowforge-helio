import React from 'react';
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
  Github
} from 'lucide-react';

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
          
          <div className="flex items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90 text-lg font-body-medium px-8 py-6 h-auto"
              onClick={() => navigate('/flow-builder')}
            >
              <Play className="w-5 h-5 mr-2" />
              Build Routing Flow
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
              onClick={() => navigate('/flow-builder')}
            >
              Start Building Free
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
      <footer className="bg-card/30 border-t border-border/50 mt-24">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">Hub</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Intelligent messaging workflows for modern businesses.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="sm">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Github className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Button variant="link" className="h-auto p-0">Features</Button></li>
                <li><Button variant="link" className="h-auto p-0">Pricing</Button></li>
                <li><Button variant="link" className="h-auto p-0">API</Button></li>
                <li><Button variant="link" className="h-auto p-0">Documentation</Button></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Button variant="link" className="h-auto p-0">Help Center</Button></li>
                <li><Button variant="link" className="h-auto p-0">Community</Button></li>
                <li><Button variant="link" className="h-auto p-0">Status</Button></li>
                <li><Button variant="link" className="h-auto p-0">Contact</Button></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-medium mb-4">Contact</h4>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4" />
                  hello@hub.com
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4" />
                  +1 (555) 123-4567
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  San Francisco, CA
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;