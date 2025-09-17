import React, { useState, useMemo } from 'react';
import { 
  Paintbrush, X, Search, Star, ChevronDown, ChevronRight,
  MessageSquare, Send, Mail, Phone, Video, GitBranch, RotateCcw,
  Shuffle, Filter, RefreshCw, Timer, Play, TrendingUp,
  DollarSign, Activity, MapPin, Shield, BarChart3
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NodeType {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  category: string;
  favorite?: boolean;
}

const nodeTypes: NodeType[] = [
  // Channels
  { id: 'sms', label: 'SMS', icon: MessageSquare, color: 'text-blue-500', description: 'Send SMS messages to users', category: 'Channels' },
  { id: 'whatsapp', label: 'WhatsApp', icon: Send, color: 'text-green-500', description: 'Send WhatsApp messages', category: 'Channels' },
  { id: 'email', label: 'Email', icon: Mail, color: 'text-purple-500', description: 'Send email messages', category: 'Channels' },
  { id: 'voice', label: 'Voice', icon: Phone, color: 'text-orange-500', description: 'Make voice calls', category: 'Channels' },
  { id: 'rcs', label: 'RCS', icon: Video, color: 'text-indigo-500', description: 'Send RCS messages', category: 'Channels' },
  
  // Controls
  { id: 'decisions', label: 'Decisions', icon: GitBranch, color: 'text-purple-500', description: 'Advanced conditional logic, switching & filtering with query builder', category: 'Control Logic' },
  { id: 'pathmix', label: 'Path Mix', icon: Shuffle, color: 'text-pink-500', description: 'Diverge, converge, or both - flexible path mixing', category: 'Control Logic' },
  
  // Logic
  { id: 'transform', label: 'Transform', icon: RefreshCw, color: 'text-violet-500', description: 'Transform message data', category: 'Control Logic' },
  { id: 'timer', label: 'Timer', icon: Timer, color: 'text-slate-500', description: 'Delays, schedules, countdowns and timers', category: 'Control Logic' },
  { id: 'doevent', label: 'Do Event', icon: Play, color: 'text-lime-500', description: 'Execute custom events', category: 'Control Logic' },
  { id: 'fallback', label: 'Fallback', icon: RotateCcw, color: 'text-primary', description: 'Switch to backup vendor when primary fails', category: 'Control Logic' },
  
  // Routing Strategies
  { id: 'priority-route', label: 'Priority Routing', icon: TrendingUp, color: 'text-red-500', description: 'Route based on vendor priority', category: 'Routing Strategies' },
  { id: 'round-robin', label: 'Round Robin', icon: RotateCcw, color: 'text-green-500', description: 'Distribute traffic evenly in rotation', category: 'Routing Strategies' },
  { id: 'least-cost', label: 'Least Cost', icon: DollarSign, color: 'text-yellow-500', description: 'Route to lowest cost vendor', category: 'Routing Strategies' },
  { id: 'load-balancer', label: 'Load Balancer', icon: Activity, color: 'text-blue-500', description: 'Balance load across vendors', category: 'Routing Strategies' },
  { id: 'geolocation', label: 'Geolocation Routing', icon: MapPin, color: 'text-orange-500', description: 'Route based on user location', category: 'Routing Strategies' },
  { id: 'failover', label: 'Failover', icon: Shield, color: 'text-purple-500', description: 'Automatic failover routing', category: 'Routing Strategies' },
  { id: 'weighted-distribution', label: 'Weighted Distribution', icon: BarChart3, color: 'text-pink-500', description: 'Distribute based on weights', category: 'Routing Strategies' },
];

export const FloatingNodePalette: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    Channels: true,
    'Control Logic': false,
    'Routing Strategies': false,
  });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filteredNodes = useMemo(() => {
    return nodeTypes.filter(node => 
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase())
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

  const toggleFavorite = (nodeId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(nodeId)) {
        newFavorites.delete(nodeId);
      } else {
        newFavorites.add(nodeId);
      }
      return newFavorites;
    });
  };

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="absolute top-4 left-4 z-50">
      {!isExpanded ? (
        // Floating Button
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsExpanded(true)}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 border border-primary/30 shadow-[0_0_20px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)] transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                variant="ghost"
              >
                <Paintbrush className="w-5 h-5 text-primary-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-card border border-border">
              <p>Open Node Palette</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        // Expanded Palette
        <Card className="w-80 h-[80vh] bg-card/95 backdrop-blur-sm border-border/50 shadow-2xl animate-in slide-in-from-left-5 duration-300 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Paintbrush className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Node Palette</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="w-8 h-8 p-0 hover:bg-muted/50 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-border/50 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search nodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/50"
              />
            </div>
          </div>

          {/* Categories and Nodes - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {/* Favorites Section */}
            {favorites.size > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3 p-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Favorites
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 p-2">
                  {nodeTypes
                    .filter(node => favorites.has(node.id))
                    .map((node) => (
                      <NodeChip
                        key={`fav-${node.id}`}
                        node={node}
                        isFavorite={true}
                        onToggleFavorite={() => toggleFavorite(node.id)}
                        onDragStart={onDragStart}
                      />
                    ))}
                </div>
              </div>
            )}

            {categories.map(([category, nodes]) => (
              <Collapsible
                key={category}
                open={expandedCategories[category]}
                onOpenChange={() => toggleCategory(category)}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full text-left hover:bg-muted/30 rounded-md p-2 transition-colors">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {category}
                  </span>
                  {expandedCategories[category] ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </CollapsibleTrigger>

                <CollapsibleContent className="grid grid-cols-3 gap-2 mt-2 p-2">
                  {nodes.map((node) => (
                    <NodeChip
                      key={node.id}
                      node={node}
                      isFavorite={favorites.has(node.id)}
                      onToggleFavorite={() => toggleFavorite(node.id)}
                      onDragStart={onDragStart}
                    />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

interface NodeChipProps {
  node: NodeType;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

const NodeChip: React.FC<NodeChipProps> = ({
  node,
  isFavorite,
  onToggleFavorite,
  onDragStart,
}) => {
  const IconComponent = node.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            draggable
            onDragStart={(e) => onDragStart(e, node.id)}
            className="group relative flex flex-col items-center justify-center p-2 aspect-square rounded-xl bg-background/50 border border-border/50 cursor-grab active:cursor-grabbing hover:bg-muted/50 hover:border-border transition-all duration-200 hover:shadow-md"
          >
            <div className={`${node.color} mb-1`}>
              <IconComponent className="w-4 h-4" />
            </div>
            <p className="text-[10px] font-medium text-foreground text-center leading-tight">
              {node.label}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 p-0 hover:bg-muted/50 rounded-full"
            >
              <Star
                className={`w-3 h-3 ${
                  isFavorite
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                }`}
              />
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-card border border-border max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">{node.label}</p>
            <p className="text-sm text-muted-foreground">{node.description}</p>
            <p className="text-xs text-muted-foreground">Category: {node.category}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};