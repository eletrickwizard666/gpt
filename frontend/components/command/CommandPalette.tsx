"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { useConversationStore } from "../../store/conversationStore";
import { useTheme } from "../theme/ThemeProvider";
import { useUIStore } from "../../store/uiStore";
import { usePreferencesStore } from "../../store/preferencesStore";

type PaletteCommand = {
  id: string;
  title: string;
  description?: string;
  badge?: string;
  onSelect: () => void;
};

export function CommandPalette() {
  const {
    isPaletteOpen,
    closePalette,
    openPalette,
    paletteQuery,
    setPaletteQuery,
  } = useUIStore((state) => ({
    isPaletteOpen: state.isPaletteOpen,
    closePalette: state.closePalette,
    openPalette: state.openPalette,
    paletteQuery: state.paletteQuery,
    setPaletteQuery: state.setPaletteQuery,
  }));
  const conversations = useConversationStore((state) => state.conversations);
  const selectConversation = useConversationStore((state) => state.selectConversation);
  const createConversation = useConversationStore((state) => state.createConversation);
  const triggerStream = useConversationStore((state) => state.triggerStream);
  const streamStatus = useConversationStore((state) => state.streamStatus);
  const { theme, toggleTheme } = useTheme();
  const openSettings = useUIStore((state) => state.openSettings);
  const focusMode = usePreferencesStore((state) => state.focusMode);
  const toggleFocusMode = usePreferencesStore((state) => state.setFocusMode);

  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "k" || event.key === "K") && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        if (isPaletteOpen) {
          closePalette();
        } else {
          openPalette();
        }
      }

      if (event.key === "Escape" && isPaletteOpen) {
        closePalette();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closePalette, isPaletteOpen, openPalette]);

  useEffect(() => {
    if (isPaletteOpen) {
      setHighlightedIndex(0);
      const timeout = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [isPaletteOpen]);

  useEffect(() => {
    if (!isPaletteOpen) {
      setPaletteQuery("");
    }
  }, [isPaletteOpen, setPaletteQuery]);

  const commands = useMemo<PaletteCommand[]>(() => {
    const recents = conversations
      .slice()
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .map((conversation) => ({
        id: conversation.id,
        title: conversation.title,
        description: `${conversation.messages.length} messages • Updated ${new Date(
          conversation.lastUpdated,
        ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        badge: "Conversation",
        onSelect: () => {
          selectConversation(conversation.id);
          closePalette();
        },
      }));

    const actionCommands: PaletteCommand[] = [
      {
        id: "action-new", 
        title: "New conversation",
        description: "Spin up a fresh workspace thread",
        badge: "Action",
        onSelect: () => {
          const id = createConversation();
          selectConversation(id);
          closePalette();
        },
      },
      {
        id: "action-theme",
        title: `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
        description: "Toggle workspace ambiance instantly",
        badge: "Appearance",
        onSelect: () => {
          toggleTheme();
          closePalette();
        },
      },
      {
        id: "action-stream",
        title: streamStatus === "streaming" ? "Streaming in progress" : "Stream active reply",
        description: streamStatus === "streaming" ? "Assistant is already streaming" : "Trigger an on-demand response",
        badge: "Live",
        onSelect: () => {
          if (streamStatus !== "streaming") {
            triggerStream();
          }
          closePalette();
        },
      },
      {
        id: "action-settings",
        title: "Open workspace settings",
        description: "Adjust preferences, density, and cues",
        badge: "Preferences",
        onSelect: () => {
          closePalette();
          openSettings();
        },
      },
      {
        id: "action-focus",
        title: `${focusMode ? "Disable" : "Enable"} focus mode`,
        description: "Streamline transcript spacing and reduce distractions",
        badge: "Mode",
        onSelect: () => {
          toggleFocusMode(!focusMode);
          closePalette();
        },
      },
    ];

    const all = [...actionCommands, ...recents];
    if (!paletteQuery.trim()) return all;
    const normalized = paletteQuery.trim().toLowerCase();
    return all.filter((command) =>
      [command.title, command.description ?? "", command.badge ?? ""].some((value) =>
        value.toLowerCase().includes(normalized),
      ),
    );
  }, [
    closePalette,
    conversations,
    createConversation,
    focusMode,
    openSettings,
    paletteQuery,
    selectConversation,
    streamStatus,
    theme,
    toggleFocusMode,
    toggleTheme,
    triggerStream,
  ]);

  const handleKeyNavigation = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, commands.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      commands[highlightedIndex]?.onSelect();
    }
  };

  if (!isPaletteOpen) {
    return null;
  }

  return createPortal(
    <div className="modal-overlay" role="presentation" onClick={closePalette}>
      <div
        className="command-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="command-search">
          <span aria-hidden className="command-icon">
            🔍
          </span>
          <input
            ref={inputRef}
            value={paletteQuery}
            onChange={(event) => setPaletteQuery(event.target.value)}
            onKeyDown={handleKeyNavigation}
            placeholder="Jump to conversation or run an action…"
            aria-label="Command palette search"
          />
          <span aria-hidden className="command-hint">
            Esc to close
          </span>
        </div>
        <div className="command-results" role="listbox">
          {commands.length === 0 && (
            <div className="command-empty">No matches yet. Try a different keyword.</div>
          )}
          {commands.map((command, index) => (
            <button
              key={command.id}
              role="option"
              aria-selected={index === highlightedIndex}
              className={index === highlightedIndex ? "command-option active" : "command-option"}
              onClick={() => command.onSelect()}
            >
              <div className="command-option-main">
                <span className="command-title">{command.title}</span>
                {command.description && <span className="command-description">{command.description}</span>}
              </div>
              {command.badge && <span className="command-badge">{command.badge}</span>}
            </button>
          ))}
        </div>
        <footer className="command-footer">
          <span>⌘K / Ctrl+K</span>
          <span>Navigate with ↑ ↓</span>
          <span>Enter to run</span>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
