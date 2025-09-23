import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterOptions } from '@/types/dashboard';
import { Filter, MapPin, Users, Building } from 'lucide-react';

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: FilterOptions) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  open,
  onOpenChange,
  onApplyFilters
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    geography: [],
    client: [],
    vendor: [],
    severity: []
  });

  const geographyOptions = ['US-East', 'US-West', 'EU-Central', 'Asia-Pacific', 'South America'];
  const clientOptions = ['Enterprise-A', 'Enterprise-B', 'SMB-Group', 'Startup-Collective'];
  const vendorOptions = ['Twilio', 'MessageBird', 'Vonage', 'Plivo', 'Sinch'];
  const severityOptions = [
    { value: 'success', label: 'Success', color: 'text-status-success' },
    { value: 'warning', label: 'Warning', color: 'text-status-warning' },
    { value: 'error', label: 'Error', color: 'text-status-error' }
  ];

  const handleFilterChange = (category: keyof FilterOptions, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [category]: checked
        ? [...(prev[category] || []), value]
        : (prev[category] || []).filter(item => item !== value)
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      geography: [],
      client: [],
      vendor: [],
      severity: []
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).reduce((sum, arr) => sum + (arr?.length || 0), 0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Dashboard Data
            {getActiveFiltersCount() > 0 && (
              <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                {getActiveFiltersCount()} active
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Geography Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Geography
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {geographyOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`geo-${option}`}
                    checked={filters.geography?.includes(option) || false}
                    onCheckedChange={(checked) => 
                      handleFilterChange('geography', option, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`geo-${option}`} 
                    className="text-sm cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Client Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Client Segment
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {clientOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`client-${option}`}
                    checked={filters.client?.includes(option) || false}
                    onCheckedChange={(checked) => 
                      handleFilterChange('client', option, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`client-${option}`} 
                    className="text-sm cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Vendor Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Building className="w-4 h-4" />
              Vendor
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {vendorOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`vendor-${option}`}
                    checked={filters.vendor?.includes(option) || false}
                    onCheckedChange={(checked) => 
                      handleFilterChange('vendor', option, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`vendor-${option}`} 
                    className="text-sm cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Severity Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Alert Severity</Label>
            <div className="grid grid-cols-3 gap-2">
              {severityOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`severity-${option.value}`}
                    checked={filters.severity?.includes(option.value as any) || false}
                    onCheckedChange={(checked) => 
                      handleFilterChange('severity', option.value, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`severity-${option.value}`} 
                    className={`text-sm cursor-pointer ${option.color}`}
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Summary */}
          {getActiveFiltersCount() > 0 && (
            <div className="bg-muted/30 rounded-lg p-3">
              <h4 className="text-sm font-medium mb-2">Active Filters</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                {filters.geography && filters.geography.length > 0 && (
                  <div>Geography: {filters.geography.join(', ')}</div>
                )}
                {filters.client && filters.client.length > 0 && (
                  <div>Clients: {filters.client.join(', ')}</div>
                )}
                {filters.vendor && filters.vendor.length > 0 && (
                  <div>Vendors: {filters.vendor.join(', ')}</div>
                )}
                {filters.severity && filters.severity.length > 0 && (
                  <div>Severity: {filters.severity.join(', ')}</div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};