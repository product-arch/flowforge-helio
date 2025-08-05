import React, { useRef, useCallback, DragEvent } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { FlowProvider, useFlow } from '@/contexts/FlowContext';
import { FlowBuilder as FlowBuilderComponent } from '@/components/flow/FlowBuilder';

const FlowBuilderWithDragDrop: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { addNode } = useFlow();

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

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const position = {
        x: event.clientX - reactFlowBounds.left - 100, // Offset for node center
        y: event.clientY - reactFlowBounds.top - 50,
      };

      addNode(type, position);
    },
    [addNode]
  );

  return (
    <div className="h-screen w-full" ref={reactFlowWrapper} onDragOver={onDragOver} onDrop={onDrop}>
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