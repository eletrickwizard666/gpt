export type Role = "user" | "assistant" | "system";

export type ToolStatus = "queued" | "running" | "streaming" | "complete" | "failed";

export type ToolInvocation = {
  id: string;
  name: string;
  status: ToolStatus;
  output?: string;
  startedAt?: string;
  finishedAt?: string;
};

export type Message = {
  id: string;
  role: Role;
  content: string;
  createdAt: string;
  streaming?: boolean;
  toolInvocations?: ToolInvocation[];
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
};
