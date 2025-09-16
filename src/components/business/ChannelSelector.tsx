import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Hash 
} from 'lucide-react';

const AVAILABLE_CHANNELS = [
  { id: 'sms', label: 'SMS', icon: MessageSquare, color: 'bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20' },
  { id: 'email', label: 'Email', icon: Mail, color: 'bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20' },
  { id: 'voice', label: 'Voice', icon: Phone, color: 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20' },
  { id: 'rcs', label: 'RCS', icon: Hash, color: 'bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20' },
];

interface ChannelSelectorProps {
  value: string[];
  onChange: (channels: string[]) => void;
}

export const ChannelSelector: React.FC<ChannelSelectorProps> = ({
  value,
  onChange,
}) => {
  const toggleChannel = (channelId: string) => {
    const updatedChannels = value.includes(channelId)
      ? value.filter(id => id !== channelId)
      : [...value, channelId];
    onChange(updatedChannels);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Select the channels you want to activate for this business unit
      </p>
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_CHANNELS.map((channel) => {
          const IconComponent = channel.icon;
          const isSelected = value.includes(channel.id);
          
          return (
            <button
              key={channel.id}
              type="button"
              onClick={() => toggleChannel(channel.id)}
              className="transition-all duration-200"
            >
              <Badge 
                variant="outline"
                className={`
                  cursor-pointer select-none transition-all duration-200
                  ${isSelected 
                    ? channel.color + ' ring-2 ring-current/30 shadow-sm' 
                    : 'text-muted-foreground border-muted hover:bg-muted/50'
                  }
                `}
              >
                <IconComponent className="w-3 h-3 mr-1" />
                {channel.label}
              </Badge>
            </button>
          );
        })}
      </div>
      {value.length > 0 && (
        <div className="text-xs text-muted-foreground">
          Selected: {value.length} channel{value.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};