"use client";

import { useMemo } from "react";
import { useConversationStore } from "../../store/conversationStore";
import { useTheme } from "../theme/ThemeProvider";
import { relativeTime } from "../../lib/mockData";
import { IconButton } from "../common/IconButton";
import { useUIStore } from "../../store/uiStore";
import { usePreferencesStore } from "../../store/preferencesStore";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const activeConversation = useConversationStore((state) =>
    state.conversations.find((conversation) => conversation.id === state.activeConversationId),
  );
  const streamStatus = useConversationStore((state) => state.streamStatus);
  const streamProgress = useConversationStore((state) => state.streamProgress);
  const streamHint = useConversationStore((state) => state.streamHint);
  const triggerStream = useConversationStore((state) => state.triggerStream);
  const openPalette = useUIStore((state) => state.openPalette);
  const openSettings = useUIStore((state) => state.openSettings);
  const focusMode = usePreferencesStore((state) => state.focusMode);

  const metrics = useMemo(() => activeConversation?.metrics, [activeConversation]);

  return (
    <header
      style={{
        padding: `calc(var(--spacing-page) * 0.8) var(--spacing-page) calc(var(--spacing-page) * 0.55)`,
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
          {focusMode && (
            <p className="text-muted" style={{ margin: "0.35rem 0 0", fontSize: "0.8rem" }}>
              Focus mode trims supporting chrome so you can stay in the zone.
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.65rem", alignItems: "center" }}>
          <IconButton
            icon={<span aria-hidden>⌘K</span>}
            label="Quick find"
            onClick={openPalette}
          />
          <IconButton
            icon={<span aria-hidden>⚙️</span>}
            label="Settings"
            onClick={openSettings}
          />
          <IconButton
            icon={<span aria-hidden>{theme === "dark" ? "🌞" : "🌙"}</span>}
            label={theme === "dark" ? "Light mode" : "Dark mode"}
            onClick={toggleTheme}
          />
          <IconButton
            icon={<span aria-hidden>{streamStatus === "streaming" ? "⏳" : "🌊"}</span>}
            label={streamStatus === "streaming" ? "Streaming" : "Stream reply"}
            onClick={() => triggerStream()}
            subtle={streamStatus === "streaming"}
          />
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
  const openSettings = useUIStore((state) => state.openSettings);
  return (
    <button
      className="glass-button"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.4rem 0.65rem 0.4rem 0.4rem",
      }}
      onClick={openSettings}
      title="Open workspace settings"
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
