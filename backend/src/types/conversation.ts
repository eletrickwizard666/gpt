export type Role = "system" | "user" | "assistant" | "tool";

export type Message = {
  id: string;
  role: Role;
  content: string;
  createdAt: string;
  toolInvocationId?: string;
};

export type ToolInvocationState = "queued" | "running" | "succeeded" | "failed";

export type ToolInvocation = {
  id: string;
  name: string;
  state: ToolInvocationState;
  createdAt: string;
  updatedAt: string;
  input?: Record<string, unknown>;
  output?: Record<string, unknown> | string;
  error?: string;
};

export type ConversationMetrics = {
  latencyMs: number;
  toolCount: number;
  tokens: number;
};

export type Conversation = {
  id: string;
  title: string;
  lastUpdated: string;
  messages: Message[];
  suggestions: string[];
  metrics: ConversationMetrics;
  tools?: ToolInvocation[];
};

export type CreateConversationPayload = {
  title?: string;
};

export type CreateMessagePayload = {
  role: Exclude<Role, "system">;
  content: string;
};

export type StreamResponse = {
  messageId: string;
  content: string;
  isFinal: boolean;
};
