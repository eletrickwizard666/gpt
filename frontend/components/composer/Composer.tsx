"use client";

import { useRef, useState } from "react";
import type { ChangeEventHandler, KeyboardEvent as ReactKeyboardEvent } from "react";
import { useConversationStore } from "../../store/conversationStore";
import { usePreferencesStore } from "../../store/preferencesStore";
import { useUIStore } from "../../store/uiStore";

export function Composer() {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const sendPrompt = useConversationStore((state) => state.sendPrompt);
  const streamStatus = useConversationStore((state) => state.streamStatus);
  const denseMode = usePreferencesStore((state) => state.denseMode);
  const audioCues = usePreferencesStore((state) => state.audioCues);
  const openPalette = useUIStore((state) => state.openPalette);

  const handleSubmit = () => {
    if (!value.trim()) return;
    sendPrompt(value.trim());
    setValue("");
    if (audioCues && typeof window !== "undefined") {
      window.navigator?.vibrate?.(20);
    }
    setAttachments([]);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect: ChangeEventHandler<HTMLInputElement> = (event) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    setAttachments((prev) => [...prev, ...files.map((file) => file.name)]);
    event.target.value = "";
  };

  const removeAttachment = (name: string) => {
    setAttachments((prev) => prev.filter((attachment) => attachment !== name));
  };

  return (
    <div
      style={{
        padding: `1.2rem var(--spacing-page) 2rem`,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "linear-gradient(180deg, rgba(9,12,20,0.75) 0%, rgba(9,12,20,0.95) 100%)",
        backdropFilter: "blur(18px)",
      }}
    >
      <div
        className="fade-card"
        style={{
          padding: denseMode ? "0.9rem" : "1rem",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "0.85rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              className="glass-button"
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: "0.45rem 0.9rem", fontSize: "0.85rem" }}
            >
              <span aria-hidden>📎</span>
              Attach
            </button>
            <button
              className="glass-button"
              onClick={openPalette}
              style={{ padding: "0.45rem 0.9rem", fontSize: "0.85rem" }}
            >
              <span aria-hidden>⌘K</span>
              Commands
            </button>
          </div>
          <span className="text-muted" style={{ fontSize: "0.8rem" }}>
            Audio cues {audioCues ? "enabled" : "muted"}
          </span>
        </div>
        {attachments.length > 0 && (
          <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
            {attachments.map((attachment) => (
              <span
                key={attachment}
                className="badge"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78rem" }}
              >
                {attachment}
                <button
                  onClick={() => removeAttachment(attachment)}
                  style={{ background: "transparent", color: "inherit", fontSize: "0.75rem" }}
                  aria-label={`Remove ${attachment}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Ask ChatGPT to craft strategies, break down plans, or spin up workspace tools."
          rows={denseMode ? 2 : 3}
          onKeyDown={handleKeyDown}
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
        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
}
