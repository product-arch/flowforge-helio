import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { Clock, TrendingUp, Eye } from 'lucide-react';
import { TimeRange } from '@/types/observability';

interface LatencyChartProps {
  timeRange: TimeRange;
}

export const LatencyChart: React.FC<LatencyChartProps> = ({ timeRange }) => {
  const [visibleLines, setVisibleLines] = useState({
    p50: true,
    p95: true,
    p99: true
  });

  // Mock data - in real app, this would come from API
  const data = [
    { timestamp: '14:30', p50: 120, p95: 280, p99: 650, queryType: 'Template Validation' },
    { timestamp: '14:31', p50: 135, p95: 310, p99: 720, queryType: 'DLR Lookup' },
    { timestamp: '14:32', p50: 145, p95: 420, p99: 890, queryType: 'Campaign Write' },
    { timestamp: '14:33', p50: 160, p95: 450, p99: 950, queryType: 'Template Validation' },
    { timestamp: '14:34', p50: 180, p95: 520, p99: 1100, queryType: 'DLR Lookup' },
    { timestamp: '14:35', p50: 170, p95: 480, p99: 980, queryType: 'Campaign Write' },
    { timestamp: '14:36', p50: 155, p95: 390, p99: 840, queryType: 'Template Validation' },
    { timestamp: '14:37', p50: 140, p95: 350, p99: 750, queryType: 'DLR Lookup' }
  ];

  const thresholds = {
    warning: 500,
    critical: 1000
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">{label}</p>
          <p className="text-xs text-muted-foreground mb-2">Query: {data?.queryType}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value}ms
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const toggleLine = (line: keyof typeof visibleLines) => {
    setVisibleLines(prev => ({ ...prev, [line]: !prev[line] }));
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Query Latency Timeline
            <Badge variant="secondary" className="ml-2">
              {timeRange === 'live' ? 'Live' : timeRange}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            {Object.entries(visibleLines).map(([line, visible]) => (
              <Button
                key={line}
                variant={visible ? "default" : "outline"}
                size="sm"
                onClick={() => toggleLine(line as keyof typeof visibleLines)}
                className="h-7 px-2 text-xs"
              >
                <Eye className="w-3 h-3 mr-1" />
                {line.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="timestamp" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Threshold lines */}
              <ReferenceLine 
                y={thresholds.warning} 
                stroke="hsl(var(--status-warning))" 
                strokeDasharray="4 4"
                opacity={0.7}
              />
              <ReferenceLine 
                y={thresholds.critical} 
                stroke="hsl(var(--status-error))" 
                strokeDasharray="4 4"
                opacity={0.7}
              />
              
              {/* Lines */}
              {visibleLines.p50 && (
                <Line 
                  type="monotone" 
                  dataKey="p50" 
                  stroke="hsl(var(--status-success))" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: "hsl(var(--status-success))" }}
                  name="p50"
                />
              )}
              {visibleLines.p95 && (
                <Line 
                  type="monotone" 
                  dataKey="p95" 
                  stroke="hsl(var(--status-warning))" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: "hsl(var(--status-warning))" }}
                  name="p95"
                />
              )}
              {visibleLines.p99 && (
                <Line 
                  type="monotone" 
                  dataKey="p99" 
                  stroke="hsl(var(--status-error))" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: "hsl(var(--status-error))" }}
                  name="p99"
                />
              )}
              
              <Legend 
                content={({ payload }) => (
                  <div className="flex justify-center gap-4 mt-2">
                    {payload?.map((entry, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <div 
                          className="w-3 h-0.5" 
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-xs text-muted-foreground">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Quick stats */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="w-3 h-3" />
            <span>Avg latency: 155ms</span>
          </div>
          <div className="flex gap-4 text-xs">
            <span className="text-status-warning">Warning: {thresholds.warning}ms</span>
            <span className="text-status-error">Critical: {thresholds.critical}ms</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};