import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Type, 
  Hash, 
  Calendar, 
  ToggleLeft, 
  List, 
  User, 
  MessageSquare, 
  Globe,
  Clock,
  Database
} from 'lucide-react';

interface Field {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'array' | 'object';
  category: string;
  description: string;
  example?: string;
}

interface FieldLibraryProps {
  onFieldSelect: (field: Field) => void;
}

const FIELD_CATEGORIES = [
  {
    name: 'Message Data',
    icon: MessageSquare,
    fields: [
      { id: 'message.content', name: 'Message Content', type: 'text', description: 'The actual message text', example: 'Hello World' },
      { id: 'message.type', name: 'Message Type', type: 'text', description: 'Type of message (sms, email, etc.)', example: 'sms' },
      { id: 'message.priority', name: 'Priority', type: 'number', description: 'Message priority level', example: '5' },
      { id: 'message.length', name: 'Length', type: 'number', description: 'Character count of message', example: '160' },
      { id: 'message.timestamp', name: 'Timestamp', type: 'date', description: 'When message was created', example: '2024-01-15T10:30:00Z' },
      { id: 'message.tags', name: 'Tags', type: 'array', description: 'Message tags/labels', example: '["urgent", "marketing"]' },
    ]
  },
  {
    name: 'User Attributes',
    icon: User,
    fields: [
      { id: 'user.id', name: 'User ID', type: 'text', description: 'Unique user identifier', example: 'user_12345' },
      { id: 'user.email', name: 'Email', type: 'text', description: 'User email address', example: 'user@example.com' },
      { id: 'user.phone', name: 'Phone', type: 'text', description: 'User phone number', example: '+1234567890' },
      { id: 'user.country', name: 'Country', type: 'text', description: 'User country code', example: 'US' },
      { id: 'user.segment', name: 'Segment', type: 'text', description: 'User segment/tier', example: 'premium' },
      { id: 'user.timezone', name: 'Timezone', type: 'text', description: 'User timezone', example: 'America/New_York' },
      { id: 'user.joinDate', name: 'Join Date', type: 'date', description: 'When user joined', example: '2023-06-15' },
      { id: 'user.isActive', name: 'Is Active', type: 'boolean', description: 'User active status', example: 'true' },
      { id: 'user.preferences', name: 'Preferences', type: 'object', description: 'User preferences object', example: '{"notifications": true}' },
    ]
  },
  {
    name: 'System Context',
    icon: Globe,
    fields: [
      { id: 'system.timestamp', name: 'Current Time', type: 'date', description: 'Current system timestamp', example: '2024-01-15T10:30:00Z' },
      { id: 'system.region', name: 'Region', type: 'text', description: 'Current processing region', example: 'us-east-1' },
      { id: 'system.environment', name: 'Environment', type: 'text', description: 'System environment', example: 'production' },
      { id: 'system.version', name: 'Version', type: 'text', description: 'System version', example: '2.1.0' },
      { id: 'flow.id', name: 'Flow ID', type: 'text', description: 'Current flow identifier', example: 'flow_abc123' },
      { id: 'flow.step', name: 'Flow Step', type: 'number', description: 'Current step in flow', example: '3' },
    ]
  },
  {
    name: 'Time & Schedule',
    icon: Clock,
    fields: [
      { id: 'time.hour', name: 'Hour', type: 'number', description: 'Current hour (0-23)', example: '14' },
      { id: 'time.day', name: 'Day of Week', type: 'number', description: 'Day of week (1-7)', example: '1' },
      { id: 'time.dayName', name: 'Day Name', type: 'text', description: 'Day name', example: 'Monday' },
      { id: 'time.isWeekend', name: 'Is Weekend', type: 'boolean', description: 'Is current day weekend', example: 'false' },
      { id: 'time.isBusinessHours', name: 'Business Hours', type: 'boolean', description: 'Is within business hours', example: 'true' },
    ]
  },
  {
    name: 'Custom Variables',
    icon: Database,
    fields: [
      { id: 'custom.campaignId', name: 'Campaign ID', type: 'text', description: 'Marketing campaign identifier', example: 'camp_2024_q1' },
      { id: 'custom.cost', name: 'Cost', type: 'number', description: 'Message cost estimate', example: '0.05' },
      { id: 'custom.retryCount', name: 'Retry Count', type: 'number', description: 'Number of retry attempts', example: '2' },
      { id: 'custom.metadata', name: 'Metadata', type: 'object', description: 'Custom metadata object', example: '{"source": "api"}' },
    ]
  }
];

export const FieldLibrary: React.FC<FieldLibraryProps> = ({ onFieldSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return Type;
      case 'number': return Hash;
      case 'date': return Calendar;
      case 'boolean': return ToggleLeft;
      case 'array': return List;
      case 'object': return Database;
      default: return Type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'text': return 'text-blue-600';
      case 'number': return 'text-green-600';
      case 'date': return 'text-purple-600';
      case 'boolean': return 'text-orange-600';
      case 'array': return 'text-pink-600';
      case 'object': return 'text-cyan-600';
      default: return 'text-gray-600';
    }
  };

  const filteredCategories = FIELD_CATEGORIES.map(category => ({
    ...category,
    fields: category.fields.filter(field =>
      field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => 
    category.fields.length > 0 && 
    (!selectedCategory || category.name === selectedCategory)
  );

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search fields..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
          >
            All Categories
          </Button>
          {FIELD_CATEGORIES.map(category => (
            <Button
              key={category.name}
              size="sm"
              variant={selectedCategory === category.name ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.name)}
            >
              <category.icon className="w-3 h-3 mr-1" />
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Fields */}
      <ScrollArea className="flex-1">
        <div className="space-y-4">
          {filteredCategories.map(category => (
            <Card key={category.name}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <category.icon className="w-4 h-4" />
                  {category.name}
                  <Badge variant="secondary" className="text-xs">
                    {category.fields.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {category.fields.map(field => {
                  const TypeIcon = getTypeIcon(field.type);
                  return (
                    <div
                      key={field.id}
                      className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => onFieldSelect({ ...field, category: category.name } as Field)}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/field', JSON.stringify(field));
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <TypeIcon className={`w-3 h-3 ${getTypeColor(field.type)}`} />
                            <span className="text-sm font-medium truncate">{field.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {field.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">{field.description}</p>
                          <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">
                            {field.id}
                          </code>
                          {field.example && (
                            <p className="text-xs text-muted-foreground mt-1">
                              <span className="font-medium">Example:</span> {field.example}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};