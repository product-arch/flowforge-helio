import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitBranch, Trash2, Settings, Filter, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFlow } from '@/contexts/FlowContext';
import { handleClasses } from '@/styles/nodeClasses';

interface DecisionNodeData {
  mode?: 'conditional' | 'switch' | 'filter';
  conditions?: any[];
  cases?: any[];
  criteria?: any[];
  operator?: 'AND' | 'OR';
  action?: string;
  onConfigClick?: (nodeId: string) => void;
}

export const DecisionsNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode } = useFlow();
  const nodeData = data as DecisionNodeData;
  const onConfigClick = nodeData.onConfigClick as ((nodeId: string) => void) | undefined;

  const mode = nodeData.mode || 'conditional';
  const hasConfiguration = () => {
    switch (mode) {
      case 'conditional':
        return Array.isArray(nodeData.conditions) && nodeData.conditions.length > 0;
      case 'switch':
        return Array.isArray(nodeData.cases) && nodeData.cases.length > 0;
      case 'filter':
        return Array.isArray(nodeData.criteria) && nodeData.criteria.length > 0;
      default:
        return false;
    }
  };

  const getConfigurationSummary = () => {
    switch (mode) {
      case 'conditional':
        const conditionCount = Array.isArray(nodeData.conditions) ? nodeData.conditions.length : 0;
        return `${conditionCount} rule${conditionCount > 1 ? 's' : ''} (${nodeData.operator || 'AND'})`;
      case 'switch':
        const caseCount = Array.isArray(nodeData.cases) ? nodeData.cases.length : 0;
        return `${caseCount} case${caseCount > 1 ? 's' : ''}`;
      case 'filter':
        const criteriaCount = Array.isArray(nodeData.criteria) ? nodeData.criteria.length : 0;
        return `${criteriaCount} filter${criteriaCount > 1 ? 's' : ''} (${nodeData.action || 'Allow'})`;
      default:
        return 'Not configured';
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'conditional':
        return GitBranch;
      case 'switch':
        return RotateCcw;
      case 'filter':
        return Filter;
      default:
        return GitBranch;
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case 'conditional':
        return 'text-amber-500';
      case 'switch':
        return 'text-cyan-500';
      case 'filter':
        return 'text-emerald-500';
      default:
        return 'text-primary';
    }
  };

  const configured = hasConfiguration();
  const ModeIcon = getModeIcon();

  // Dynamic handles based on mode
  const getHandles = () => {
    const handles = [];
    
    // Input handles (common)
    handles.push(
      <Handle 
        key="left"
        type="target" 
        position={Position.Left} 
        id="left" 
        className={handleClasses.connectionDot}
        style={{ left: -4, top: '50%', transform: 'translateY(-50%)' }}
      />,
      <Handle 
        key="top"
        type="target" 
        position={Position.Top} 
        id="top-in" 
        className={handleClasses.connectionDot}
        style={{ top: -4, left: '50%', transform: 'translateX(-50%)' }}
      />
    );

    // Output handles based on mode
    switch (mode) {
      case 'conditional':
        handles.push(
          <Handle 
            key="true"
            type="source" 
            position={Position.Right} 
            id="true" 
            className={handleClasses.connectionDot}
            style={{ right: -4, top: '40%', transform: 'translateY(-50%)' }}
          />,
          <Handle 
            key="false"
            type="source" 
            position={Position.Right} 
            id="false" 
            className={handleClasses.connectionDot}
            style={{ right: -4, top: '60%', transform: 'translateY(-50%)' }}
          />
        );
        break;
      
      case 'switch':
        const caseCount = Math.max(3, (nodeData.cases?.length || 0) + 1);
        for (let i = 0; i < caseCount; i++) {
          handles.push(
            <Handle
              key={`case-${i}`}
              type="source"
              position={Position.Right}
              id={`case-${i}`}
              style={{ right: -4, top: `${20 + (i * (60 / caseCount))}%`, transform: 'translateY(-50%)' }}
              className={handleClasses.connectionDot}
            />
          );
        }
        break;
      
      case 'filter':
        handles.push(
          <Handle 
            key="pass"
            type="source" 
            position={Position.Right} 
            id="pass" 
            className={handleClasses.connectionDot}
            style={{ right: -4, top: '40%', transform: 'translateY(-50%)' }}
          />,
          <Handle 
            key="block"
            type="source" 
            position={Position.Right} 
            id="block" 
            className={handleClasses.connectionDot}
            style={{ right: -4, top: '60%', transform: 'translateY(-50%)' }}
          />
        );
        break;
    }

    // Bottom output (common)
    handles.push(
      <Handle 
        key="bottom"
        type="source" 
        position={Position.Bottom} 
        id="bottom-out" 
        className={handleClasses.connectionDot}
        style={{ bottom: -4, left: '50%', transform: 'translateX(-50%)' }}
      />
    );

    return handles;
  };

  return (
    <div className={`
      relative group bg-card border-2 rounded-lg shadow-lg transition-all duration-200
      ${selected ? 'border-primary shadow-primary/20' : 'border-primary/50'}
      hover:shadow-xl
      ${configured ? 'p-3 min-w-[180px] max-w-[220px]' : 'p-2 w-[130px]'}
    `}>
      {/* Delete Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => deleteNode(id)}
        className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground hover:bg-destructive/90"
      >
        <Trash2 className="w-3 h-3" />
      </Button>

      {/* Config Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onConfigClick?.(id)}
        className="absolute -bottom-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
      >
        <Settings className="w-3 h-3" />
      </Button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`${configured ? 'p-1.5' : 'p-1'} rounded-md bg-primary/10`}>
          <ModeIcon className={`${configured ? 'w-4 h-4' : 'w-3 h-3'} ${getModeColor()}`} />
        </div>
        {configured && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate text-primary">Decisions</div>
            <div className="text-xs text-muted-foreground truncate">
              {mode.charAt(0).toUpperCase() + mode.slice(1)} mode
            </div>
          </div>
        )}
        {!configured && (
          <div className="flex-1 text-center">
            <h3 className="font-medium text-xs text-primary">Decisions</h3>
          </div>
        )}
      </div>

      {/* Configuration Details - Only show when configured */}
      {configured && (
        <div className="space-y-2 mb-3">
          {/* Mode Badge */}
          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Mode</span>
              <Badge variant="secondary" className="text-xs">
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Badge>
            </div>
          </div>
          
          {/* Configuration Summary */}
          <div className="bg-accent/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Configuration</span>
              <Badge variant="secondary" className="text-xs">
                {getConfigurationSummary()}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Unconfigured state notice */}
      {!configured && (
        <div className="text-center mb-2">
          <span className="text-xs text-muted-foreground">Not configured</span>
        </div>
      )}

      {/* Dynamic Connection Handles */}
      {getHandles()}
    </div>
  );
};