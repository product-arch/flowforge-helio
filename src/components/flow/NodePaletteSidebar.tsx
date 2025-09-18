import React, { useState, useMemo } from 'react';
import { 
  Search, ChevronDown, ChevronRight,
  MessageSquare, Send, Mail, Phone, Video, GitBranch, 
  Shuffle, Filter, RefreshCw, Timer, Play, TrendingUp,
  DollarSign, Activity, MapPin, Shield, BarChart3, RotateCcw
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface NodeType {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  category: string;
}

const nodeTypes: NodeType[] = [
  // Audience
  { id: 'start', label: 'Audience', icon: Play, color: 'text-green-600', category: 'Audience' },
  
  // Split Flow
  { id: 'decisions', label: 'Decisions', icon: GitBranch, color: 'text-purple-600', category: 'Split Flow' },
  { id: 'pathmix', label: 'Path Mix', icon: Shuffle, color: 'text-pink-600', category: 'Split Flow' },
  { id: 'filter', label: 'Filter', icon: Filter, color: 'text-blue-600', category: 'Split Flow' },
  
  // Channels
  { id: 'sms', label: 'SMS', icon: MessageSquare, color: 'text-blue-600', category: 'Channels' },
  { id: 'whatsapp', label: 'WhatsApp', icon: Send, color: 'text-green-600', category: 'Channels' },
  { id: 'email', label: 'Email', icon: Mail, color: 'text-purple-600', category: 'Channels' },
  { id: 'voice', label: 'Voice', icon: Phone, color: 'text-orange-600', category: 'Channels' },
  { id: 'rcs', label: 'RCS', icon: Video, color: 'text-indigo-600', category: 'Channels' },
  
  // Routing
  { id: 'priority-route', label: 'Priority', icon: TrendingUp, color: 'text-red-600', category: 'Routing' },
  { id: 'round-robin', label: 'Round Robin', icon: RotateCcw, color: 'text-green-600', category: 'Routing' },
  { id: 'least-cost', label: 'Least Cost', icon: DollarSign, color: 'text-yellow-600', category: 'Routing' },
  { id: 'load-balancer', label: 'Load Balancer', icon: Activity, color: 'text-blue-600', category: 'Routing' },
  { id: 'geolocation', label: 'Geolocation', icon: MapPin, color: 'text-orange-600', category: 'Routing' },
  { id: 'failover', label: 'Failover', icon: Shield, color: 'text-purple-600', category: 'Routing' },
  { id: 'weighted-distribution', label: 'Weighted', icon: BarChart3, color: 'text-pink-600', category: 'Routing' },
  
  // Logic
  { id: 'transform', label: 'Transform', icon: RefreshCw, color: 'text-violet-600', category: 'Logic' },
  { id: 'timer', label: 'Timer', icon: Timer, color: 'text-slate-600', category: 'Logic' },
];

interface NodePaletteSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const NodePaletteSidebar: React.FC<NodePaletteSidebarProps> = ({
  isOpen,
  onToggle
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Audience': true,
    'Split Flow': true,
    'Channels': true,
    'Routing': false,
    'Logic': false,
  });

  const filteredNodes = useMemo(() => {
    return nodeTypes.filter(node => 
      node.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const categories = useMemo(() => {
    const categoryMap = new Map<string, NodeType[]>();
    filteredNodes.forEach(node => {
      if (!categoryMap.has(node.category)) {
        categoryMap.set(node.category, []);
      }
      categoryMap.get(node.category)!.push(node);
    });
    return Array.from(categoryMap.entries());
  }, [filteredNodes]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-50 bg-card border shadow-md"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-64 h-full bg-card border-r border-border z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="text-sm font-medium text-foreground">Add Nodes</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-6 h-6 p-0"
        >
          <ChevronDown className="w-3 h-3 rotate-90" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3 h-3" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-7 h-8 text-xs"
          />
        </div>
      </div>

      {/* Categories */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          {categories.map(([category, nodes]) => (
            <Collapsible
              key={category}
              open={expandedCategories[category]}
              onOpenChange={() => toggleCategory(category)}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full text-left hover:bg-muted/50 rounded p-1.5 transition-colors">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {category}
                </span>
                {expandedCategories[category] ? (
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                )}
              </CollapsibleTrigger>

              <CollapsibleContent className="space-y-1 mt-1 pl-2">
                {nodes.map((node) => (
                  <NodeChip
                    key={node.id}
                    node={node}
                    onDragStart={onDragStart}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

interface NodeChipProps {
  node: NodeType;
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

const NodeChip: React.FC<NodeChipProps> = ({ node, onDragStart }) => {
  const IconComponent = node.icon;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, node.id)}
      className="flex items-center gap-2 p-2 rounded cursor-grab active:cursor-grabbing hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
    >
      <div className={cn("flex-shrink-0", node.color)}>
        <IconComponent className="w-3 h-3" />
      </div>
      <span className="text-xs font-medium text-foreground truncate">
        {node.label}
      </span>
    </div>
  );
};