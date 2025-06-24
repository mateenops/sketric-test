
'use client';

import type { SketricChatMessage } from '@/lib/types'; // Updated type
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // Removed AvatarImage as not used
import { User, Bot } from 'lucide-react';
import { ActionCard } from './ActionCard'; // Will be SketricActionCard
import ReactMarkdown from 'react-markdown';

interface MessageProps {
  message: SketricChatMessage; // Updated type
  onActionSelect: (actionCardId: string, selectedValue: string) => void;
}

export function Message({ message, onActionSelect }: MessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex w-full items-start animate-in fade-in-50 slide-in-from-bottom-4 duration-300', // Ensure message stays aligned correctly
        isUser ? 'justify-end' : 'justify-start' // Align user to right
      )}
    >
      <div
        className={cn(
          // Cap message width and maintain flex layout without overflow
          'flex items-end gap-2 max-w-[75%] sm:max-w-[70%] md:max-w-[60%]',
          isUser ? 'flex-row-reverse' : ''
        )}
      >
        <Avatar className="h-8 w-8 shadow">
          <AvatarFallback
            className={cn(
              isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}
          >
            {isUser ? <User size={18} /> : <Bot size={18} />}
          </AvatarFallback>
        </Avatar>
        <div
          className={cn(
            'rounded-xl shadow-md break-words overflow-hidden', //Prevent horizontal overflow
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-none p-3'
              : 'bg-card text-card-foreground border rounded-bl-none p-3'
          )}
        >
          {message.type === 'text' ? (
            <div className="prose prose-sm max-w-none dark:prose-invert break-words [&_pre]:overflow-x-auto [&_code]:break-words">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ) : message.type === 'action_card' && message.actionCardData ? (
            <ActionCard data={message.actionCardData} onActionSelect={onActionSelect} />
          ) : null}
          <p className="text-xs mt-1 opacity-70">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
}
