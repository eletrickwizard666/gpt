"use client";

import { useMemo } from "react";
import { useConversationStore } from "../../store/conversationStore";
import { useTheme } from "../theme/ThemeProvider";
import { relativeTime } from "../../lib/mockData";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const activeConversation = useConversationStore((state) =>
    state.conversations.find((conversation) => conversation.id === state.activeConversationId),
  );
  const streamStatus = useConversationStore((state) => state.streamStatus);
  const streamProgress = useConversationStore((state) => state.streamProgress);
  const streamHint = useConversationStore((state) => state.streamHint);
  const triggerStream = useConversationStore((state) => state.triggerStream);

  const metrics = useMemo(() => activeConversation?.metrics, [activeConversation]);

  return (
    <header
      style={{
        padding: "1.25rem 2rem 0.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "sticky",
        top: 0,
        zIndex: 12,
        background: "linear-gradient(180deg, rgba(11, 13, 20, 0.9) 0%, rgba(11, 13, 20, 0.55) 100%)",
        backdropFilter: "blur(18px)",
      }}
    >
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <div className="badge" style={{ background: "rgba(130, 160, 255, 0.16)", color: "var(--accent)" }}>
              <span role="img" aria-label="pulse">
                🪄
              </span>
              {streamHint}
            </div>
            <span className="text-muted" style={{ fontSize: "0.8rem" }}>
              Updated {activeConversation ? relativeTime(activeConversation.lastUpdated) : "just now"}
            </span>
          </div>
          <h1 style={{ margin: "0.2rem 0 0", fontSize: "1.45rem", fontWeight: 600 }}>
            {activeConversation?.title ?? "Conversation"}
          </h1>
        </div>
        <div style={{ display: "flex", gap: "0.65rem", alignItems: "center" }}>
          <button
            className="glass-button"
            onClick={() => triggerStream()}
            disabled={streamStatus === "streaming"}
            style={{
              opacity: streamStatus === "streaming" ? 0.6 : 1,
            }}
          >
            <span role="img" aria-label="stream">
              🌊
            </span>
            Stream reply
          </button>
          <button className="glass-button" onClick={toggleTheme}>
            <span role="img" aria-label="theme">
              {theme === "dark" ? "🌞" : "🌙"}
            </span>
            {theme === "dark" ? "Light" : "Dark"} mode
          </button>
          <AvatarMenu />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "0.65rem",
          alignItems: "center",
          fontSize: "0.85rem",
          color: "var(--text-secondary)",
        }}
      >
        <span>Model: GPT-5 Codex</span>
        <span>•</span>
        <span>Stream status: {streamStatus}</span>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <div style={{ flex: 1, height: "4px", background: "rgba(130, 160, 255, 0.16)", borderRadius: "999px" }}>
            <div
              style={{
                width: `${Math.round(streamProgress * 100)}%`,
                height: "100%",
                borderRadius: "999px",
                background: "linear-gradient(90deg, #82a0ff 0%, #5a7bff 100%)",
                transition: "width 100ms linear",
              }}
            />
          </div>
          <span style={{ minWidth: "3rem", textAlign: "right" }}>{Math.round(streamProgress * 100)}%</span>
        </div>
        {metrics && (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <MetricPill label="Latency" value={`${metrics.latencyMs} ms`} />
            <MetricPill label="Tokens" value={`${metrics.tokens}`} />
            <MetricPill label="Tools" value={`${metrics.toolCount}`} />
          </div>
        )}
      </div>
    </header>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="badge" style={{ background: "rgba(255,255,255,0.08)", fontSize: "0.78rem", fontWeight: 500 }}>
      <span className="text-muted" style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </span>
      <span>{value}</span>
    </div>
  );
}

function AvatarMenu() {
  return (
    <button
      className="glass-button"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.4rem 0.65rem 0.4rem 0.4rem",
      }}
    >
      <span
        aria-hidden
        style={{
          width: "2.4rem",
          height: "2.4rem",
          borderRadius: "999px",
          background: "linear-gradient(145deg, rgba(255, 199, 142, 0.8), rgba(255, 132, 132, 0.8))",
          display: "grid",
          placeItems: "center",
          fontWeight: 600,
        }}
      >
        JL
      </span>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Jordan Lee</span>
        <span className="text-muted" style={{ fontSize: "0.7rem" }}>
          Workspace: Studio Lab
        </span>
      </div>
      <span aria-hidden>▾</span>
    </button>
  );
}
