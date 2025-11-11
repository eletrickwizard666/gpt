"use client";

import { useMemo } from "react";
import { useConversationStore } from "../../store/conversationStore";
import { MessageBubble } from "./MessageBubble";

export function ChatTranscript() {
  const conversation = useConversationStore((state) =>
    state.conversations.find((conv) => conv.id === state.activeConversationId),
  );
  const queueSuggestion = useConversationStore((state) => state.queueSuggestion);

  const suggestions = useMemo(() => conversation?.suggestions ?? [], [conversation]);

  if (!conversation) {
    return (
      <div style={{ padding: "2rem", color: "var(--text-secondary)" }}>
        Select or create a conversation to begin exploring the workspace.
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "1.75rem 2rem 2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}
    >
      {conversation.messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {suggestions.length > 0 && (
        <div className="fade-card" style={{ padding: "1.2rem", borderRadius: "var(--radius-lg)", marginTop: "0.5rem" }}>
          <p style={{ margin: 0, fontWeight: 600 }}>Suggested next steps</p>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                className="glass-button"
                style={{
                  borderRadius: "999px",
                  padding: "0.45rem 0.95rem",
                  fontSize: "0.85rem",
                }}
                onClick={() => queueSuggestion(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
