import React, { useRef, useCallback, DragEvent } from 'react';
import { ReactFlowProvider, useReactFlow } from '@xyflow/react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { FlowProvider, useFlow } from '@/contexts/FlowContext';
import { FlowBuilder as FlowBuilderComponent } from '@/components/flow/FlowBuilder';

const FlowBuilderWithDragDrop: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { addNode } = useFlow();
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      // Convert screen coordinates to flow coordinates for precise placement
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type, position);
    },
    [addNode, screenToFlowPosition]
  );

  return (
    <div className="h-screen w-full bg-background" ref={reactFlowWrapper} onDragOver={onDragOver} onDrop={onDrop}>
      <FlowBuilderComponent />
    </div>
  );
};

const FlowBuilderPage: React.FC = () => {
  return (
    <ThemeProvider>
      <FlowProvider>
        <ReactFlowProvider>
          <FlowBuilderWithDragDrop />
        </ReactFlowProvider>
      </FlowProvider>
    </ThemeProvider>
  );
};

export default FlowBuilderPage;