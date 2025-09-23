import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CircularGaugeProps {
  title: string;
  value: number;
  icon: LucideIcon;
  onClick: () => void;
  sparklineData: number[];
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  title,
  value,
  icon: Icon,
  onClick,
  sparklineData
}) => {
  const getColor = (val: number) => {
    if (val <= 70) return 'hsl(var(--status-success))';
    if (val <= 85) return 'hsl(var(--status-warning))';
    return 'hsl(var(--status-error))';
  };

  const getGradient = (val: number) => {
    if (val <= 70) return 'from-status-success/20 to-status-success/5';
    if (val <= 85) return 'from-status-warning/20 to-status-warning/5';
    return 'from-status-error/20 to-status-error/5';
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  // Generate sparkline path
  const sparklineWidth = 120;
  const sparklineHeight = 20;
  const points = sparklineData.map((val, i) => {
    const x = (i / (sparklineData.length - 1)) * sparklineWidth;
    const y = sparklineHeight - (val / 100) * sparklineHeight;
    return `${x},${y}`;
  }).join(' ');

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-br ${getGradient(value)} border-border/50`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
          </div>
        </div>

        <div className="flex items-center justify-center mb-4">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
                fill="transparent"
                opacity="0.3"
              />
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke={getColor(value)}
                strokeWidth="8"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                  filter: `drop-shadow(0 0 8px ${getColor(value)}30)`
                }}
              />
            </svg>
            
            {/* Center value */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span 
                className="text-2xl font-bold"
                style={{ color: getColor(value) }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                {value}%
              </motion.span>
            </div>
          </div>
        </div>

        {/* Sparkline */}
        <div className="flex justify-center">
          <svg width={sparklineWidth} height={sparklineHeight} className="opacity-70">
            <polyline
              points={points}
              fill="none"
              stroke={getColor(value)}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-center mt-2">
          <div 
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: getColor(value) }}
          />
          <span className="text-xs text-muted-foreground">
            {value <= 70 ? 'Healthy' : value <= 85 ? 'Warning' : 'Critical'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};