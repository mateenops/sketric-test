
"use client";

import { useContext } from 'react';
// Ensure this path points to your new/refactored ChatProvider and its context type
import { SketricChatContext, type SketricChatContextType } from '@/components/chat/ChatProvider'; 

export const useChat = (): SketricChatContextType => {
  const context = useContext(SketricChatContext);
  if (!context) {
    throw new Error('useChat must be used within a SketricChatProvider');
  }
  return context;
};
