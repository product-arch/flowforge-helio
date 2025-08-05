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
  ChevronRight as ChevronRightIcon
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
  {
    id: 'start',
    label: 'Start Node',
    icon: Play,
    color: 'text-node-start',
    description: 'Entry point with channel and app metadata',
    category: 'Core',
  },
  {
    id: 'routing',
    label: 'Routing Node',
    icon: GitBranch,
    color: 'text-node-routing',
    description: 'Main routing logic with vendor selection',
    category: 'Core',
  },
  {
    id: 'constraint',
    label: 'Constraint Node',
    icon: Shield,
    color: 'text-node-constraint',
    description: 'TPS, cost, and time-based limits',
    category: 'Control',
  },
  {
    id: 'conditional',
    label: 'Conditional Node',
    icon: GitMerge,
    color: 'text-node-conditional',
    description: 'If-else logic for dynamic routing',
    category: 'Logic',
  },
  {
    id: 'terminal',
    label: 'Terminal Node',
    icon: Square,
    color: 'text-node-terminal-success',
    description: 'Final state endpoint (sent, dropped, etc.)',
    category: 'Core',
  },
  {
    id: 'audit',
    label: 'Audit Node',
    icon: Bug,
    color: 'text-node-audit',
    description: 'Debug and logging checkpoint',
    category: 'Debug',
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