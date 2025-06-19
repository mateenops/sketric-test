
'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizonal, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isStreaming: boolean; // Indicates if the assistant is currently processing/responding
}

export function ChatInput({ onSendMessage, isStreaming }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() && !isStreaming) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t bg-card p-4"
      aria-label="Chat input form"
    >
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your message..."
        className="flex-grow rounded-full focus-visible:ring-primary/50"
        disabled={isStreaming}
        aria-label="Message input"
        aria-disabled={isStreaming}
      />
      <Button
        type="submit"
        variant="default"
        size="icon"
        className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
        disabled={isStreaming || !inputValue.trim()}
        aria-label={isStreaming ? "Sending message" : "Send message"}
        aria-disabled={isStreaming || !inputValue.trim()}
      >
        {isStreaming ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizonal className="h-5 w-5" />}
      </Button>
    </form>
  );
}
