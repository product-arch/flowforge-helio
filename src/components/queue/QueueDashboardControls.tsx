import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { TimeRange, FilterOptions, ExportFormat, QueueType } from '@/types/queue-dashboard';
import { Clock, Download, Filter, Sun, Moon, FilterX } from 'lucide-react';
import { useThemeHandler } from '@/hooks/useThemeHandler';
import { useToast } from '@/hooks/use-toast';

interface QueueDashboardControlsProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onExport: (format: ExportFormat) => void;
}

const QueueDashboardControls: React.FC<QueueDashboardControlsProps> = ({
  timeRange,
  onTimeRangeChange,
  filters,
  onFiltersChange,
  onExport
}) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>({
    format: 'pdf',
    timeRange,
    includeAlerts: true,
    includeMetrics: true,
    includeRetryAnalysis: true,
    includeDLQ: false
  });
  
  const { mode, toggleMode } = useThemeHandler();
  const { toast } = useToast();

  const timeRangeOptions = [
    { value: '60s' as TimeRange, label: 'Live (60s)' },
    { value: '15m' as TimeRange, label: '15 minutes' },
    { value: '1h' as TimeRange, label: '1 hour' },
    { value: '24h' as TimeRange, label: '24 hours' },
    { value: '7d' as TimeRange, label: '7 days' }
  ];

  const queueTypes: { value: QueueType; label: string }[] = [
    { value: 'otp', label: 'OTP' },
    { value: 'promo', label: 'Promo' },
    { value: 'transactional', label: 'Transactional' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'email', label: 'Email' },
    { value: 'voice', label: 'Voice' }
  ];

  const vendors = ['Twilio', 'Infobip', 'MessageBird', 'Vonage', 'Plivo', 'MSG91', 'Exotel'];
  const clients = ['Enterprise A', 'Enterprise B', 'SMB Client 1', 'SMB Client 2', 'Startup X'];
  const severities: ('success' | 'warning' | 'error')[] = ['success', 'warning', 'error'];

  const handleExport = () => {
    const finalFormat = { ...exportFormat, timeRange };
    onExport(finalFormat);
    setShowExportModal(false);
    
    toast({
      title: "Export Started",
      description: `Generating ${finalFormat.format.toUpperCase()} report for ${timeRange} timeframe`,
      className: "border-status-info bg-status-info/10 text-status-info"
    });
    
    // Simulate export completion
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Report downloaded successfully`,
        className: "border-status-success bg-status-success/10 text-status-success"
      });
    }, 2000);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    onFiltersChange({});
    setShowFilterModal(false);
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset",
      className: "border-status-info bg-status-info/10 text-status-info"
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.channels?.length) count++;
    if (filters.vendors?.length) count++;
    if (filters.clients?.length) count++;
    if (filters.severities?.length) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="flex items-center justify-between p-4 bg-card border-t">
      {/* Left Side - Time Range */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Filter className="w-3 h-3" />
              {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
            </Badge>
            {Object.entries(filters).map(([key, values]) => 
              values && values.length > 0 && (
                <Badge key={key} variant="outline" className="text-xs">
                  {key}: {values.length}
                </Badge>
              )
            )}
          </div>
        )}
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilterModal(true)}
          className="flex items-center gap-1"
        >
          <Filter className="w-4 h-4" />
          Filter
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowExportModal(true)}
        >
          <Download className="w-4 h-4 mr-1" />
          Export
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleMode}
        >
          {mode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>

      {/* Export Modal */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Dashboard Report</DialogTitle>
            <DialogDescription>
              Choose the format and data to include in your export
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Export Format</Label>
              <Select 
                value={exportFormat.format} 
                onValueChange={(value: 'pdf' | 'csv' | 'json') => 
                  setExportFormat(prev => ({ ...prev, format: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="csv">CSV Data</SelectItem>
                  <SelectItem value="json">JSON Data</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Time Range</Label>
              <Select 
                value={exportFormat.timeRange} 
                onValueChange={(value: TimeRange) => 
                  setExportFormat(prev => ({ ...prev, timeRange: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeRangeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Include Data</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metrics"
                    checked={exportFormat.includeMetrics}
                    onCheckedChange={(checked) => 
                      setExportFormat(prev => ({ ...prev, includeMetrics: checked as boolean }))
                    }
                  />
                  <Label htmlFor="metrics">Queue Metrics</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="alerts"
                    checked={exportFormat.includeAlerts}
                    onCheckedChange={(checked) => 
                      setExportFormat(prev => ({ ...prev, includeAlerts: checked as boolean }))
                    }
                  />
                  <Label htmlFor="alerts">Alert History</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="retry"
                    checked={exportFormat.includeRetryAnalysis}
                    onCheckedChange={(checked) => 
                      setExportFormat(prev => ({ ...prev, includeRetryAnalysis: checked as boolean }))
                    }
                  />
                  <Label htmlFor="retry">Retry Analysis</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dlq"
                    checked={exportFormat.includeDLQ}
                    onCheckedChange={(checked) => 
                      setExportFormat(prev => ({ ...prev, includeDLQ: checked as boolean }))
                    }
                  />
                  <Label htmlFor="dlq">DLQ Messages</Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport}>
              Export Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Modal */}
      <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Filter Dashboard</DialogTitle>
            <DialogDescription>
              Apply filters to focus on specific queues, vendors, or alert types
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Queue Types</Label>
              <div className="space-y-2 mt-2">
                {queueTypes.map(type => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`queue-${type.value}`}
                      checked={filters.channels?.includes(type.value) || false}
                      onCheckedChange={(checked) => {
                        const current = filters.channels || [];
                        const updated = checked 
                          ? [...current, type.value]
                          : current.filter(c => c !== type.value);
                        handleFilterChange('channels', updated.length > 0 ? updated : undefined);
                      }}
                    />
                    <Label htmlFor={`queue-${type.value}`}>{type.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Vendors</Label>
              <div className="space-y-2 mt-2">
                {vendors.map(vendor => (
                  <div key={vendor} className="flex items-center space-x-2">
                    <Checkbox
                      id={`vendor-${vendor}`}
                      checked={filters.vendors?.includes(vendor) || false}
                      onCheckedChange={(checked) => {
                        const current = filters.vendors || [];
                        const updated = checked 
                          ? [...current, vendor]
                          : current.filter(v => v !== vendor);
                        handleFilterChange('vendors', updated.length > 0 ? updated : undefined);
                      }}
                    />
                    <Label htmlFor={`vendor-${vendor}`}>{vendor}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Alert Severities</Label>
              <div className="space-y-2 mt-2">
                {severities.map(severity => (
                  <div key={severity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`severity-${severity}`}
                      checked={filters.severities?.includes(severity) || false}
                      onCheckedChange={(checked) => {
                        const current = filters.severities || [];
                        const updated = checked 
                          ? [...current, severity]
                          : current.filter(s => s !== severity);
                        handleFilterChange('severities', updated.length > 0 ? updated : undefined);
                      }}
                    />
                    <Label htmlFor={`severity-${severity}`} className="capitalize">
                      {severity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Clients</Label>
              <div className="space-y-2 mt-2">
                {clients.map(client => (
                  <div key={client} className="flex items-center space-x-2">
                    <Checkbox
                      id={`client-${client}`}
                      checked={filters.clients?.includes(client) || false}
                      onCheckedChange={(checked) => {
                        const current = filters.clients || [];
                        const updated = checked 
                          ? [...current, client]
                          : current.filter(c => c !== client);
                        handleFilterChange('clients', updated.length > 0 ? updated : undefined);
                      }}
                    />
                    <Label htmlFor={`client-${client}`}>{client}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={clearFilters}>
              <FilterX className="w-4 h-4 mr-1" />
              Clear All
            </Button>
            <Button onClick={() => setShowFilterModal(false)}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QueueDashboardControls;