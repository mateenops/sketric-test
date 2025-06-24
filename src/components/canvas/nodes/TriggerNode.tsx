import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function TriggerNode({ data }: any) {
  return (
    <div style={{
      padding: 10,
      background: '#facc15', // yellow-400
      borderRadius: 6,
      border: '2px solid #eab308',
      width: 120,
      textAlign: 'center',
      fontWeight: 'bold',
    }}>
      ⚡ Trigger
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
