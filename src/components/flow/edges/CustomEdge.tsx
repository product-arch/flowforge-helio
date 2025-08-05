import React from 'react';
import {
  EdgeProps,
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
} from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
  animated,
}) => {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          strokeWidth: 2,
          stroke: selected ? 'hsl(var(--primary))' : 'hsl(var(--connection-default))',
          ...style,
        }}
        className={animated ? 'animate-pulse' : ''}
      />
      
      {selected && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <Button
              variant="destructive"
              size="sm"
              onClick={onEdgeClick}
              className="w-6 h-6 p-0 rounded-full"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};