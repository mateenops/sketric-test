import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function ToolNode({ data }: any) {
  return (
    <div style={{
      padding: 10,
      background: '#34d399', // green-400
      borderRadius: 6,
      border: '2px solid #10b981',
      width: 120,
      textAlign: 'center',
      fontWeight: 'bold',
    }}>
      🛠️ Tool
      <Handle type="target" position={Position.Left} />
    </div>
  );
}
