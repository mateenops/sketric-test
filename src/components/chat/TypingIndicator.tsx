
'use client';

import React from 'react';

export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1 p-2 self-start ml-10 mb-2"> {/* Added ml-10 to align with bot messages */}
      <span className="text-sm text-muted-foreground">Sketric Assistant is typing</span>
      <div className="flex space-x-1">
        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-typing-dot-1"></div>
        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-typing-dot-2"></div>
        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-typing-dot-3"></div>
      </div>
    </div>
  );
}
