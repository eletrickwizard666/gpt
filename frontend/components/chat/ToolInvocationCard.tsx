"use client";

import type { ToolInvocation } from "../../types/conversation";

const STATUS_META: Record<ToolInvocation["status"], { label: string; color: string }> = {
  queued: { label: "Queued", color: "var(--text-muted)" },
  running: { label: "Running", color: "var(--warning)" },
  streaming: { label: "Streaming", color: "var(--accent)" },
  complete: { label: "Complete", color: "var(--success)" },
  failed: { label: "Failed", color: "var(--danger)" },
};

export function ToolInvocationCard({ invocation }: { invocation: ToolInvocation }) {
  const meta = STATUS_META[invocation.status];

  return (
    <section
      className="fade-card"
      style={{
        padding: "1rem 1.15rem",
        borderRadius: "var(--radius-md)",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: "0.55rem",
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 600 }}>{invocation.name}</span>
          <span className="text-muted" style={{ fontSize: "0.78rem" }}>
            {invocation.startedAt ? `Started ${new Date(invocation.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Pending"}
          </span>
        </div>
        <span style={{ color: meta.color, fontWeight: 600 }}>{meta.label}</span>
      </header>
      {invocation.output ? (
        <pre
          style={{
            margin: 0,
            whiteSpace: "pre-wrap",
            fontFamily: "var(--font-sans)",
            background: "rgba(0,0,0,0.25)",
            borderRadius: "var(--radius-sm)",
            padding: "0.75rem",
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
          }}
        >
          {invocation.output}
        </pre>
      ) : (
        <div className="text-muted" style={{ fontSize: "0.85rem" }}>
          Awaiting tool response. We'll surface telemetry and structured outputs in-line when available.
        </div>
      )}
    </section>
  );
}
