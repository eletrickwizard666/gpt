"use client";

import { useMemo, useState } from "react";
import { useConversationStore } from "../../store/conversationStore";
import { relativeTime } from "../../lib/mockData";
import type { Conversation } from "../../types/conversation";
import { clsx } from "clsx";

export function Sidebar() {
  const conversations = useConversationStore((state) => state.conversations);
  const activeConversationId = useConversationStore((state) => state.activeConversationId);
  const selectConversation = useConversationStore((state) => state.selectConversation);
  const createConversation = useConversationStore((state) => state.createConversation);
  const renameConversation = useConversationStore((state) => state.renameConversation);
  const deleteConversation = useConversationStore((state) => state.deleteConversation);

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredConversations = useMemo(() => {
    if (!search) return conversations;
    return conversations.filter((conversation) => conversation.title.toLowerCase().includes(search.toLowerCase()));
  }, [conversations, search]);

  return (
    <aside className="sidebar-column" aria-label="Conversation navigation">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "1.25rem 1.4rem 1.6rem",
          gap: "1.5rem",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button className="glass-button" onClick={() => createConversation()}>
            <span style={{ fontWeight: 600 }}>+ New conversation</span>
          </button>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.06)",
              padding: "0.4rem 0.75rem",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
            <input
              aria-label="Search conversations"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-primary)",
                padding: "0.35rem 0.25rem",
                outline: "none",
                flex: 1,
                fontSize: "0.9rem",
              }}
            />
          </div>
        </div>

        <nav
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "0.35rem",
          }}
        >
          {filteredConversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === activeConversationId}
              onSelect={() => selectConversation(conversation.id)}
              onRename={(title) => renameConversation(conversation.id, title)}
              onDelete={() => deleteConversation(conversation.id)}
              isEditing={editingId === conversation.id}
              onRequestEdit={() => setEditingId(conversation.id)}
              onFinishEdit={() => setEditingId(null)}
            />
          ))}
          {filteredConversations.length === 0 && (
            <div className="fade-card" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
              <p style={{ margin: 0, fontWeight: 600 }}>No matches</p>
              <p className="text-muted" style={{ marginTop: "0.4rem", fontSize: "0.85rem" }}>
                Try a different search keyword or create a new conversation to keep momentum going.
              </p>
            </div>
          )}
        </nav>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          <div className="glow-divider" />
          <div>
            <div className="badge" style={{ marginBottom: "0.35rem" }}>
              <span role="img" aria-label="sparkle">
                ✨
              </span>
              Workspaces
            </div>
            <div className="text-muted" style={{ fontSize: "0.8rem" }}>
              Switch between personal, research, and client workspaces. Multi-account support ships next.
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

type ConversationListItemProps = {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
  isEditing: boolean;
  onRequestEdit: () => void;
  onFinishEdit: () => void;
};

function ConversationListItem({
  conversation,
  isActive,
  onSelect,
  onRename,
  onDelete,
  isEditing,
  onRequestEdit,
  onFinishEdit,
}: ConversationListItemProps) {
  const [value, setValue] = useState(conversation.title);
  const latestMessage = conversation.messages[conversation.messages.length - 1];
  const preview = latestMessage?.content ?? "";
  const truncatedPreview = preview.length > 96 ? `${preview.slice(0, 96)}…` : preview;

  return (
    <div
      className={clsx("fade-card", isActive && "shadow-soft")}
      style={{
        display: "flex",
        gap: "0.75rem",
        alignItems: "flex-start",
        padding: "0.85rem 1rem",
        borderRadius: "var(--radius-md)",
        border: isActive ? "1px solid rgba(129,160,255,0.42)" : "1px solid rgba(255,255,255,0.04)",
        background: isActive ? "var(--surface-selected)" : "rgba(10, 12, 18, 0.55)",
        cursor: "pointer",
        transition: "background 160ms var(--transition-snappy)",
      }}
      onClick={() => {
        if (!isEditing) onSelect();
      }}
    >
      <div
        aria-hidden
        style={{
          width: "2.2rem",
          height: "2.2rem",
          borderRadius: "var(--radius-sm)",
          background: "linear-gradient(145deg, rgba(118,138,255,0.2), rgba(45,64,164,0.55))",
          display: "grid",
          placeItems: "center",
          fontWeight: 600,
        }}
      >
        {conversation.title.slice(0, 1).toUpperCase() || "C"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {isEditing ? (
          <input
            autoFocus
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onRename(value.trim() || "Untitled conversation");
                onFinishEdit();
              }
            }}
            onBlur={() => {
              onRename(value.trim() || "Untitled conversation");
              onFinishEdit();
            }}
            style={{
              width: "100%",
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              color: "var(--text-primary)",
              padding: "0.4rem 0.55rem",
              fontSize: "0.95rem",
            }}
          />
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {conversation.title}
              </p>
              <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                {relativeTime(conversation.lastUpdated)}
              </span>
            </div>
            <p className="text-muted" style={{ margin: "0.45rem 0 0", fontSize: "0.85rem", lineHeight: 1.45 }}>
              {truncatedPreview}
            </p>
          </>
        )}
      </div>
      {!isEditing && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <button
            className="text-muted"
            aria-label="Rename conversation"
            onClick={(event) => {
              event.stopPropagation();
              onRequestEdit();
            }}
          >
            ✏️
          </button>
          <button
            className="text-muted"
            aria-label="Delete conversation"
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
}
