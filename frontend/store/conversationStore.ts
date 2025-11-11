"use client";

import { create } from "zustand";
import { seededConversations } from "../lib/mockData";
import type { Conversation, ToolInvocation } from "../types/conversation";

type StreamStatus = "idle" | "queued" | "streaming";

type ConversationStore = {
  conversations: Conversation[];
  activeConversationId: string;
  streamStatus: StreamStatus;
  streamMessageId?: string;
  streamProgress: number;
  streamHint: string;
  selectConversation: (id: string) => void;
  createConversation: () => string;
  renameConversation: (id: string, title: string) => void;
  deleteConversation: (id: string) => void;
  queueSuggestion: (suggestion: string) => void;
  sendPrompt: (prompt: string) => void;
  triggerStream: () => void;
  completeStream: () => void;
};

const STREAM_COPY =
  "Here’s a momentum plan tailored for your focus. I’ve stacked deep work intervals, companion prompts, and wind-down rituals so every loop compounds.";

let streamTimer: number | null = null;

const makeId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

function withConversation(id: string, update: (conversation: Conversation) => Conversation) {
  return (conversations: Conversation[]) =>
    conversations.map((conversation) => (conversation.id === id ? update(conversation) : conversation));
}

export const useConversationStore = create<ConversationStore>((set, get) => ({
  conversations: seededConversations,
  activeConversationId: seededConversations[0]?.id ?? "",
  streamStatus: "idle",
  streamProgress: 0,
  streamHint: "Ready to stream",

  selectConversation: (id) => set({ activeConversationId: id }),

  createConversation: () => {
    const id = `conv-${makeId()}`;
    const now = new Date().toISOString();
    const newConversation: Conversation = {
      id,
      title: "Untitled conversation",
      lastUpdated: now,
      messages: [
        {
          id: `msg-${makeId()}`,
          role: "system",
          content:
            "You are ChatGPT, an advanced assistant ready to help with strategy, ideation, and polished deliverables.",
          createdAt: now,
        },
      ],
      suggestions: ["Summarise context", "Draft plan", "Explore variations"],
      metrics: {
        latencyMs: 0,
        toolCount: 0,
        tokens: 0,
      },
    };

    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      activeConversationId: id,
    }));

    return id;
  },

  renameConversation: (id, title) =>
    set((state) => ({
      conversations: withConversation(id, (conversation) => ({ ...conversation, title }))(state.conversations),
    })),

  deleteConversation: (id) =>
    set((state) => {
      const conversations = state.conversations.filter((conv) => conv.id !== id);
      const activeConversationId =
        state.activeConversationId === id ? conversations[0]?.id ?? "" : state.activeConversationId;
      return {
        conversations,
        activeConversationId,
      };
    }),

  queueSuggestion: (suggestion) => {
    const convId = get().activeConversationId;
    if (!convId) return;
    const now = new Date().toISOString();
    set((state) => ({
      conversations: withConversation(convId, (conversation) => ({
        ...conversation,
        messages: [
          ...conversation.messages,
          {
            id: `msg-${makeId()}`,
            role: "user",
            content: suggestion,
            createdAt: now,
          },
        ],
        lastUpdated: now,
      }))(state.conversations),
    }));
    get().triggerStream();
  },

  sendPrompt: (prompt) => {
    const convId = get().activeConversationId;
    if (!convId) return;
    const now = new Date().toISOString();
    set((state) => ({
      conversations: withConversation(convId, (conversation) => ({
        ...conversation,
        messages: [
          ...conversation.messages,
          {
            id: `msg-${makeId()}`,
            role: "user",
            content: prompt,
            createdAt: now,
          },
        ],
        lastUpdated: now,
      }))(state.conversations),
    }));
    get().triggerStream();
  },

  triggerStream: () => {
    const state = get();
    if (state.streamStatus === "streaming") return;
    const convId = state.activeConversationId;
    if (!convId) return;

    const assistantMessageId = `msg-${makeId()}`;
    const now = new Date().toISOString();
    const tokens = STREAM_COPY.split(" ");

    set((prev) => ({
      streamStatus: "streaming",
      streamMessageId: assistantMessageId,
      streamProgress: 0,
      streamHint: "Streaming reply…",
      conversations: withConversation(convId, (conversation) => ({
        ...conversation,
        messages: [
          ...conversation.messages,
          {
            id: assistantMessageId,
            role: "assistant",
            content: "",
            createdAt: now,
            streaming: true,
            toolInvocations: [
              {
                id: `tool-${makeId()}`,
                name: "Focus Coach",
                status: "streaming",
              } as ToolInvocation,
            ],
          },
        ],
      }))(prev.conversations),
    }));

    if (streamTimer && typeof window !== "undefined") {
      window.clearInterval(streamTimer);
    }

    let index = 0;
    if (typeof window === "undefined") {
      return;
    }

    streamTimer = window.setInterval(() => {
      index += 1;
      const progress = Math.min(1, index / tokens.length);
      const partial = tokens.slice(0, index).join(" ");

      set((prev) => ({
        streamProgress: progress,
        conversations: withConversation(convId, (conversation) => ({
          ...conversation,
          messages: conversation.messages.map((message) => {
            if (message.id !== assistantMessageId) return message;
            return {
              ...message,
              content: partial + (index < tokens.length ? " …" : ""),
              streaming: index < tokens.length,
              toolInvocations: message.toolInvocations?.map((tool) =>
                index < tokens.length
                  ? tool
                  : {
                      ...tool,
                      status: "complete",
                      finishedAt: new Date().toISOString(),
                      output:
                        "Structured focus loop delivered. Includes timers, context refuel prompts, and reflection checkpoints.",
                    },
              ),
            };
          }),
          lastUpdated: new Date().toISOString(),
          metrics: {
            ...conversation.metrics,
            latencyMs: 1320,
            tokens: 768,
            toolCount: 1,
          },
          suggestions:
            index < tokens.length
              ? conversation.suggestions
              : ["Generate summary", "Create follow-up task list", "Share recap"],
        }))(prev.conversations),
      }));

      if (index >= tokens.length) {
        if (streamTimer && typeof window !== "undefined") {
          window.clearInterval(streamTimer);
        }
        streamTimer = null;
        get().completeStream();
      }
    }, 70);
  },

  completeStream: () => {
    set({ streamStatus: "idle", streamProgress: 1, streamHint: "Ready" });
  },
}));
