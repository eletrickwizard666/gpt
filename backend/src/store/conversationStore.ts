import { randomUUID } from "crypto";

import { seededConversations } from "../data/mockConversations";
import type {
  Conversation,
  CreateConversationPayload,
  CreateMessagePayload,
  Message,
  StreamResponse,
} from "../types/conversation";

const STREAM_COPY =
  "Here’s a momentum plan tailored for your focus. I’ve stacked deep work intervals, companion prompts, and wind-down rituals so every loop compounds.";

type ConversationSummary = Pick<Conversation, "id" | "title" | "lastUpdated" | "metrics"> & {
  messageCount: number;
  suggestionCount: number;
};

export class ConversationStore {
  private conversations = new Map<string, Conversation>();

  constructor(seed: Conversation[] = seededConversations) {
    seed.forEach((conversation) => this.conversations.set(conversation.id, conversation));
  }

  list(): ConversationSummary[] {
    return Array.from(this.conversations.values())
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .map((conversation) => ({
        id: conversation.id,
        title: conversation.title,
        lastUpdated: conversation.lastUpdated,
        metrics: conversation.metrics,
        messageCount: conversation.messages.length,
        suggestionCount: conversation.suggestions.length,
      }));
  }

  get(id: string): Conversation | undefined {
    return this.conversations.get(id);
  }

  create(payload: CreateConversationPayload = {}): Conversation {
    const id = payload.title ? this.slugify(payload.title) : `conv-${randomUUID()}`;
    const createdAt = new Date().toISOString();
    const conversation: Conversation = {
      id,
      title: payload.title ?? "Untitled conversation",
      lastUpdated: createdAt,
      suggestions: ["Summarise context", "Draft plan", "Explore variations"],
      metrics: {
        latencyMs: 0,
        toolCount: 0,
        tokens: 0,
      },
      messages: [
        {
          id: `msg-${randomUUID()}`,
          role: "system",
          content:
            "You are ChatGPT, an advanced assistant ready to help with strategy, ideation, and polished deliverables.",
          createdAt,
        },
      ],
    };

    this.conversations.set(conversation.id, conversation);

    return conversation;
  }

  addMessage(conversationId: string, payload: CreateMessagePayload): Message {
    const conversation = this.requireConversation(conversationId);
    const now = new Date().toISOString();
    const message: Message = {
      id: `msg-${randomUUID()}`,
      role: payload.role,
      content: payload.content,
      createdAt: now,
    };

    conversation.messages.push(message);
    conversation.lastUpdated = now;
    this.conversations.set(conversation.id, conversation);

    return message;
  }

  beginStream(conversationId: string): StreamResponse {
    const conversation = this.requireConversation(conversationId);
    const now = new Date().toISOString();
    const message: Message = {
      id: `msg-${randomUUID()}`,
      role: "assistant",
      content: "",
      createdAt: now,
    };

    conversation.messages.push(message);
    conversation.lastUpdated = now;
    conversation.metrics = {
      ...conversation.metrics,
      latencyMs: Math.round(Math.random() * 500 + 800),
    };

    this.conversations.set(conversation.id, conversation);

    return {
      messageId: message.id,
      content: "",
      isFinal: false,
    };
  }

  appendToStream(conversationId: string, messageId: string, content: string, isFinal: boolean): StreamResponse {
    const conversation = this.requireConversation(conversationId);
    const message = conversation.messages.find((msg) => msg.id === messageId);

    if (!message) {
      throw new Error(`Message ${messageId} not found in conversation ${conversationId}`);
    }

    message.content += content;
    if (isFinal) {
      conversation.metrics = {
        ...conversation.metrics,
        tokens: conversation.metrics.tokens + message.content.split(/\s+/).length,
      };
      conversation.lastUpdated = new Date().toISOString();
    }

    this.conversations.set(conversation.id, conversation);

    return {
      messageId,
      content: message.content,
      isFinal,
    };
  }

  simulateStream(conversationId: string, onChunk: (chunk: StreamResponse) => Promise<void> | void): Promise<void> {
    const { messageId } = this.beginStream(conversationId);
    const tokens = STREAM_COPY.split(" ");

    return tokens.reduce<Promise<void>>(async (acc, token, index) => {
      await acc;
      const chunk = this.appendToStream(conversationId, messageId, `${token}${index < tokens.length - 1 ? " " : ""}`, index === tokens.length - 1);
      await onChunk(chunk);
      await new Promise((resolve) => setTimeout(resolve, 40));
    }, Promise.resolve());
  }

  private requireConversation(id: string): Conversation {
    const conversation = this.conversations.get(id);
    if (!conversation) {
      throw new Error(`Conversation ${id} not found`);
    }
    return conversation;
  }

  private slugify(title: string): string {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const base = slug.length > 0 ? slug : "conversation";
    let unique = base;
    let counter = 1;
    while (this.conversations.has(unique)) {
      unique = `${base}-${counter++}`;
    }
    return unique;
  }
}

export const conversationStore = new ConversationStore();
