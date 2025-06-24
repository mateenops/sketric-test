'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import { nanoid } from 'nanoid';
import { useToast } from '@/hooks/use-toast';

import type {
  SketricChatState,
  SketricChatAction,
  SketricChatMessage,
} from '@/lib/types';

const initialState: SketricChatState = {
  messages: [],
  threadId: null,
  isStreaming: false,
  isWidgetOpen: false,
  currentAssistantMessageId: null,
};

const chatReducer = (state: SketricChatState, action: SketricChatAction): SketricChatState => {
  switch (action.type) {
    case 'TOGGLE_WIDGET':
      return { ...state, isWidgetOpen: !state.isWidgetOpen };
    case 'ADD_USER_MESSAGE': {
      const newMessage: SketricChatMessage = {
        id: action.payload.id,
        role: 'user',
        content: action.payload.text,
        type: 'text',
        isComplete: true,
        timestamp: Date.now(),
      };
      return { ...state, messages: [...state.messages, newMessage] };
    }
    case 'SET_THREAD_ID':
      return { ...state, threadId: action.payload };
    case 'RUN_STARTED':
      return { ...state, isStreaming: true };
    case 'TEXT_MESSAGE_START': {
      const newMessage: SketricChatMessage = {
        id: action.payload.messageId,
        role: 'assistant',
        content: '',
        type: 'text',
        isComplete: false,
        timestamp: action.payload.timestamp,
      };
      return {
        ...state,
        messages: [...state.messages, newMessage],
        currentAssistantMessageId: action.payload.messageId,
      };
    }
    case 'TEXT_MESSAGE_CONTENT': {
      if (!state.currentAssistantMessageId || state.currentAssistantMessageId !== action.payload.messageId) {
        return state; 
      }
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.payload.messageId
            ? { ...msg, content: msg.content + action.payload.delta }
            : msg
        ),
      };
    }
    case 'TEXT_MESSAGE_END': {
      if (!state.currentAssistantMessageId || state.currentAssistantMessageId !== action.payload.messageId) {
        return state; 
      }
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.payload.messageId ? { ...msg, isComplete: true } : msg
        ),
      };
    }
    case 'RUN_FINISHED':
      return { ...state, isStreaming: false, currentAssistantMessageId: null };
    case 'STREAM_ERROR': {
      const errorMessage: SketricChatMessage = {
        id: nanoid(),
        role: 'assistant',
        content: `Error: ${action.payload.message}`,
        type: 'text',
        isComplete: true,
        timestamp: Date.now(),
      };
      return {
        ...state,
        messages: [...state.messages, errorMessage],
        isStreaming: false,
        currentAssistantMessageId: null,
      };
    }
    default:
      return state;
  }
};

export interface SketricChatContextType extends SketricChatState {
  sendMessage: (text: string) => void;
  toggleWidget: () => void;
}

export const SketricChatContext = createContext<SketricChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
  endpoint?: string;
  agent?: string;
}

export function ChatProvider({
  children,
  endpoint = '/api/chat-sse',
  agent = 'sketric_agent',
}: ChatProviderProps) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (!state.threadId) {
      const newThreadId = nanoid();
      dispatch({ type: 'SET_THREAD_ID', payload: newThreadId });
    }
  }, [state.threadId]);

  const sendMessage = useCallback(async (text: string) => {
  if (!text.trim()) return;

  const userMessageId = nanoid();
  dispatch({ 
    type: 'ADD_USER_MESSAGE', 
    payload: { text: text.trim(), id: userMessageId } 
  });

  const assistantMessageId = nanoid();
  dispatch({
    type: 'TEXT_MESSAGE_START',
    payload: { messageId: assistantMessageId, role: 'assistant', timestamp: Date.now() }
  });

  try {
    dispatch({ type: 'RUN_STARTED', payload: { runId: nanoid() } });

    const url = `${endpoint}?input=${encodeURIComponent(text)}&instructions=${encodeURIComponent("You are the Sketric AI Assistant, a helpful AI assistant for Sketric - a software development company. You specialize in helping with software development questions, technical interviews, and programming challenges. Be friendly, professional, and concise in your responses.")}`;

    const response = await fetch(url);

    if (!response.ok || !response.body) {
      throw new Error(`HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let eventType: string | null = null;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      for (const line of chunk.split('\n')) {
        if (line.startsWith('event:')) {
          eventType = line.replace('event: ', '').trim();
        } else if (line.startsWith('data:')) {
          const dataStr = line.replace('data: ', '').trim();

          if (eventType === 'end') {
            dispatch({
              type: 'TEXT_MESSAGE_END',
              payload: { messageId: assistantMessageId, timestamp: Date.now() }
            });
            dispatch({ type: 'RUN_FINISHED' });
          } else if (eventType === 'error') {
            try {
              const errorData = JSON.parse(dataStr);
              throw new Error(errorData.message || 'Unknown SSE error');
            } catch (err) {
              throw new Error(dataStr);
            }
          } else {
            // default "message" type
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.delta) {
                dispatch({
                  type: 'TEXT_MESSAGE_CONTENT',
                  payload: { messageId: assistantMessageId, delta: parsed.delta, timestamp: Date.now() }
                });
              }
            } catch (e) {
              console.warn('Failed to parse SSE data:', dataStr);
            }
          }

          eventType = null; // Reset after each full message
        }
      }
    }

  } catch (error) {
    console.error('SketricChat SSE Error:', error);
    dispatch({
      type: 'STREAM_ERROR',
      payload: { message: error instanceof Error ? error.message : 'Unknown error' }
    });
    toast({
      title: "Chat Error",
      description: "Failed to send message. Please try again.",
      variant: "destructive"
    });
  }
}, [toast]);


  const toggleWidget = useCallback(() => {
    dispatch({ type: 'TOGGLE_WIDGET' });
  }, []);

  return (
    <SketricChatContext.Provider value={{ ...state, sendMessage, toggleWidget }}>
      {children}
    </SketricChatContext.Provider>
  );
}