import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { 
  Play, 
  Globe, 
  Clock, 
  Database, 
  Lock, 
  MoreHorizontal, 
  AlertTriangle, 
  ShieldCheck,
  KeyRound,
  Copy,
  RotateCcw,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFlow } from '@/contexts/FlowContext';
import { StartNodeProps, TriggerType } from '@/types/flow';
import { cn } from '@/lib/utils';

interface StartNodeData extends StartNodeProps {
  label?: string;
  environment?: 'dev' | 'stage' | 'prod';
  [key: string]: any;
}

interface StartNodeComponentProps extends NodeProps {
  data: StartNodeData;
}

const triggerIcons = {
  manual: Play,
  webhook: Globe,
  schedule: Clock,
  batch: Database,
  event_bus: Database
};

const Chip: React.FC<{
  label: string;
  icon?: React.ComponentType<any>;
  intent?: 'neutral' | 'warn' | 'danger';
}> = ({ label, icon: Icon, intent = 'neutral' }) => {
  const styles = intent === 'danger'
    ? 'bg-status-error/15 text-red-200'
    : intent === 'warn'
    ? 'bg-status-warning/15 text-amber-100'
    : 'bg-muted/60 text-muted-foreground';

  return (
    <span className={cn('inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px]', styles)}>
      {Icon && <Icon className="h-3 w-3" />}
      {label}
    </span>
  );
};

export const StartNode: React.FC<StartNodeComponentProps> = ({ id, data, selected }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Extract configuration with defaults
  const {
    trigger = 'manual',
    auth,
    rateLimit,
    lockPosition = true,
    environment = 'dev',
    inputSchemaRef
  } = data || {};

  const hasSchema = Boolean(inputSchemaRef);
  const Icon = triggerIcons[trigger];

  // Determine node state
  const hasWarning = environment === 'prod' && (!auth || auth.kind === 'none') && trigger === 'webhook';
  const hasError = false; // Would be determined by validation

  const handleCopyCurl = () => {
    // Placeholder for copy cURL functionality
    console.log('Copy cURL command');
  };

  const handleReplay = () => {
    // Placeholder for replay functionality
    console.log('Replay last 20 requests');
  };

  const handleViewLogs = () => {
    // Placeholder for view logs functionality
    console.log('View logs');
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          'group relative select-none',
          'rounded-full px-5 py-4 w-[360px] max-w-full',
          'shadow-sm backdrop-blur border transition-colors',
          hasError
            ? 'border-status-error/70 bg-status-error/5'
            : hasWarning
            ? 'border-status-warning/70 bg-status-warning/5'
            : 'border-primary/50 bg-primary/5 hover:bg-primary/10 focus:bg-primary/10',
          selected && 'ring-2 ring-primary/20'
        )}
      >
        {/* Lock badge */}
        {lockPosition && (
          <span className="absolute -top-2 -left-2 inline-flex items-center gap-1 rounded-full bg-card text-muted-foreground px-2 py-1 text-[10px] shadow border">
            <Lock className="h-3 w-3" />
            LOCKED
          </span>
        )}

        {/* Kebab menu */}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleCopyCurl} disabled={trigger !== 'webhook'}>
              <Copy className="w-4 h-4 mr-2" />
              Copy as cURL
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleReplay}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Replay last 20
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleViewLogs}>
              <FileText className="w-4 h-4 mr-2" />
              View logs
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Content */}
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/15">
            <Icon className="h-5 w-5 text-primary" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-foreground">
                Trigger · {trigger.replace('_', ' ')}
              </h3>
              {hasError && (
                <span className="inline-flex items-center gap-1 rounded-md bg-status-error/20 px-1.5 py-0.5 text-[10px] text-red-200">
                  <AlertTriangle className="h-3 w-3" />
                  Invalid
                </span>
              )}
              {!hasError && hasWarning && (
                <span className="inline-flex items-center gap-1 rounded-md bg-status-warning/20 px-1.5 py-0.5 text-[10px] text-amber-100">
                  <AlertTriangle className="h-3 w-3" />
                  Warning
                </span>
              )}
            </div>

            {/* Chips row */}
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
              <Chip 
                label={environment.toUpperCase()} 
                intent={environment === 'prod' ? 'danger' : environment === 'stage' ? 'warn' : 'neutral'} 
              />
              <Chip label={rateLimit ? `${rateLimit.rps} rps` : 'RPS —'} />
              <Chip
                label={auth?.kind === 'none' || !auth ? 'Auth: None' : `Auth: ${auth.kind.toUpperCase()}`}
                icon={auth?.kind === 'none' || !auth ? AlertTriangle : ShieldCheck}
                intent={auth?.kind === 'none' || !auth ? 'warn' : 'neutral'}
              />
              <Chip 
                label={hasSchema ? 'Schema ✓' : 'Schema —'} 
                icon={hasSchema ? KeyRound : undefined} 
              />
            </div>
          </div>
        </div>

        {/* Handles */}
        <Handle
          type="source"
          position={Position.Right}
          id="success"
          className="w-3 h-3 bg-primary border-2 border-background"
        />
        
        {/* Conditional handles based on configuration */}
        {trigger === 'webhook' && (
          <Handle
            type="source"
            position={Position.Bottom}
            id="invalid_input"
            className="w-3 h-3 bg-status-warning border-2 border-background"
            style={{ right: '40px', left: 'auto' }}
          />
        )}
        
        {rateLimit && (
          <Handle
            type="source"
            position={Position.Bottom}
            id="throttled"
            className="w-3 h-3 bg-status-error border-2 border-background"
            style={{ right: '20px', left: 'auto' }}
          />
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute inset-0 pointer-events-none" />
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <div className="font-medium">Start Node - {trigger}</div>
              <div className="text-muted-foreground">
                Entry point for the routing flow
              </div>
              {rateLimit && (
                <div className="text-xs mt-1">
                  Rate limit: {rateLimit.rps} rps, burst: {rateLimit.burst}
                </div>
              )}
              <div className="text-xs mt-1 text-muted-foreground">
                Press Enter to configure • C to copy cURL • L for logs
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};