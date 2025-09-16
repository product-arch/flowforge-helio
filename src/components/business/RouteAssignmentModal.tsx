import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Search, GitBranch, MessageSquare, Users, TrendingUp } from 'lucide-react';

interface Flow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  channels: string[];
  messagesProcessed: number;
  successRate: number;
  lastModified: string;
}

interface RouteAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessProfileName: string;
  onAssign: (routeId: string) => void;
}

// Mock flows data - in a real app, this would come from props or a service
const mockFlows: Flow[] = [
  {
    id: 'flow-001',
    name: 'Primary SMS Route',
    description: 'Main SMS routing with multi-vendor fallback',
    status: 'active',
    channels: ['sms'],
    messagesProcessed: 145000,
    successRate: 98.5,
    lastModified: '2024-01-15'
  },
  {
    id: 'flow-002',
    name: 'Email Marketing Flow',
    description: 'Optimized email delivery with geographic routing',
    status: 'active',
    channels: ['email'],
    messagesProcessed: 89000,
    successRate: 96.2,
    lastModified: '2024-01-14'
  },
  {
    id: 'flow-003',
    name: 'WhatsApp Business Route',
    description: 'WhatsApp messaging with template management',
    status: 'active',
    channels: ['whatsapp'],
    messagesProcessed: 67000,
    successRate: 94.8,
    lastModified: '2024-01-13'
  },
  {
    id: 'flow-004',
    name: 'Multi-Channel Campaign',
    description: 'Cross-channel routing for campaign messages',
    status: 'active',
    channels: ['sms', 'email', 'whatsapp'],
    messagesProcessed: 234000,
    successRate: 97.1,
    lastModified: '2024-01-12'
  },
  {
    id: 'flow-005',
    name: 'Voice Call Route',
    description: 'Voice call routing with regional optimization',
    status: 'draft',
    channels: ['voice'],
    messagesProcessed: 12000,
    successRate: 92.3,
    lastModified: '2024-01-11'
  }
];

const getChannelIcon = (channel: string) => {
  switch (channel.toLowerCase()) {
    case 'sms':
      return <MessageSquare className="h-3 w-3" />;
    case 'email':
      return <MessageSquare className="h-3 w-3" />;
    case 'whatsapp':
      return <MessageSquare className="h-3 w-3" />;
    case 'voice':
      return <MessageSquare className="h-3 w-3" />;
    case 'rcs':
      return <MessageSquare className="h-3 w-3" />;
    default:
      return <MessageSquare className="h-3 w-3" />;
  }
};

const getChannelColor = (channel: string) => {
  switch (channel.toLowerCase()) {
    case 'sms':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'email':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'whatsapp':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
    case 'voice':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'rcs':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'inactive':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

export const RouteAssignmentModal: React.FC<RouteAssignmentModalProps> = ({
  isOpen,
  onClose,
  businessProfileName,
  onAssign,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Filter flows to show only active ones by default, and apply search
  const filteredFlows = mockFlows.filter(flow => {
    const matchesSearch = flow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const isActive = flow.status === 'active';
    return matchesSearch && isActive;
  });

  const handleAssign = async () => {
    if (!selectedRouteId) return;
    
    setIsAssigning(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onAssign(selectedRouteId);
      onClose();
    } catch (error) {
      console.error('Failed to assign route:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedRouteId('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Assign Route Plan to {businessProfileName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search route plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Route Plans List */}
          <div className="max-h-[50vh] overflow-y-auto">
            <RadioGroup value={selectedRouteId} onValueChange={setSelectedRouteId}>
              <div className="space-y-3">
                {filteredFlows.map((flow) => (
                  <div key={flow.id} className="relative">
                    <Label
                      htmlFor={flow.id}
                      className="cursor-pointer block"
                    >
                      <Card className={`transition-all hover:shadow-md ${
                        selectedRouteId === flow.id ? 'ring-2 ring-primary' : ''
                      }`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <RadioGroupItem value={flow.id} id={flow.id} className="mt-1" />
                              <div className="space-y-1">
                                <CardTitle className="text-base">{flow.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">{flow.description}</p>
                              </div>
                            </div>
                            <Badge variant="secondary" className={getStatusColor(flow.status)}>
                              {flow.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{flow.messagesProcessed.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4" />
                                <span>{flow.successRate}%</span>
                              </div>
                              <span>Modified: {flow.lastModified}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {flow.channels.map((channel) => (
                                <Badge
                                  key={channel}
                                  variant="outline"
                                  className={`${getChannelColor(channel)} text-xs`}
                                >
                                  <span className="flex items-center gap-1">
                                    {getChannelIcon(channel)}
                                    {channel.toUpperCase()}
                                  </span>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {filteredFlows.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active route plans found</p>
              <p className="text-sm">Try adjusting your search terms</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedRouteId || isAssigning}
              className="min-w-[120px]"
            >
              {isAssigning ? 'Assigning...' : 'Assign Route Plan'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};