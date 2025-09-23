import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TimeRange } from '@/types/dashboard';

interface SystemChartProps {
  title: string;
  type: 'line' | 'area' | 'bar';
  data: any[];
  timeRange: TimeRange;
  detailed?: boolean;
}

export const SystemChart: React.FC<SystemChartProps> = ({
  title,
  type,
  data,
  timeRange,
  detailed = false
}) => {
  const getChartColors = () => ({
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    success: 'hsl(var(--status-success))',
    warning: 'hsl(var(--status-warning))',
    error: 'hsl(var(--status-error))',
    muted: 'hsl(var(--muted-foreground))'
  });

  const colors = getChartColors();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
              {entry.name.includes('CPU') || entry.name.includes('Memory') || entry.name.includes('percentage') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
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
            />
            <Tooltip content={<CustomTooltip />} />
            {detailed ? (
              <>
                <Line type="monotone" dataKey="node1_cpu" stroke={colors.primary} strokeWidth={2} dot={false} name="Node 1 CPU" />
                <Line type="monotone" dataKey="node2_cpu" stroke={colors.secondary} strokeWidth={2} dot={false} name="Node 2 CPU" />
                <Line type="monotone" dataKey="node3_cpu" stroke={colors.success} strokeWidth={2} dot={false} name="Node 3 CPU" />
              </>
            ) : (
              <>
                <Line type="monotone" dataKey="cpu" stroke={colors.primary} strokeWidth={2} dot={false} name="CPU" />
                <Line type="monotone" dataKey="memory" stroke={colors.secondary} strokeWidth={2} dot={false} name="Memory" />
              </>
            )}
            <Legend />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="timestamp" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="inbound" stackId="1" stroke={colors.success} fill={colors.success} fillOpacity={0.6} name="Inbound" />
            <Area type="monotone" dataKey="outbound" stackId="1" stroke={colors.warning} fill={colors.warning} fillOpacity={0.6} name="Outbound" />
            <Legend />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart data={data} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis type="category" dataKey="partition" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="percentage" 
              fill={colors.primary}
              name="Usage %" 
            />
          </BarChart>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          {title}
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            {timeRange === '60s' ? 'Live' : timeRange}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};