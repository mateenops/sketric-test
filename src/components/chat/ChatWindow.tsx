'use client';

import React, { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { Message } from './Message';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bot } from 'lucide-react';

export function ChatWindow() {
  const { messages, isStreaming, sendMessage, handleActionSelect } = useChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isStreaming]);

  // A simple check for if the assistant is the one "actively" responding
  const assistantIsActive = isStreaming && messages[messages.length -1]?.sender !== 'user';

  return (
    <div className="flex flex-col h-full max-h-full bg-background shadow-2xl rounded-lg overflow-hidden border">
      <header className="flex items-center p-4 border-b bg-card">
        <Bot className="h-7 w-7 text-primary mr-3" />
        <h1 className="text-xl font-headline font-semibold text-foreground">StreamAssist</h1>
      </header>
      
      <ScrollArea className="flex-grow" ref={scrollAreaRef}>
        <div ref={viewportRef} className="p-4 md:p-6 space-y-4">
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} onActionSelect={handleActionSelect} />
          ))}
          {assistantIsActive && <TypingIndicator />}
        </div>
      </ScrollArea>
      
      <Separator />
      <ChatInput onSendMessage={sendMessage} isStreaming={isStreaming} />
    </div>
  );
}
