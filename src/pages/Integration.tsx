import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plug, Database, Webhook, Settings } from 'lucide-react';
import { ThemeProvider } from '@/contexts/ThemeContext';

const Integration: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background font-body">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/home')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Plug className="w-5 h-5 text-purple-500" />
              </div>
              <h1 className="text-xl font-heading font-heading-semibold">Integration Hub</h1>
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
                <div className="p-4 bg-purple-500/10 rounded-full">
                  <Plug className="w-12 h-12 text-purple-500" />
                </div>
              </div>
              <CardTitle className="text-3xl font-heading font-heading-bold mb-4">Integration Module</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg font-body text-muted-foreground">
                Connect with external systems, APIs, and databases for seamless data flow 
                and enhanced automation capabilities.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-accent/30 rounded-lg">
                  <Database className="w-6 h-6 text-purple-500 mb-2" />
                  <div className="text-sm font-body-medium">Database Connectors</div>
                </div>
                <div className="p-4 bg-accent/30 rounded-lg">
                  <Webhook className="w-6 h-6 text-purple-500 mb-2" />
                  <div className="text-sm font-body-medium">Webhook Management</div>
                </div>
                <div className="p-4 bg-accent/30 rounded-lg">
                  <Settings className="w-6 h-6 text-purple-500 mb-2" />
                  <div className="text-sm font-body-medium">API Configuration</div>
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-6">
                <h3 className="text-lg font-heading font-heading-semibold mb-2">Coming Soon</h3>
                <p className="font-body text-muted-foreground">
                  The integration hub is currently under development. 
                  It will provide powerful tools to connect Hub with your existing 
                  systems and third-party services.
                </p>
              </div>

              <Button 
                onClick={() => navigate('/home')}
                className="w-full font-body-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Hub
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      </div>
    </ThemeProvider>
  );
};

export default Integration;