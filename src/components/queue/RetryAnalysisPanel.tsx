import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RetryReason } from '@/types/queue-dashboard';
import { Filter, FilterX } from 'lucide-react';

interface RetryAnalysisPanelProps {
  retryReasons: RetryReason[];
  selectedFilter: string | null;
  onFilterSelect: (reason: string | null) => void;
}

const RetryAnalysisPanel: React.FC<RetryAnalysisPanelProps> = ({ 
  retryReasons, 
  selectedFilter, 
  onFilterSelect 
}) => {
  const chartData = retryReasons.map(reason => ({
    name: reason.name,
    value: reason.count,
    percentage: reason.percentage,
    color: reason.color
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm">
            <span className="font-mono">{data.value.toLocaleString()}</span> retries 
            <span className="text-muted-foreground"> ({data.payload.percentage}%)</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">Click to filter DLQ table</p>
        </div>
      );
    }
    return null;
  };

  const handlePieClick = (data: any) => {
    const newFilter = selectedFilter === data.name ? null : data.name;
    onFilterSelect(newFilter);
  };

  const totalRetries = retryReasons.reduce((sum, reason) => sum + reason.count, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Retry Analysis</CardTitle>
          {selectedFilter && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Filter className="w-3 h-3" />
                {selectedFilter}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onFilterSelect(null)}
              >
                <FilterX className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Total retries: <span className="font-mono font-semibold">{totalRetries.toLocaleString()}</span>
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Pie Chart */}
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                  onClick={handlePieClick}
                  className="cursor-pointer"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke={selectedFilter === entry.name ? "hsl(var(--foreground))" : "none"}
                      strokeWidth={selectedFilter === entry.name ? 2 : 0}
                      opacity={selectedFilter && selectedFilter !== entry.name ? 0.5 : 1}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend and Stats */}
          <div className="space-y-3">
            {retryReasons.map((reason, index) => (
              <div 
                key={reason.id}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all border ${
                  selectedFilter === reason.name 
                    ? 'bg-accent border-accent-foreground' 
                    : 'hover:bg-muted border-transparent'
                }`}
                onClick={() => handlePieClick({ name: reason.name })}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: reason.color }}
                  />
                  <span className="text-sm font-medium">{reason.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-mono">{reason.count.toLocaleString()}</span>
                  <Badge variant="outline" className="text-xs">
                    {reason.percentage}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <h4 className="text-sm font-semibold mb-2">Quick Insights</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            {retryReasons[0] && (
              <p>• Top retry reason: <span className="font-semibold">{retryReasons[0].name}</span> ({retryReasons[0].percentage}%)</p>
            )}
            {retryReasons.filter(r => r.name.toLowerCase().includes('vendor')).length > 0 && (
              <p>• Vendor-related issues account for {retryReasons.filter(r => r.name.toLowerCase().includes('vendor')).reduce((sum, r) => sum + r.percentage, 0)}% of retries</p>
            )}
            <p>• Click on pie slices or legend items to filter the DLQ table below</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RetryAnalysisPanel;