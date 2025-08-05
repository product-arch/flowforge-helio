import React from 'react';
import { useReactFlow } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Maximize } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const ZoomControls: React.FC = () => {
  const { zoomIn, zoomOut, fitView, getZoom } = useReactFlow();
  const currentZoom = Math.round(getZoom() * 100);

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-1 bg-card border border-border rounded-lg p-1 shadow-lg">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => zoomIn()}
              className="w-8 h-8 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Zoom In</p>
          </TooltipContent>
        </Tooltip>

        <div className="text-xs text-center text-muted-foreground py-1 min-w-12">
          {currentZoom}%
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => zoomOut()}
              className="w-8 h-8 p-0"
            >
              <Minus className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Zoom Out</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fitView()}
              className="w-8 h-8 p-0"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Fit View</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};