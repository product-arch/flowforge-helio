import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IslandNavbar } from "@/components/navigation/IslandNavbar";
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
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <IslandNavbar />
      
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Monitoring & Analytics Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive monitoring suite for system health, analytics, and message queue performance. 
            Choose your monitoring focus area below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
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
      </div>
    </div>
  );
};

export default Monitoring;