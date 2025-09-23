import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimeRange } from '@/types/dashboard';
import { Download, FileText, FileSpreadsheet, Code } from 'lucide-react';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (format: 'pdf' | 'csv' | 'json') => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  open,
  onOpenChange,
  onExport
}) => {
  const [format, setFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');
  const [timeRange, setTimeRange] = useState<TimeRange>('1h');
  const [includeAlerts, setIncludeAlerts] = useState(true);
  const [includeMetrics, setIncludeMetrics] = useState(true);

  const handleExport = () => {
    onExport(format);
    onOpenChange(false);
  };

  const formatOptions = [
    { value: 'pdf', label: 'PDF Report', icon: FileText, description: 'Formatted report with charts and tables' },
    { value: 'csv', label: 'CSV Data', icon: FileSpreadsheet, description: 'Raw data in comma-separated format' },
    { value: 'json', label: 'JSON Data', icon: Code, description: 'Structured data in JSON format' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Dashboard Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Export Format</Label>
            <RadioGroup value={format} onValueChange={(value) => setFormat(value as any)}>
              {formatOptions.map((option) => (
                <div key={option.value} className="flex items-start space-x-2 p-3 border border-border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={option.value} className="flex items-center gap-2 cursor-pointer">
                      <option.icon className="w-4 h-4" />
                      {option.label}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Time Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Time Range</Label>
            <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15m">Last 15 minutes</SelectItem>
                <SelectItem value="1h">Last hour</SelectItem>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Include Data</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="metrics" 
                  checked={includeMetrics} 
                  onCheckedChange={(checked) => setIncludeMetrics(checked as boolean)} 
                />
                <Label htmlFor="metrics" className="text-sm cursor-pointer">
                  System Metrics (CPU, Memory, Disk, Network)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="alerts" 
                  checked={includeAlerts} 
                  onCheckedChange={(checked) => setIncludeAlerts(checked as boolean)} 
                />
                <Label htmlFor="alerts" className="text-sm cursor-pointer">
                  Alerts and Events
                </Label>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-muted/30 rounded-lg p-3">
            <h4 className="text-sm font-medium mb-2">Export Preview</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Format: {formatOptions.find(f => f.value === format)?.label}</div>
              <div>Time Range: {timeRange === '15m' ? 'Last 15 minutes' : timeRange === '1h' ? 'Last hour' : timeRange === '24h' ? 'Last 24 hours' : 'Last 7 days'}</div>
              <div>Includes: {[includeMetrics && 'Metrics', includeAlerts && 'Alerts'].filter(Boolean).join(', ')}</div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport}
            disabled={!includeMetrics && !includeAlerts}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export {format.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};