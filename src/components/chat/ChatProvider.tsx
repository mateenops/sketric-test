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
  endpoint = '/api/responses',
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

    try {
      dispatch({ type: 'RUN_STARTED', payload: { runId: nanoid() } });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instructions: `You are the Sketric AI Assistant, a helpful AI assistant for Sketric - a software development company. You specialize in helping with software development questions, technical interviews, and programming challenges. Be friendly, professional, and concise in your responses.`,
          input: text.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      
      // Create assistant message from response
      const assistantMessageId = nanoid();
      dispatch({
        type: 'TEXT_MESSAGE_START',
        payload: { messageId: assistantMessageId, role: 'assistant', timestamp: Date.now() }
      });

      // Extract content from OpenAI responses format
      let content = '';
      if (data.output && Array.isArray(data.output)) {
        content = data.output.map((msg: any) => 
          msg.content?.map((c: any) => c.text || '').join('') || ''
        ).join('');
      } else if (typeof data.output === 'string') {
        content = data.output;
      } else {
        content = 'No response received';
      }

      dispatch({
        type: 'TEXT_MESSAGE_CONTENT',
        payload: { messageId: assistantMessageId, delta: content, timestamp: Date.now() }
      });

      dispatch({
        type: 'TEXT_MESSAGE_END',
        payload: { messageId: assistantMessageId, timestamp: Date.now() }
      });

      dispatch({ type: 'RUN_FINISHED' });

    } catch (error) {
      console.error('SketricChat: Failed to send message:', error);
      dispatch({ type: 'STREAM_ERROR', payload: { message: error instanceof Error ? error.message : 'Unknown error' } });
      toast({ 
        title: "Chat Error", 
        description: "Failed to send message. Please try again.", 
        variant: "destructive" 
      });
    }
  }, [endpoint, toast]);

  const toggleWidget = useCallback(() => {
    dispatch({ type: 'TOGGLE_WIDGET' });
  }, []);

  return (
    <SketricChatContext.Provider value={{ ...state, sendMessage, toggleWidget }}>
      {children}
    </SketricChatContext.Provider>
  );
}