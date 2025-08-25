import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  User
} from 'lucide-react';

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

  const handleModuleClick = (route: string) => {
    if (route === '/flow-builder') {
      navigate(route);
    } else {
      // For other modules, show coming soon message
      console.log(`Navigating to ${route} - Coming soon!`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
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
                <Button variant="ghost" className="text-sm">Modules</Button>
                <Button variant="ghost" className="text-sm">Support</Button>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <HelpCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </Button>
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
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            Build your first messaging flow with Hub
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Create intelligent communication workflows with multi-vendor routing, 
            real-time analytics, and seamless integrations. Start building in minutes.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6 h-auto"
              onClick={() => navigate('/flow-builder')}
            >
              <Play className="w-5 h-5 mr-2" />
              Start New Flow
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto">
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
                <div className="text-sm text-muted-foreground">{stat.label}</div>
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
            <h3 className="text-3xl font-bold mb-4">Platform Modules</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                        <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                          {module.title}
                          {module.stats && (
                            <Badge variant="secondary" className="text-xs">
                              {module.stats}
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-base leading-relaxed">
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
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
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
              <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Jump straight into building your first routing flow, or explore our other modules 
                to see how Hub can transform your communication workflows.
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:opacity-90"
                  onClick={() => navigate('/flow-builder')}
                >
                  <GitBranch className="w-5 h-5 mr-2" />
                  Build Routing Flow
                </Button>
                <Button variant="outline" size="lg">
                  <FileText className="w-5 h-5 mr-2" />
                  View Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-md flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-muted-foreground">
                Hub - Intelligent Communication Routing Platform
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 Hub. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;