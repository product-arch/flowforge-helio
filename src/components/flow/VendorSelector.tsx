import React, { useState, useMemo } from 'react';
import { Search, Star, DollarSign, Zap, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Vendor {
  id: string;
  name: string;
  logo: string;
  region: string;
  tier: string;
  cost: 'low' | 'medium' | 'high';
  tps: number;
  availability: number;
  reliability: 'high' | 'medium' | 'low';
}

interface VendorSelectorProps {
  channelType: 'sms' | 'whatsapp' | 'email' | 'voice' | 'rcs';
  selectedVendor?: string;
  onVendorChange: (vendorId: string) => void;
}

const VENDORS: Record<string, Vendor[]> = {
  sms: [
    { id: 'twilio', name: 'Twilio', logo: '🔴', region: 'Global', tier: 'Premium', cost: 'high', tps: 1000, availability: 99.9, reliability: 'high' },
    { id: 'messagebird', name: 'MessageBird', logo: '🔵', region: 'Global', tier: 'Premium', cost: 'high', tps: 800, availability: 99.8, reliability: 'high' },
    { id: 'msg91', name: 'MSG91', logo: '🟢', region: 'India', tier: 'Standard', cost: 'low', tps: 500, availability: 99.5, reliability: 'medium' },
    { id: 'textlocal', name: 'Textlocal', logo: '🟡', region: 'India', tier: 'Standard', cost: 'low', tps: 300, availability: 99.2, reliability: 'medium' },
    { id: 'gupshup', name: 'Gupshup', logo: '🟠', region: 'India', tier: 'Premium', cost: 'medium', tps: 700, availability: 99.7, reliability: 'high' },
    { id: 'infobip', name: 'Infobip', logo: '🔷', region: 'Global', tier: 'Premium', cost: 'high', tps: 1200, availability: 99.9, reliability: 'high' },
    { id: 'sinch', name: 'Sinch', logo: '🟦', region: 'Global', tier: 'Premium', cost: 'medium', tps: 900, availability: 99.8, reliability: 'high' },
    { id: 'plivo', name: 'Plivo', logo: '🟪', region: 'Global', tier: 'Premium', cost: 'medium', tps: 600, availability: 99.6, reliability: 'high' }
  ],
  whatsapp: [
    { id: 'meta', name: 'Meta (WhatsApp)', logo: '🟢', region: 'Global', tier: 'Official', cost: 'medium', tps: 1000, availability: 99.9, reliability: 'high' },
    { id: 'twilio', name: 'Twilio WhatsApp', logo: '🔴', region: 'Global', tier: 'Premium', cost: 'high', tps: 800, availability: 99.8, reliability: 'high' },
    { id: 'gupshup', name: 'Gupshup WhatsApp', logo: '🟠', region: 'India', tier: 'Premium', cost: 'medium', tps: 600, availability: 99.7, reliability: 'high' },
    { id: 'infobip', name: 'Infobip WhatsApp', logo: '🔷', region: 'Global', tier: 'Premium', cost: 'high', tps: 700, availability: 99.8, reliability: 'high' },
    { id: 'interakt', name: 'Interakt', logo: '🟨', region: 'India', tier: 'Standard', cost: 'low', tps: 300, availability: 99.2, reliability: 'medium' }
  ],
  email: [
    { id: 'sendgrid', name: 'SendGrid', logo: '🔵', region: 'Global', tier: 'Premium', cost: 'medium', tps: 2000, availability: 99.9, reliability: 'high' },
    { id: 'mailgun', name: 'Mailgun', logo: '🔴', region: 'Global', tier: 'Premium', cost: 'medium', tps: 1500, availability: 99.8, reliability: 'high' },
    { id: 'ses', name: 'Amazon SES', logo: '🟧', region: 'Global', tier: 'Premium', cost: 'low', tps: 3000, availability: 99.9, reliability: 'high' },
    { id: 'postmark', name: 'Postmark', logo: '🟡', region: 'Global', tier: 'Premium', cost: 'high', tps: 1000, availability: 99.8, reliability: 'high' },
    { id: 'mailjet', name: 'Mailjet', logo: '🟢', region: 'Global', tier: 'Standard', cost: 'low', tps: 800, availability: 99.5, reliability: 'medium' }
  ],
  voice: [
    { id: 'twilio_voice', name: 'Twilio Voice', logo: '🔴', region: 'Global', tier: 'Premium', cost: 'high', tps: 500, availability: 99.9, reliability: 'high' },
    { id: 'plivo_voice', name: 'Plivo Voice', logo: '🟪', region: 'Global', tier: 'Premium', cost: 'medium', tps: 400, availability: 99.7, reliability: 'high' },
    { id: 'exotel', name: 'Exotel', logo: '🟢', region: 'India', tier: 'Premium', cost: 'low', tps: 300, availability: 99.5, reliability: 'medium' },
    { id: 'vonage_voice', name: 'Vonage Voice', logo: '⚪', region: 'Global', tier: 'Premium', cost: 'medium', tps: 600, availability: 99.8, reliability: 'high' }
  ],
  rcs: [
    { id: 'google_rcs', name: 'Google RCS', logo: '🟢', region: 'Global', tier: 'Official', cost: 'medium', tps: 800, availability: 99.8, reliability: 'high' },
    { id: 'infobip_rcs', name: 'Infobip RCS', logo: '🔷', region: 'Global', tier: 'Premium', cost: 'high', tps: 600, availability: 99.7, reliability: 'high' },
    { id: 'sinch_rcs', name: 'Sinch RCS', logo: '🟦', region: 'Global', tier: 'Premium', cost: 'medium', tps: 500, availability: 99.6, reliability: 'high' },
    { id: 'gupshup_rcs', name: 'Gupshup RCS', logo: '🟠', region: 'India', tier: 'Premium', cost: 'low', tps: 400, availability: 99.5, reliability: 'medium' }
  ]
};

export const VendorSelector: React.FC<VendorSelectorProps> = ({
  channelType,
  selectedVendor,
  onVendorChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [costFilter, setCostFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  const vendors = VENDORS[channelType] || [];

  const filteredAndSortedVendors = useMemo(() => {
    let filtered = vendors.filter(vendor => {
      const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCost = costFilter === 'all' || vendor.cost === costFilter;
      const matchesRegion = regionFilter === 'all' || vendor.region === regionFilter;
      
      return matchesSearch && matchesCost && matchesRegion;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'cost':
          const costOrder = { low: 0, medium: 1, high: 2 };
          return costOrder[a.cost] - costOrder[b.cost];
        case 'tps':
          return b.tps - a.tps;
        case 'availability':
          return b.availability - a.availability;
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [vendors, searchTerm, costFilter, regionFilter, sortBy]);

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getReliabilityColor = (reliability: string) => {
    switch (reliability) {
      case 'high': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label className="text-xs">Cost</Label>
            <Select value={costFilter} onValueChange={setCostFilter}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-xs">Region</Label>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Global">Global</SelectItem>
                <SelectItem value="India">India</SelectItem>
                <SelectItem value="Europe">Europe</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-xs">Sort by</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="cost">Cost</SelectItem>
                <SelectItem value="tps">TPS</SelectItem>
                <SelectItem value="availability">Availability</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Vendor Grid */}
      <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
        {filteredAndSortedVendors.map((vendor) => (
          <Card
            key={vendor.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedVendor === vendor.id
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:bg-muted/50'
            }`}
            onClick={() => onVendorChange(vendor.id)}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{vendor.logo}</span>
                  <div>
                    <div className="font-medium text-sm">{vendor.name}</div>
                    <div className="text-xs text-muted-foreground">{vendor.region}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="secondary" className={`text-xs ${getCostColor(vendor.cost)}`}>
                    {vendor.cost}
                  </Badge>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span>{vendor.tps}/s</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className={`w-3 h-3 ${getReliabilityColor(vendor.reliability)}`} />
                      <span>{vendor.availability}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedVendors.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No vendors found matching your criteria</p>
        </div>
      )}
    </div>
  );
};