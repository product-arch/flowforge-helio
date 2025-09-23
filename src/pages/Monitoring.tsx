import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from '@/components/common/PageHeader';
import { 
  PersonalInfoModal, 
  AccountSettingsModal, 
  BillingModal
} from '@/components/flow/AccountModals';
import { SupportModal } from '@/components/flow/SupportModal';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { 
  BarChart3, 
  Activity, 
  MessageSquare, 
  TrendingUp, 
  Shield, 
  Database,
  ArrowRight
} from "lucide-react";

const Monitoring = () => {
  const navigate = useNavigate();
  
  // Modal states for navigation
  const [personalInfoOpen, setPersonalInfoOpen] = useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  const monitoringOptions = [
    {
      title: "System Health Dashboard",
      description: "Monitor CPU, memory, network, and overall system performance metrics",
      icon: Activity,
      color: "text-blue-500",
      path: "/dashboard",
      features: ["Real-time metrics", "Performance alerts", "Resource utilization", "Service status"]
    },
    {
      title: "Analytics Dashboard", 
      description: "Track traffic patterns, vendor performance, and business intelligence",
      icon: BarChart3,
      color: "text-green-500", 
      path: "/analytics",
      features: ["Traffic analytics", "Vendor insights", "Performance trends", "Custom reports"]
    },
    {
      title: "Message Queue Monitoring",
      description: "Monitor queue health, latency, throughput, and dead letter queues",
      icon: MessageSquare,
      color: "text-purple-500",
      path: "/queue", 
      features: ["Queue health", "Latency tracking", "DLQ management", "Retry analysis"]
    },
    {
      title: "Real-time Observability",
      description: "Advanced database and API monitoring with real-time insights and correlation",
      icon: Database,
      color: "text-orange-500",
      path: "/observability",
      features: ["Database metrics", "API monitoring", "Real-time alerts", "Performance drilldowns"]
    }
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <PageHeader
          title="Monitoring & Analytics Hub"
          subtitle="Comprehensive monitoring suite for system health, analytics, and message queue performance"
          icon={<Activity className="w-5 h-5 text-white" />}
          onPersonalInfoClick={() => setPersonalInfoOpen(true)}
          onAccountSettingsClick={() => setAccountSettingsOpen(true)}
          onBillingClick={() => setBillingOpen(true)}
          onSupportClick={() => setSupportOpen(true)}
        />
        
        <main className="container mx-auto px-6 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {monitoringOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <Card 
                key={index} 
                className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border cursor-pointer"
                onClick={() => navigate(option.path)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-3 rounded-lg bg-background/50 ${option.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {option.title}
                      </CardTitle>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3 mb-6">
                    <h4 className="text-sm font-medium text-foreground">Key Features:</h4>
                    <ul className="space-y-2">
                      {option.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className={`w-1.5 h-1.5 rounded-full ${option.color.replace('text-', 'bg-')}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    className="w-full group-hover:scale-105 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(option.path);
                    }}
                  >
                    Open Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
                
                {/* Subtle background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 overflow-hidden">
                  <IconComponent className="w-full h-full translate-x-8 -translate-y-8 rotate-12" />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-500" />
              <h3 className="font-semibold text-foreground">Real-time Updates</h3>
              <p className="text-sm text-muted-foreground">Live data streams with automatic refresh</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Shield className="w-8 h-8 text-green-500" />
              <h3 className="font-semibold text-foreground">Smart Alerts</h3>
              <p className="text-sm text-muted-foreground">Intelligent alerting with customizable thresholds</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Database className="w-8 h-8 text-purple-500" />
              <h3 className="font-semibold text-foreground">Data Export</h3>
              <p className="text-sm text-muted-foreground">Export reports in multiple formats</p>
            </div>
          </div>
        </div>
        </main>
        
        {/* Modals */}
        <PersonalInfoModal 
          isOpen={personalInfoOpen} 
          onClose={() => setPersonalInfoOpen(false)} 
        />
        <AccountSettingsModal 
          isOpen={accountSettingsOpen} 
          onClose={() => setAccountSettingsOpen(false)} 
        />
        <BillingModal 
          isOpen={billingOpen} 
          onClose={() => setBillingOpen(false)} 
        />
        <SupportModal 
          isOpen={supportOpen} 
          onClose={() => setSupportOpen(false)} 
        />
      </div>
    </ThemeProvider>
  );
};

export default Monitoring;