"use client";

import { clsx } from "clsx";
import type { Message } from "../../types/conversation";
import { ToolInvocationCard } from "./ToolInvocationCard";
import { usePreferencesStore } from "../../store/preferencesStore";

const ROLE_META: Record<Message["role"], { label: string; accent: string; background: string }> = {
  system: {
    label: "System",
    accent: "linear-gradient(145deg, rgba(255,255,255,0.28), rgba(255,255,255,0.08))",
    background: "rgba(255,255,255,0.04)",
  },
  user: {
    label: "You",
    accent: "linear-gradient(145deg, rgba(130,160,255,0.25), rgba(90,123,255,0.45))",
    background: "rgba(130,160,255,0.12)",
  },
  assistant: {
    label: "ChatGPT",
    accent: "linear-gradient(145deg, rgba(113,230,255,0.2), rgba(122,160,255,0.35))",
    background: "rgba(122,160,255,0.15)",
  },
};

export function MessageBubble({ message }: { message: Message }) {
  const meta = ROLE_META[message.role];
  const denseMode = usePreferencesStore((state) => state.denseMode);
  const showTimestamps = usePreferencesStore((state) => state.showTimestamps);

  return (
    <article
      className={clsx("fade-card")}
      style={{
        padding: denseMode ? "1rem 1.1rem" : "1.4rem",
        borderRadius: "var(--radius-lg)",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: denseMode ? "0.6rem" : "0.75rem",
        background: "rgba(10,12,18,0.55)",
      }}
    >
      <header style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div
          style={{
            width: "2.6rem",
            height: "2.6rem",
            borderRadius: "var(--radius-md)",
            background: meta.accent,
            display: "grid",
            placeItems: "center",
            fontWeight: 600,
          }}
        >
          {meta.label.slice(0, 2)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          <span style={{ fontWeight: 600 }}>{meta.label}</span>
          <span className="text-muted" style={{ fontSize: "0.8rem" }}>
            {message.streaming
              ? "Streaming…"
              : showTimestamps
                ? new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : message.role === "assistant"
                  ? "Assistant reply"
                  : message.role === "user"
                    ? "Prompt" 
                    : "System prompt"}
          </span>
        </div>
      </header>
      <div style={{ fontSize: "0.98rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
        {message.content}
      </div>
      {message.toolInvocations?.map((tool) => (
        <ToolInvocationCard key={tool.id} invocation={tool} />
      ))}
      {message.role === "assistant" && (
        <footer style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <ActionPill icon="📋" label="Copy" compact={denseMode} />
          <ActionPill icon="🔄" label="Regenerate" compact={denseMode} />
          <ActionPill icon="🪄" label="Branch" compact={denseMode} />
          <ActionPill icon="🧠" label="Explain reasoning" compact={denseMode} />
          <ActionPill icon="👍" label="Good" subtle compact={denseMode} />
          <ActionPill icon="👎" label="Needs work" subtle compact={denseMode} />
        </footer>
      )}
    </article>
  );
}

function ActionPill({ icon, label, subtle, compact }: { icon: string; label: string; subtle?: boolean; compact?: boolean }) {
  return (
    <button
      className="glass-button"
      style={{
        background: subtle ? "rgba(255,255,255,0.04)" : "linear-gradient(140deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))",
        padding: compact ? "0.35rem 0.7rem" : "0.45rem 0.8rem",
        borderRadius: "999px",
        fontSize: "0.8rem",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
      }}
    >
      <span aria-hidden>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
