import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { Users, Info } from 'lucide-react';
import { TimeRange, ConnectionHeatmapData } from '@/types/observability';

interface ConnectionHeatmapProps {
  timeRange: TimeRange;
}

export const ConnectionHeatmap: React.FC<ConnectionHeatmapProps> = ({ timeRange }) => {
  const [selectedCell, setSelectedCell] = useState<ConnectionHeatmapData | null>(null);

  // Mock data - in real app, this would come from API
  const nodes = ['Node-1', 'Node-2', 'Node-3', 'Node-4'];
  const timeSlots = ['14:30', '14:31', '14:32', '14:33', '14:34', '14:35', '14:36', '14:37'];
  
  const heatmapData: ConnectionHeatmapData[] = [
    // Node-1
    { node: 'Node-1', time: '14:30', usage: 45, connections: 90 },
    { node: 'Node-1', time: '14:31', usage: 52, connections: 104 },
    { node: 'Node-1', time: '14:32', usage: 67, connections: 134 },
    { node: 'Node-1', time: '14:33', usage: 78, connections: 156 },
    { node: 'Node-1', time: '14:34', usage: 85, connections: 170 },
    { node: 'Node-1', time: '14:35', usage: 72, connections: 144 },
    { node: 'Node-1', time: '14:36', usage: 68, connections: 136 },
    { node: 'Node-1', time: '14:37', usage: 61, connections: 122 },
    
    // Node-2
    { node: 'Node-2', time: '14:30', usage: 38, connections: 76 },
    { node: 'Node-2', time: '14:31', usage: 41, connections: 82 },
    { node: 'Node-2', time: '14:32', usage: 55, connections: 110 },
    { node: 'Node-2', time: '14:33', usage: 63, connections: 126 },
    { node: 'Node-2', time: '14:34', usage: 71, connections: 142 },
    { node: 'Node-2', time: '14:35', usage: 69, connections: 138 },
    { node: 'Node-2', time: '14:36', usage: 58, connections: 116 },
    { node: 'Node-2', time: '14:37', usage: 52, connections: 104 },
    
    // Node-3
    { node: 'Node-3', time: '14:30', usage: 62, connections: 124 },
    { node: 'Node-3', time: '14:31', usage: 59, connections: 118 },
    { node: 'Node-3', time: '14:32', usage: 73, connections: 146 },
    { node: 'Node-3', time: '14:33', usage: 81, connections: 162 },
    { node: 'Node-3', time: '14:34', usage: 88, connections: 176 },
    { node: 'Node-3', time: '14:35', usage: 92, connections: 184 },
    { node: 'Node-3', time: '14:36', usage: 79, connections: 158 },
    { node: 'Node-3', time: '14:37', usage: 71, connections: 142 },
    
    // Node-4
    { node: 'Node-4', time: '14:30', usage: 35, connections: 70 },
    { node: 'Node-4', time: '14:31', usage: 42, connections: 84 },
    { node: 'Node-4', time: '14:32', usage: 48, connections: 96 },
    { node: 'Node-4', time: '14:33', usage: 56, connections: 112 },
    { node: 'Node-4', time: '14:34', usage: 64, connections: 128 },
    { node: 'Node-4', time: '14:35', usage: 58, connections: 116 },
    { node: 'Node-4', time: '14:36', usage: 51, connections: 102 },
    { node: 'Node-4', time: '14:37', usage: 47, connections: 94 }
  ];

  const getIntensity = (usage: number) => {
    if (usage < 50) return 0.2;
    if (usage < 70) return 0.5;
    if (usage < 85) return 0.7;
    return 1.0;
  };

  const getColor = (usage: number) => {
    if (usage < 50) return 'hsl(var(--status-success))';
    if (usage < 70) return 'hsl(var(--status-warning))';
    return 'hsl(var(--status-error))';
  };

  const getCellData = (node: string, time: string) => {
    return heatmapData.find(d => d.node === node && d.time === time);
  };

  const handleCellClick = (data: ConnectionHeatmapData) => {
    setSelectedCell(data);
    // In real app, this would open a detailed modal
    console.log('Opening node details for:', data);
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" />
          Connection Pool Heatmap
          <Badge variant="secondary" className="ml-2">
            {timeRange === 'live' ? 'Live' : timeRange}
          </Badge>
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="w-3 h-3" />
            Click cells for details
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Heatmap Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[500px]">
              {/* Header */}
              <div className="grid grid-cols-9 gap-1 mb-2">
                <div className="text-xs font-medium text-muted-foreground p-2">Node</div>
                {timeSlots.map(time => (
                  <div key={time} className="text-xs font-medium text-muted-foreground p-2 text-center">
                    {time}
                  </div>
                ))}
              </div>
              
              {/* Heatmap Rows */}
              {nodes.map(node => (
                <div key={node} className="grid grid-cols-9 gap-1 mb-1">
                  <div className="text-xs font-medium text-foreground p-2 flex items-center">
                    {node}
                  </div>
                  {timeSlots.map(time => {
                    const cellData = getCellData(node, time);
                    if (!cellData) return <div key={time} className="aspect-square" />;
                    
                    return (
                      <div
                        key={time}
                        className="aspect-square rounded cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg border border-border/30"
                        style={{
                          backgroundColor: getColor(cellData.usage),
                          opacity: getIntensity(cellData.usage)
                        }}
                        onClick={() => handleCellClick(cellData)}
                        title={`${node}, ${time}\n${cellData.usage}% usage\n${cellData.connections} connections`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">Connection Usage:</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded border border-border/30" 
                    style={{ backgroundColor: 'hsl(var(--status-success))', opacity: 0.5 }}
                  />
                  <span className="text-xs text-muted-foreground">&lt;50%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded border border-border/30" 
                    style={{ backgroundColor: 'hsl(var(--status-warning))', opacity: 0.7 }}
                  />
                  <span className="text-xs text-muted-foreground">50-85%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded border border-border/30" 
                    style={{ backgroundColor: 'hsl(var(--status-error))', opacity: 1.0 }}
                  />
                  <span className="text-xs text-muted-foreground">&gt;85%</span>
                </div>
              </div>
            </div>
            
            {selectedCell && (
              <div className="text-xs text-muted-foreground">
                Selected: {selectedCell.node} at {selectedCell.time} - {selectedCell.usage}% ({selectedCell.connections} conn)
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">4</div>
              <div className="text-xs text-muted-foreground">Active Nodes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-status-warning">67%</div>
              <div className="text-xs text-muted-foreground">Avg Usage</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-status-error">92%</div>
              <div className="text-xs text-muted-foreground">Peak Usage</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">534</div>
              <div className="text-xs text-muted-foreground">Total Connections</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};