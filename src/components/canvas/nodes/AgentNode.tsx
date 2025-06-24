import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function AgentNode({ data }: any) {
  return (
    <div style={{
      padding: 10,
      background: '#60a5fa', // blue-400
      borderRadius: 6,
      border: '2px solid #3b82f6',
      width: 120,
      textAlign: 'center',
      fontWeight: 'bold',
    }}>
      🤖 Agent
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
