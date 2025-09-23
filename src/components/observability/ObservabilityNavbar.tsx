import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Clock, 
  Download, 
  Filter, 
  RefreshCw,
  FileText,
  FileSpreadsheet,
  Code
} from 'lucide-react';
import { TimeRange, FilterOptions, ExportOptions } from '@/types/observability';

interface ObservabilityNavbarProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onExport: (options: ExportOptions) => void;
  isLive: boolean;
}

export const ObservabilityNavbar: React.FC<ObservabilityNavbarProps> = ({
  timeRange,
  onTimeRangeChange,
  filters,
  onFiltersChange,
  onExport,
  isLive
}) => {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    timeRange: timeRange,
    includeAlerts: true,
    includeMetrics: true,
    includeErrors: true
  });

  const timeRangeOptions = [
    { value: 'live' as TimeRange, label: 'Live', icon: '🔴' },
    { value: '15m' as TimeRange, label: '15 minutes' },
    { value: '1h' as TimeRange, label: '1 hour' },
    { value: '24h' as TimeRange, label: '24 hours' },
    { value: '7d' as TimeRange, label: '7 days' }
  ];

  const activeFilterCount = Object.values(filters).filter(value => 
    Array.isArray(value) ? value.length > 0 : value
  ).length;

  const handleExport = () => {
    onExport(exportOptions);
    setExportModalOpen(false);
  };

  return (
    <div className="sticky top-[72px] z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Time Range Selector */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <Select value={timeRange} onValueChange={onTimeRangeChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeRangeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {option.icon && <span>{option.icon}</span>}
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Live Indicator */}
            {isLive && (
              <Badge variant="secondary" className="bg-status-success/10 text-status-success border-status-success/20">
                <div className="w-2 h-2 bg-status-success rounded-full mr-2 animate-pulse" />
                Live
              </Badge>
            )}

            {/* Refresh Button */}
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Button */}
            <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Filter Options</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Severity</Label>
                    <div className="mt-2 space-y-2">
                      {['info', 'warning', 'critical'].map(severity => (
                        <div key={severity} className="flex items-center space-x-2">
                          <Checkbox 
                            id={severity}
                            checked={filters.severity?.includes(severity as any) || false}
                            onCheckedChange={(checked) => {
                              const current = filters.severity || [];
                              if (checked) {
                                onFiltersChange({
                                  ...filters,
                                  severity: [...current, severity as any]
                                });
                              } else {
                                onFiltersChange({
                                  ...filters,
                                  severity: current.filter(s => s !== severity)
                                });
                              }
                            }}
                          />
                          <Label htmlFor={severity} className="capitalize">
                            {severity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onFiltersChange({})}>
                      Clear All
                    </Button>
                    <Button onClick={() => setFilterModalOpen(false)}>
                      Apply
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Export Button */}
            <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Export Data</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Format</Label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {[
                        { value: 'pdf', label: 'PDF', icon: FileText },
                        { value: 'csv', label: 'CSV', icon: FileSpreadsheet },
                        { value: 'json', label: 'JSON', icon: Code }
                      ].map(format => (
                        <Button
                          key={format.value}
                          variant={exportOptions.format === format.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setExportOptions({...exportOptions, format: format.value as any})}
                          className="gap-2"
                        >
                          <format.icon className="w-4 h-4" />
                          {format.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Include</Label>
                    <div className="mt-2 space-y-2">
                      {[
                        { key: 'includeMetrics', label: 'Metrics Data' },
                        { key: 'includeAlerts', label: 'Alerts' },
                        { key: 'includeErrors', label: 'Error Logs' }
                      ].map(option => (
                        <div key={option.key} className="flex items-center space-x-2">
                          <Checkbox 
                            id={option.key}
                            checked={exportOptions[option.key as keyof ExportOptions] as boolean}
                            onCheckedChange={(checked) => 
                              setExportOptions({
                                ...exportOptions,
                                [option.key]: checked
                              })
                            }
                          />
                          <Label htmlFor={option.key}>
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setExportModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleExport}>
                      Export
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};