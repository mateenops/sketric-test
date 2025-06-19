
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
        'flex w-full max-w-[80%] items-end gap-2 group animate-in fade-in-50 slide-in-from-bottom-4 duration-300',
        isUser ? 'self-end flex-row-reverse' : 'self-start'
      )}
    >
      <Avatar className={cn('h-8 w-8 shadow', isUser ? 'ml-2' : 'mr-2')}>
        {/* AvatarImage can be added if user/assistant images are available */}
        {/* <AvatarImage src={isUser ? undefined : '/path/to/bot-avatar.png'} alt={message.role} /> */}
        <AvatarFallback className={cn(isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
          {isUser ? <User size={18} /> : <Bot size={18} />}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'rounded-xl shadow-md break-words',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none py-3 px-2' // Adjusted padding for user
            : 'bg-card text-card-foreground border rounded-bl-none p-3' // Kept p-3 for assistant
        )}
      >
        {message.type === 'text' ? (
          <div className="prose prose-sm max-w-none dark:prose-invert">
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
  );
}
