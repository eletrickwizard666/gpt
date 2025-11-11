"use client";

import type { Conversation } from "../../types/conversation";
import { relativeTime } from "../../lib/mockData";

export function ConversationInspector({ conversation }: { conversation: Conversation }) {
  const assistantMessages = conversation.messages.filter((message) => message.role === "assistant");
  const userMessages = conversation.messages.filter((message) => message.role === "user");

  return (
    <section className="fade-card" style={{ padding: "1.1rem 1.35rem", borderRadius: "var(--radius-lg)" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.05rem" }}>Session overview</h2>
          <p className="text-muted" style={{ margin: "0.35rem 0 0", fontSize: "0.85rem" }}>
            Last touched {relativeTime(conversation.lastUpdated)} • {conversation.metrics.tokens} tokens processed
          </p>
        </div>
        <span className="badge" style={{ background: "rgba(255,255,255,0.06)", fontSize: "0.75rem" }}>
          {assistantMessages.length} replies
        </span>
      </header>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "0.85rem",
          marginTop: "1rem",
        }}
      >
        <InspectorMetric label="User prompts" value={`${userMessages.length}`} />
        <InspectorMetric label="Assistant replies" value={`${assistantMessages.length}`} />
        <InspectorMetric label="Tool calls" value={`${conversation.metrics.toolCount}`} />
        <InspectorMetric label="Latency" value={`${conversation.metrics.latencyMs} ms`} />
      </div>
      {conversation.suggestions.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <span className="text-muted" style={{ fontSize: "0.78rem", letterSpacing: "0.04em" }}>
            NEXT SUGGESTIONS
          </span>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
            {conversation.suggestions.map((suggestion) => (
              <span key={suggestion} className="badge" style={{ fontSize: "0.75rem" }}>
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function InspectorMetric({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="fade-card"
      style={{
        background: "rgba(255,255,255,0.05)",
        borderRadius: "var(--radius-md)",
        padding: "0.9rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.35rem",
      }}
    >
      <span className="text-muted" style={{ fontSize: "0.75rem", letterSpacing: "0.04em" }}>
        {label.toUpperCase()}
      </span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}
