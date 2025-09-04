import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  ChevronDown, 
  ChevronRight,
  Play, 
  GitBranch, 
  Shield, 
  GitMerge, 
  Square, 
  Bug,
  Star,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Database,
  Filter,
  Clock,
  MessageSquare,
  Shuffle,
  Users,
  Target,
  Zap,
  AlertTriangle,
  Settings,
  Webhook,
  Timer,
  BarChart3,
  Phone,
  Mail,
  MessageCircle,
  DollarSign,
  Percent,
  ArrowUpDown,
  Layers,
  RotateCcw,
  Split,
  Route,
  TrendingDown,
  Plus,
  Minus,
  X,
  Check,
  Calendar,
  MapPin,
  Gauge,
  Network,
  Radio,
  Activity,
  TrendingUp
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NodeType {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  category: string;
  favorite?: boolean;
}

const nodeTypes: NodeType[] = [
  // Channel Nodes
  {
    id: 'sms',
    label: 'SMS',
    icon: MessageSquare,
    color: 'text-primary',
    description: 'SMS channel with sender ID and template config',
    category: 'Channels',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageCircle,
    color: 'text-primary',
    description: 'WhatsApp channel with business ID config',
    category: 'Channels',
  },
  {
    id: 'email',
    label: 'Email',
    icon: Mail,
    color: 'text-primary',
    description: 'Email channel with sender and template config',
    category: 'Channels',
  },
  {
    id: 'voice',
    label: 'Voice',
    icon: Phone,
    color: 'text-primary',
    description: 'Voice channel with caller ID config',
    category: 'Channels',
  },
  {
    id: 'rcs',
    label: 'RCS',
    icon: Radio,
    color: 'text-primary',
    description: 'RCS messaging with bot configuration',
    category: 'Channels',
  },

  // Control Logic Blocks
  {
    id: 'converge',
    label: 'Converge',
    icon: Split,
    color: 'text-primary',
    description: 'Merge multiple paths into one',
    category: 'Control Logic',
  },
  {
    id: 'diverge',
    label: 'Diverge',
    icon: Route,
    color: 'text-primary',
    description: 'Split single path into multiple routes',
    category: 'Control Logic',
  },
  {
    id: 'timer',
    label: 'Timer',
    icon: Clock,
    color: 'text-primary',
    description: 'Time-based flow control and delays',
    category: 'Control Logic',
  },
  {
    id: 'doevent',
    label: 'Do Event',
    icon: Zap,
    color: 'text-primary',
    description: 'Trigger custom actions or events',
    category: 'Control Logic',
  },
  {
    id: 'conditional',
    label: 'If-Else',
    icon: GitMerge,
    color: 'text-primary',
    description: 'Conditional routing based on criteria',
    category: 'Control Logic',
  },
  {
    id: 'switch',
    label: 'Switch',
    icon: Shuffle,
    color: 'text-primary',
    description: 'Multi-condition branching logic',
    category: 'Control Logic',
  },
  {
    id: 'filter',
    label: 'Filter',
    icon: Filter,
    color: 'text-primary',
    description: 'Filter messages by properties',
    category: 'Control Logic',
  },
  {
    id: 'fallback',
    label: 'Fallback',
    icon: RotateCcw,
    color: 'text-primary',
    description: 'Switch to backup vendor when primary fails',
    category: 'Control Logic',
  },
  
  // Routing Strategies Nodes
  {
    id: 'priority-route',
    label: 'Priority Routing',
    icon: ArrowUpDown,
    color: 'rgb(239, 68, 68)',
    description: 'Route based on vendor priority',
    category: 'Routing Strategies'
  },
  {
    id: 'round-robin',
    label: 'Round Robin',
    icon: RotateCcw,
    color: 'rgb(34, 197, 94)',
    description: 'Distribute traffic evenly',
    category: 'Routing Strategies'
  },
  {
    id: 'least-cost',
    label: 'Least Cost',
    icon: DollarSign,
    color: 'rgb(234, 179, 8)',
    description: 'Route to lowest cost vendor',
    category: 'Routing Strategies'
  },
  {
    id: 'load-balancer',
    label: 'Load Balancer',
    icon: Gauge,
    color: 'rgb(59, 130, 246)',
    description: 'Balance load across vendors',
    category: 'Routing Strategies'
  },
  {
    id: 'geolocation',
    label: 'Geolocation Routing',
    icon: MapPin,
    color: 'rgb(249, 115, 22)',
    description: 'Route based on user location',
    category: 'Routing Strategies'
  },
  {
    id: 'failover',
    label: 'Failover',
    icon: Shield,
    color: 'rgb(168, 85, 247)',
    description: 'Automatic failover routing',
    category: 'Routing Strategies'
  },
  {
    id: 'weighted-distribution',
    label: 'Weighted Distribution',
    icon: BarChart3,
    color: 'rgb(236, 72, 153)',
    description: 'Distribute based on weights',
    category: 'Routing Strategies'
  }
];

