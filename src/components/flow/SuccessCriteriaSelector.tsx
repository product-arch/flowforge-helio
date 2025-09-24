import React, { useState } from 'react';
import { Plus, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SuccessCriteria {
  id: string;
  name: string;
  description: string;
  category: 'delivery' | 'engagement' | 'conversion' | 'custom';
}

interface SuccessCriteriaSelectorProps {
  channelType: 'sms' | 'whatsapp' | 'email' | 'voice' | 'rcs';
  selectedCriteria?: string;
  onCriteriaChange: (criteriaId: string) => void;
}

const SUCCESS_CRITERIA: Record<string, SuccessCriteria[]> = {
  sms: [
    { id: 'delivered', name: 'Message Delivered', description: 'SMS successfully delivered to recipient', category: 'delivery' },
    { id: 'read', name: 'Message Read', description: 'Read receipt received', category: 'engagement' },
    { id: 'clicked', name: 'Link Clicked', description: 'Recipient clicked a link in the message', category: 'engagement' },
    { id: 'replied', name: 'User Replied', description: 'Recipient sent a reply message', category: 'engagement' },
    { id: 'converted', name: 'Goal Conversion', description: 'User completed desired action', category: 'conversion' }
  ],
  whatsapp: [
    { id: 'delivered', name: 'Message Delivered', description: 'WhatsApp message delivered', category: 'delivery' },
    { id: 'read', name: 'Message Read', description: 'Blue ticks received', category: 'engagement' },
    { id: 'replied', name: 'User Replied', description: 'Customer sent a response', category: 'engagement' },
    { id: 'button_clicked', name: 'Button Clicked', description: 'Interactive button clicked', category: 'engagement' },
    { id: 'media_viewed', name: 'Media Viewed', description: 'Image/video/document opened', category: 'engagement' },
    { id: 'order_placed', name: 'Order Placed', description: 'Customer completed purchase', category: 'conversion' }
  ],
  email: [
    { id: 'delivered', name: 'Email Delivered', description: 'Email successfully delivered to inbox', category: 'delivery' },
    { id: 'opened', name: 'Email Opened', description: 'Recipient opened the email', category: 'engagement' },
    { id: 'clicked', name: 'Link Clicked', description: 'Recipient clicked a link', category: 'engagement' },
    { id: 'downloaded', name: 'Attachment Downloaded', description: 'Email attachment was downloaded', category: 'engagement' },
    { id: 'unsubscribed', name: 'Not Unsubscribed', description: 'Recipient did not unsubscribe', category: 'engagement' },
    { id: 'converted', name: 'Goal Conversion', description: 'Completed target action', category: 'conversion' }
  ],
  voice: [
    { id: 'answered', name: 'Call Answered', description: 'Recipient picked up the call', category: 'delivery' },
    { id: 'completed', name: 'Call Completed', description: 'Call duration exceeded minimum threshold', category: 'engagement' },
    { id: 'pressed_key', name: 'Key Pressed', description: 'Recipient pressed a key (IVR)', category: 'engagement' },
    { id: 'spoke_response', name: 'Voice Response', description: 'Recipient provided voice input', category: 'engagement' },
    { id: 'callback_requested', name: 'Callback Requested', description: 'Recipient requested a callback', category: 'engagement' },
    { id: 'action_completed', name: 'Action Completed', description: 'Completed intended action', category: 'conversion' }
  ],
  rcs: [
    { id: 'delivered', name: 'Message Delivered', description: 'RCS message delivered', category: 'delivery' },
    { id: 'read', name: 'Message Read', description: 'Read receipt received', category: 'engagement' },
    { id: 'card_clicked', name: 'Card Clicked', description: 'Rich card was tapped', category: 'engagement' },
    { id: 'carousel_swiped', name: 'Carousel Swiped', description: 'User swiped through carousel', category: 'engagement' },
    { id: 'suggested_reply', name: 'Suggested Reply Used', description: 'User selected suggested reply', category: 'engagement' },
    { id: 'action_performed', name: 'Action Performed', description: 'User completed suggested action', category: 'conversion' }
  ]
};

export const SuccessCriteriaSelector: React.FC<SuccessCriteriaSelectorProps> = ({
  channelType,
  selectedCriteria,
  onCriteriaChange
}) => {
  const [customCriteria, setCustomCriteria] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const criteria = SUCCESS_CRITERIA[channelType] || [];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'delivery': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'engagement': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'conversion': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'custom': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleCustomCriteriaAdd = () => {
    if (customCriteria.trim()) {
      const customId = `custom_${Date.now()}`;
      onCriteriaChange(customId);
      setCustomCriteria('');
      setShowCustomInput(false);
    }
  };

  const groupedCriteria = criteria.reduce((acc, criterion) => {
    if (!acc[criterion.category]) {
      acc[criterion.category] = [];
    }
    acc[criterion.category].push(criterion);
    return acc;
  }, {} as Record<string, SuccessCriteria[]>);

  return (
    <div className="space-y-4">
      {/* Predefined Criteria */}
      <div className="space-y-3">
        {Object.entries(groupedCriteria).map(([category, categoryItems]) => (
          <div key={category}>
            <Label className="text-sm font-medium capitalize mb-2 block">
              {category} Criteria
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {categoryItems.map((criterion) => (
                <Card
                  key={criterion.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-sm ${
                    selectedCriteria === criterion.id
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => onCriteriaChange(criterion.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{criterion.name}</span>
                          {selectedCriteria === criterion.id && (
                            <CheckCircle className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{criterion.description}</p>
                      </div>
                      <Badge variant="secondary" className={`text-xs ${getCategoryColor(criterion.category)}`}>
                        {criterion.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Custom Criteria */}
      <div className="border-t pt-4">
        <Label className="text-sm font-medium mb-2 block">Custom Criteria</Label>
        
        {!showCustomInput ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCustomInput(true)}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Criteria
          </Button>
        ) : (
          <div className="space-y-2">
            <Input
              placeholder="Enter custom success criteria..."
              value={customCriteria}
              onChange={(e) => setCustomCriteria(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCustomCriteriaAdd();
                } else if (e.key === 'Escape') {
                  setShowCustomInput(false);
                  setCustomCriteria('');
                }
              }}
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCustomCriteriaAdd}>
                Add
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomCriteria('');
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Selected Criteria Display */}
      {selectedCriteria && (
        <div className="border-t pt-4">
          <Label className="text-sm font-medium mb-2 block">Selected Success Criteria</Label>
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-sm">
                  {selectedCriteria.startsWith('custom_') 
                    ? 'Custom Criteria' 
                    : criteria.find(c => c.id === selectedCriteria)?.name
                  }
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedCriteria.startsWith('custom_') 
                    ? 'User-defined success condition'
                    : criteria.find(c => c.id === selectedCriteria)?.description
                  }
                </p>
              </div>
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};