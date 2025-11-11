"use client";

import { useState } from "react";
import { useConversationStore } from "../../store/conversationStore";

export function Composer() {
  const [value, setValue] = useState("");
  const sendPrompt = useConversationStore((state) => state.sendPrompt);
  const streamStatus = useConversationStore((state) => state.streamStatus);

  const handleSubmit = () => {
    if (!value.trim()) return;
    sendPrompt(value.trim());
    setValue("");
  };

  return (
    <div
      style={{
        padding: "1.2rem 2rem 2rem",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "linear-gradient(180deg, rgba(9,12,20,0.75) 0%, rgba(9,12,20,0.95) 100%)",
        backdropFilter: "blur(18px)",
      }}
    >
      <div
        className="fade-card"
        style={{
          padding: "1rem",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "0.85rem",
        }}
      >
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Ask ChatGPT to craft strategies, break down plans, or spin up workspace tools."
          rows={3}
          style={{
            resize: "none",
            background: "rgba(0,0,0,0.3)",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "var(--text-primary)",
            padding: "0.85rem 1rem",
            fontSize: "1rem",
            fontFamily: "var(--font-sans)",
            outline: "none",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="text-muted" style={{ fontSize: "0.85rem" }}>
            Shift + Enter for newline. Streaming pauses automatically when you edit.
          </div>
          <button
            className="glass-button"
            onClick={handleSubmit}
            disabled={streamStatus === "streaming"}
            style={{
              opacity: streamStatus === "streaming" ? 0.6 : 1,
              padding: "0.65rem 1.25rem",
              borderRadius: "var(--radius-md)",
              fontWeight: 600,
              letterSpacing: "0.01em",
            }}
          >
            <span role="img" aria-label="send">
              🚀
            </span>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
