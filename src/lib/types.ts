
// Sketric Chat Widget Types
export interface SketricChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'text' | 'action_card';
  actionCardData?: SketricActionCardData;
  isComplete?: boolean; // For assistant messages being streamed
  timestamp: number;
}

export interface SketricActionCardOption {
  label: string;
  value: string;
}

export interface SketricActionCardData {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  options?: SketricActionCardOption[];
  actionName?: string;
  actionArguments?: Record<string, any>;
}

// SSE Event Types from Sketric backend
export type SketricSseEventName =
  | 'RUN_STARTED'
  | 'TEXT_MESSAGE_START'
  | 'TEXT_MESSAGE_CONTENT'
  | 'TEXT_MESSAGE_END'
  | 'CUSTOM' // with name: 'ACTION_EXECUTION'
  | 'RUN_FINISHED'
  | 'ERROR'; // Assuming an error event type might exist

export interface SketricSseEvent {
  event: SketricSseEventName;
  data: string; // JSON stringified data
}

// Parsed data from SSE events
export interface RunStartedData {
  threadId: string;
  runId: string;
  timestamp: number;
}

export interface TextMessageStartData {
  messageId: string;
  role: 'assistant'; // Typically assistant
  timestamp: number;
}

export interface TextMessageContentData {
  messageId: string;
  delta: string;
  timestamp: number;
}

export interface TextMessageEndData {
  messageId: string;
  timestamp: number;
}

export interface CustomActionEventData {
  name: 'ACTION_EXECUTION';
  value: {
    actionName: string;
    arguments: Record<string, any>; // e.g., { organization: "CWS", user: "User 1", ... }
  };
  timestamp: number;
}

export interface RunFinishedData {
  threadId: string;
  runId: string;
  timestamp: number;
}

export interface ErrorData {
  message: string;
  details?: any;
}

// ChatProvider Context State
export interface SketricChatState {
  messages: SketricChatMessage[];
  threadId: string | null;
  isStreaming: boolean; // True between RUN_STARTED and RUN_FINISHED
  isWidgetOpen: boolean;
  currentAssistantMessageId: string | null; // Tracks the ID of the assistant message being streamed
  // agent is a prop, not state
}

// ChatProvider Context Actions
export type SketricChatAction =
  | { type: 'TOGGLE_WIDGET' }
  | { type: 'ADD_USER_MESSAGE'; payload: { text: string; id: string } }
  | { type: 'SET_THREAD_ID'; payload: string }
  | { type: 'RUN_STARTED'; payload: { runId: string } }
  | { type: 'TEXT_MESSAGE_START'; payload: TextMessageStartData }
  | { type: 'TEXT_MESSAGE_CONTENT'; payload: TextMessageContentData }
  | { type: 'TEXT_MESSAGE_END'; payload: TextMessageEndData }
  | { type: 'CUSTOM_ACTION'; payload: CustomActionEventData }
  | { type: 'RUN_FINISHED' }
  | { type: 'STREAM_ERROR'; payload: { message: string } };
