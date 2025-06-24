'use client';
import {
    ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  Connection,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeTypes } from './utils/nodeTypes';

const initialNodes: Node[] = [
  {
    id: 'trigger-1',
    type: 'trigger',
    position: { x: 100, y: 100 },
    data: {},
  },
  {
    id: 'agent-1',
    type: 'agent',
    position: { x: 300, y: 100 },
    data: {},
  },
  {
    id: 'tool-1',
    type: 'tool',
    position: { x: 500, y: 60 },
    data: {},
  },
  {
    id: 'tool-2',
    type: 'tool',
    position: { x: 500, y: 140 },
    data: {},
  },
];
const initialEdges: any = [];

export default function CanvasFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params: Connection) => {
    const sourceNode = nodes.find((n) => n.id === params.source);
    const targetNode = nodes.find((n) => n.id === params.target);

    if (!sourceNode || !targetNode) return;

    const sourceType = sourceNode.type;
    const targetType = targetNode.type;

    const validConnection =
      (sourceType === 'trigger' && targetType === 'agent') ||
      (sourceType === 'agent' && targetType === 'tool');

    if (!validConnection) {
      alert(`Invalid connection: ${sourceType} → ${targetType}`);
      return;
    }

    setEdges((eds) => addEdge({ ...params, type: 'default' }, eds));
  };
  return (
    <div style={{ width: '100%', height: '90vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
