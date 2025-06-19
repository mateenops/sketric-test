
'use client';

import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChat } from '@/hooks/useChat'; 

export function FloatingButton() {
  const { toggleWidget, isWidgetOpen } = useChat();

  if (isWidgetOpen) {
    return null; // Hide button when widget is open
  }

  return (
    <Button
      variant="default" // Uses primary color by default from theme
      className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg flex items-center justify-center text-primary-foreground z-50"
      onClick={toggleWidget}
      aria-label={'Open chat'}
      size="icon"
    >
      <MessageSquare size={28} />
    </Button>
  );
}