export const NodePalette: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(new Set(['Core']));
  const [favorites, setFavorites] = useState(new Set<string>());
  const [collapsed, setCollapsed] = useState(false);

  const filteredNodes = nodeTypes.filter(node =>
    node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(filteredNodes.map(node => node.category)));

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleFavorite = (nodeId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(nodeId)) {
      newFavorites.delete(nodeId);
    } else {
      newFavorites.add(nodeId);
    }
    setFavorites(newFavorites);
  };

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  if (collapsed) {
    return (
      <div className="w-12 bg-card border-r border-border flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(false)}
          className="mb-4"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
        <div className="space-y-2">
          {nodeTypes.slice(0, 6).map((node) => (
            <TooltipProvider key={node.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    draggable
                    onDragStart={(e) => onDragStart(e, node.id)}
                    className="w-8 h-8 bg-card border border-border rounded-lg flex items-center justify-center cursor-move hover:bg-accent/50 transition-colors shadow-sm"
                  >
                    <node.icon className={`w-4 h-4 text-primary`} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div className="text-sm font-medium">{node.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{node.description}</div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="w-80 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Node Palette</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(true)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {favorites.size > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                <Star className="w-4 h-4 mr-1" />
                Favorites
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {filteredNodes
                  .filter(node => favorites.has(node.id))
                  .map((node) => (
                    <NodeChip 
                      key={`fav-${node.id}`}
                      node={node} 
                      isFavorite={true}
                      onToggleFavorite={toggleFavorite}
                      onDragStart={onDragStart}
                    />
                  ))}
              </div>
            </div>
          )}

          {categories.map((category) => {
            const categoryNodes = filteredNodes.filter(node => node.category === category);
            return (
              <div key={category}>
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground mb-2"
                >
                  <span>{category}</span>
                  {expandedCategories.has(category) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedCategories.has(category) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <div className="grid grid-cols-3 gap-2">
                        {categoryNodes.map((node) => (
                          <NodeChip
                            key={node.id}
                            node={node}
                            isFavorite={favorites.has(node.id)}
                            onToggleFavorite={toggleFavorite}
                            onDragStart={onDragStart}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};

interface NodeChipProps {
  node: NodeType;
  isFavorite: boolean;
  onToggleFavorite: (nodeId: string) => void;
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

const NodeChip: React.FC<NodeChipProps> = ({ 
  node, 
  isFavorite, 
  onToggleFavorite, 
  onDragStart 
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            draggable
            onDragStart={(e) => onDragStart(e, node.id)}
            className="group relative bg-card border border-border rounded-lg p-3 cursor-move hover:border-primary/50 hover:shadow-md transition-all duration-200 aspect-square flex flex-col items-center justify-center"
          >
            <div className="relative">
              <div className="p-2 rounded-lg bg-primary/10 mb-2">
                <node.icon className="w-5 h-5 text-primary" />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(node.id);
                }}
                className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-full p-1"
              >
                <Star 
                  className={`w-3 h-3 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                />
              </button>
            </div>
            <div className="text-center">
              <h4 className="font-medium text-xs truncate max-w-full">{node.label}</h4>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm max-w-xs">
            <div className="font-medium">{node.label}</div>
            <div className="text-muted-foreground mt-1">{node.description}</div>
            <Badge variant="secondary" className="text-xs mt-2">
              {node.category}
            </Badge>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};