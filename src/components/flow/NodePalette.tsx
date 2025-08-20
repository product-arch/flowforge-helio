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
  Radio
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
  // Routing Atomic Blocks
  {
    id: 'leastcost',
    label: 'Least Cost Routing',
    icon: DollarSign,
    color: 'text-primary',
    description: 'Route messages via cheapest available path',
    category: 'Routing',
  },
  {
    id: 'weightedsplit',
    label: 'Weighted Split',
    icon: Percent,
    color: 'text-primary',
    description: 'Distribute traffic based on custom weights',
    category: 'Routing',
  },
  {
    id: 'fallback',
    label: 'Fallback',
    icon: RotateCcw,
    color: 'text-primary',
    description: 'Secondary route when primary fails',
    category: 'Routing',
  },
  {
    id: 'priorityroute',
    label: 'Priority Route',
    icon: ArrowUpDown,
    color: 'text-primary',
    description: 'Route by vendor priority order',
    category: 'Routing',
  },
  {
    id: 'spillover',
    label: 'Spillover',
    icon: Layers,
    color: 'text-primary',
    description: 'Overflow to next vendor when capacity reached',
    category: 'Routing',
  },

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

  // Control Blocks
  {
    id: 'converge',
    label: 'Converge',
    icon: Split,
    color: 'text-primary',
    description: 'Merge multiple paths into one',
    category: 'Controls',
  },
  {
    id: 'diverge',
    label: 'Diverge',
    icon: Route,
    color: 'text-primary',
    description: 'Split single path into multiple routes',
    category: 'Controls',
  },
  {
    id: 'timer',
    label: 'Timer',
    icon: Clock,
    color: 'text-primary',
    description: 'Time-based flow control and delays',
    category: 'Controls',
  },
  {
    id: 'doevent',
    label: 'Do Event',
    icon: Zap,
    color: 'text-primary',
    description: 'Trigger custom actions or events',
    category: 'Controls',
  },

  // Logic Blocks
  {
    id: 'conditional',
    label: 'If-Else',
    icon: GitMerge,
    color: 'text-primary',
    description: 'Conditional routing based on criteria',
    category: 'Logic',
  },
  {
    id: 'switch',
    label: 'Switch',
    icon: Shuffle,
    color: 'text-primary',
    description: 'Multi-condition branching logic',
    category: 'Logic',
  },
  {
    id: 'filter',
    label: 'Filter',
    icon: Filter,
    color: 'text-primary',
    description: 'Filter messages by properties',
    category: 'Logic',
  },

  // Constraint Blocks
  {
    id: 'tpslimit',
    label: 'TPS Limit',
    icon: Gauge,
    color: 'text-primary',
    description: 'Transactions per second limitation',
    category: 'Constraints',
  },
  {
    id: 'costcap',
    label: 'Cost Cap',
    icon: DollarSign,
    color: 'text-primary',
    description: 'Maximum cost per message limit',
    category: 'Constraints',
  },
  {
    id: 'timewindow',
    label: 'Time Window',
    icon: Calendar,
    color: 'text-primary',
    description: 'Active hours and timezone restrictions',
    category: 'Constraints',
  },
  {
    id: 'geofence',
    label: 'Geo Fence',
    icon: MapPin,
    color: 'text-primary',
    description: 'Geographic routing restrictions',
    category: 'Constraints',
  },


  // Monitoring Blocks
  {
    id: 'audit',
    label: 'Audit',
    icon: Bug,
    color: 'text-primary',
    description: 'Debug and logging checkpoint',
    category: 'Monitoring',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    color: 'text-primary',
    description: 'Collect metrics and performance data',
    category: 'Monitoring',
  },
  {
    id: 'alert',
    label: 'Alert',
    icon: AlertTriangle,
    color: 'text-primary',
    description: 'Send alerts and notifications',
    category: 'Monitoring',
  },

  // Integration Blocks
  {
    id: 'webhook',
    label: 'Webhook',
    icon: Webhook,
    color: 'text-primary',
    description: 'Send data to external systems',
    category: 'Integration',
  },
  {
    id: 'database',
    label: 'Database',
    icon: Database,
    color: 'text-primary',
    description: 'Store or retrieve data',
    category: 'Integration',
  },
  {
    id: 'transform',
    label: 'Transform',
    icon: Settings,
    color: 'text-primary',
    description: 'Transform message data and format',
    category: 'Integration',
  },
  {
    id: 'api',
    label: 'API Call',
    icon: Network,
    color: 'text-primary',
    description: 'Make external API requests',
    category: 'Integration',
  },
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