import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BarChart3, Activity, AlertTriangle, TrendingUp } from 'lucide-react';

const Monitoring: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <BarChart3 className="w-5 h-5 text-emerald-500" />
              </div>
              <h1 className="text-xl font-semibold">Monitoring Dashboard</h1>
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
                <div className="p-4 bg-emerald-500/10 rounded-full">
                  <BarChart3 className="w-12 h-12 text-emerald-500" />
                </div>
              </div>
              <CardTitle className="text-3xl mb-4">Monitoring Module</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-muted-foreground">
                Real-time analytics, performance tracking, and comprehensive reporting dashboards 
                for your communication flows.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-accent/30 rounded-lg">
                  <Activity className="w-6 h-6 text-emerald-500 mb-2" />
                  <div className="text-sm font-medium">Real-time Metrics</div>
                </div>
                <div className="p-4 bg-accent/30 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-emerald-500 mb-2" />
                  <div className="text-sm font-medium">Performance Analytics</div>
                </div>
                <div className="p-4 bg-accent/30 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-emerald-500 mb-2" />
                  <div className="text-sm font-medium">Alert Management</div>
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">
                  The monitoring dashboard is currently under development. 
                  It will provide comprehensive insights into your flow performance, 
                  vendor health, and message delivery analytics.
                </p>
              </div>

              <Button 
                onClick={() => navigate('/')}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Hub
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Monitoring;