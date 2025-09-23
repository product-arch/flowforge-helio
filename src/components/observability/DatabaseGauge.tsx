import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DatabaseGaugeProps {
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  onClick: () => void;
  thresholds: {
    good: number;
    warning: number;
  };
  trend?: number[];
  subtitle?: string;
}

export const DatabaseGauge: React.FC<DatabaseGaugeProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  onClick,
  thresholds,
  trend = [],
  subtitle
}) => {
  const getStatus = () => {
    if (value <= thresholds.good) return 'healthy';
    if (value <= thresholds.warning) return 'warning';
    return 'critical';
  };

  const getColor = () => {
    const status = getStatus();
    switch (status) {
      case 'healthy': return 'hsl(var(--status-success))';
      case 'warning': return 'hsl(var(--status-warning))';
      case 'critical': return 'hsl(var(--status-error))';
      default: return 'hsl(var(--primary))';
    }
  };

  const getGradient = () => {
    const status = getStatus();
    switch (status) {
      case 'healthy': return 'from-status-success/20 to-status-success/5';
      case 'warning': return 'from-status-warning/20 to-status-warning/5';
      case 'critical': return 'from-status-error/20 to-status-error/5';
      default: return 'from-primary/20 to-primary/5';
    }
  };

  const getStatusLabel = () => {
    const status = getStatus();
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Calculate percentage for circular progress
  const maxValue = Math.max(thresholds.warning * 1.2, value * 1.1);
  const percentage = Math.min((value / maxValue) * 100, 100);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Generate mini sparkline
  const sparklinePoints = trend.slice(-10).map((val, i) => {
    const x = (i / 9) * 80;
    const maxTrend = Math.max(...trend);
    const y = 20 - (val / maxTrend) * 20;
    return `${x},${y}`;
  }).join(' ');

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br ${getGradient()} border-border/50 hover:border-border`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-background/50">
              <Icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{title}</h3>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          <Badge 
            variant="secondary" 
            className={
              getStatus() === 'healthy' ? 'bg-status-success/10 text-status-success border-status-success/20' :
              getStatus() === 'warning' ? 'bg-status-warning/10 text-status-warning border-status-warning/20' :
              'bg-status-error/10 text-status-error border-status-error/20'
            }
          >
            {getStatusLabel()}
          </Badge>
        </div>

        <div className="flex items-center justify-center mb-4">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="hsl(var(--muted))"
                strokeWidth="6"
                fill="transparent"
                opacity="0.2"
              />
              
              {/* Threshold indicators */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="hsl(var(--status-warning))"
                strokeWidth="2"
                fill="transparent"
                strokeDasharray={`${(thresholds.good / maxValue) * circumference} ${circumference}`}
                opacity="0.3"
              />
              
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke={getColor()}
                strokeWidth="6"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{
                  filter: `drop-shadow(0 0 12px ${getColor()}40)`
                }}
              />
            </svg>
            
            {/* Center value */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div 
                className="text-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="text-2xl font-bold" style={{ color: getColor() }}>
                  {typeof value === 'number' ? 
                    (value < 1 ? value.toFixed(2) : Math.round(value)) : 
                    value
                  }
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  {unit}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mini sparkline */}
        {trend.length > 0 && (
          <div className="flex justify-center mb-3">
            <svg width="80" height="20" className="opacity-70">
              <polyline
                points={sparklinePoints}
                fill="none"
                stroke={getColor()}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {/* Thresholds */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Good: &lt;{thresholds.good}{unit}</span>
          <span>Critical: &gt;{thresholds.warning}{unit}</span>
        </div>
      </CardContent>
    </Card>
  );
};