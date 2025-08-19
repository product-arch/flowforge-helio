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
  // Core Flow Nodes
  {
    id: 'start',
    label: 'Start',
    icon: Play,
    color: 'text-node-start',
    description: 'Entry point with channel and app metadata',
    category: 'Core',
  },
  {
    id: 'terminal',
    label: 'Terminal',
    icon: Square,
    color: 'text-node-terminal-success',
    description: 'Final state endpoint (sent, dropped, etc.)',
    category: 'Core',
  },

  // Routing Atomic Blocks
  {
    id: 'leastcost',
    label: 'Least Cost Routing',
    icon: DollarSign,
    color: 'text-node-routing',
    description: 'Route messages via cheapest available path',
    category: 'Routing',
  },
  {
    id: 'weightedsplit',
    label: 'Weighted Split',
    icon: Percent,
    color: 'text-node-routing',
    description: 'Distribute traffic based on custom weights',
    category: 'Routing',
  },
  {
    id: 'fallback',
    label: 'Fallback',
    icon: RotateCcw,
    color: 'text-node-routing',
    description: 'Secondary route when primary fails',
    category: 'Routing',
  },
  {
    id: 'priorityroute',
    label: 'Priority Route',
    icon: ArrowUpDown,
    color: 'text-node-routing',
    description: 'Route by vendor priority order',
    category: 'Routing',
  },
  {
    id: 'spillover',
    label: 'Spillover',
    icon: Layers,
    color: 'text-node-routing',
    description: 'Overflow to next vendor when capacity reached',
    category: 'Routing',
  },

  // Channel Nodes
  {
    id: 'sms',
    label: 'SMS',
    icon: MessageSquare,
    color: 'text-node-sms',
    description: 'SMS channel with sender ID and template config',
    category: 'Channels',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageCircle,
    color: 'text-node-whatsapp',
    description: 'WhatsApp channel with business ID config',
    category: 'Channels',
  },
  {
    id: 'email',
    label: 'Email',
    icon: Mail,
    color: 'text-node-email',
    description: 'Email channel with sender and template config',
    category: 'Channels',
  },
  {
    id: 'voice',
    label: 'Voice',
    icon: Phone,
    color: 'text-node-voice',
    description: 'Voice channel with caller ID config',
    category: 'Channels',
  },
  {
    id: 'rcs',
    label: 'RCS',
    icon: Radio,
    color: 'text-node-rcs',
    description: 'RCS messaging with bot configuration',
    category: 'Channels',
  },

  // Control Blocks
  {
    id: 'converge',
    label: 'Converge',
    icon: Split,
    color: 'text-node-control',
    description: 'Merge multiple paths into one',
    category: 'Controls',
  },
  {
    id: 'diverge',
    label: 'Diverge',
    icon: Route,
    color: 'text-node-control',
    description: 'Split single path into multiple routes',
    category: 'Controls',
  },
  {
    id: 'timer',
    label: 'Timer',
    icon: Clock,
    color: 'text-node-control',
    description: 'Time-based flow control and delays',
    category: 'Controls',
  },
  {
    id: 'doevent',
    label: 'Do Event',
    icon: Zap,
    color: 'text-node-control',
    description: 'Trigger custom actions or events',
    category: 'Controls',
  },

  // Logic Blocks
  {
    id: 'conditional',
    label: 'If-Else',
    icon: GitMerge,
    color: 'text-node-conditional',
    description: 'Conditional routing based on criteria',
    category: 'Logic',
  },
  {
    id: 'switch',
    label: 'Switch',
    icon: Shuffle,
    color: 'text-node-switch',
    description: 'Multi-condition branching logic',
    category: 'Logic',
  },
  {
    id: 'filter',
    label: 'Filter',
    icon: Filter,
    color: 'text-node-filter',
    description: 'Filter messages by properties',
    category: 'Logic',
  },

  // Constraint Blocks
  {
    id: 'tpslimit',
    label: 'TPS Limit',
    icon: Gauge,
    color: 'text-node-constraint',
    description: 'Transactions per second limitation',
    category: 'Constraints',
  },
  {
    id: 'costcap',
    label: 'Cost Cap',
    icon: DollarSign,
    color: 'text-node-constraint',
    description: 'Maximum cost per message limit',
    category: 'Constraints',
  },
  {
    id: 'timewindow',
    label: 'Time Window',
    icon: Calendar,
    color: 'text-node-constraint',
    description: 'Active hours and timezone restrictions',
    category: 'Constraints',
  },
  {
    id: 'geofence',
    label: 'Geo Fence',
    icon: MapPin,
    color: 'text-node-constraint',
    description: 'Geographic routing restrictions',
    category: 'Constraints',
  },

  // Vendor Blocks
  {
    id: 'vendor',
    label: 'Vendor',
    icon: Target,
    color: 'text-node-vendor',
    description: 'Specific vendor configuration',
    category: 'Vendors',
  },
  {
    id: 'loadbalancer',
    label: 'Load Balancer',
    icon: Users,
    color: 'text-node-loadbalancer',
    description: 'Distribute load across multiple vendors',
    category: 'Vendors',
  },
  {
    id: 'healthcheck',
    label: 'Health Check',
    icon: Check,
    color: 'text-node-vendor',
    description: 'Monitor vendor availability and status',
    category: 'Vendors',
  },

  // Monitoring Blocks
  {
    id: 'audit',
    label: 'Audit',
    icon: Bug,
    color: 'text-node-audit',
    description: 'Debug and logging checkpoint',
    category: 'Monitoring',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    color: 'text-node-analytics',
    description: 'Collect metrics and performance data',
    category: 'Monitoring',
  },
  {
    id: 'alert',
    label: 'Alert',
    icon: AlertTriangle,
    color: 'text-node-alert',
    description: 'Send alerts and notifications',
    category: 'Monitoring',
  },

  // Integration Blocks
  {
    id: 'webhook',
    label: 'Webhook',
    icon: Webhook,
    color: 'text-node-webhook',
    description: 'Send data to external systems',
    category: 'Integration',
  },
  {
    id: 'database',
    label: 'Database',
    icon: Database,
    color: 'text-node-database',
    description: 'Store or retrieve data',
    category: 'Integration',
  },
  {
    id: 'transform',
    label: 'Transform',
    icon: Settings,
    color: 'text-node-transform',
    description: 'Transform message data and format',
    category: 'Integration',
  },
  {
    id: 'api',
    label: 'API Call',
    icon: Network,
    color: 'text-node-api',
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
          {nodeTypes.slice(0, 4).map((node) => (
            <TooltipProvider key={node.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    draggable
                    onDragStart={(e) => onDragStart(e, node.id)}
                    className="w-8 h-8 bg-accent/50 border border-border rounded-md flex items-center justify-center cursor-move hover:bg-accent transition-colors"
                  >
                    <node.icon className={`w-4 h-4 ${node.color}`} />
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
              <div className="space-y-2">
                {filteredNodes
                  .filter(node => favorites.has(node.id))
                  .map((node) => (
                    <NodeCard 
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
                      {categoryNodes.map((node) => (
                        <NodeCard
                          key={node.id}
                          node={node}
                          isFavorite={favorites.has(node.id)}
                          onToggleFavorite={toggleFavorite}
                          onDragStart={onDragStart}
                        />
                      ))}
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

interface NodeCardProps {
  node: NodeType;
  isFavorite: boolean;
  onToggleFavorite: (nodeId: string) => void;
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

const NodeCard: React.FC<NodeCardProps> = ({ 
  node, 
  isFavorite, 
  onToggleFavorite, 
  onDragStart 
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          draggable
          onDragStart={(e) => onDragStart(e, node.id)}
          className="group relative p-3 bg-accent/30 hover:bg-accent/50 border border-border rounded-lg cursor-move transition-all duration-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-md bg-background/50`}>
                <node.icon className={`w-4 h-4 ${node.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{node.label}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {node.description}
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(node.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
            >
              <Star className={`w-3 h-3 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </Button>
          </div>
          
          <Badge variant="secondary" className="mt-2 text-xs">
            {node.category}
          </Badge>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right">
        <div className="max-w-xs">
          <div className="font-medium">{node.label}</div>
          <div className="text-sm text-muted-foreground mt-1">
            {node.description}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Drag to canvas to add
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};