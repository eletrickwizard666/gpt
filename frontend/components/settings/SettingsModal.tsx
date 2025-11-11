"use client";

import { createPortal } from "react-dom";
import { useEffect } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { usePreferencesStore } from "../../store/preferencesStore";
import { useUIStore } from "../../store/uiStore";

export function SettingsModal() {
  const { isSettingsOpen, closeSettings } = useUIStore((state) => ({
    isSettingsOpen: state.isSettingsOpen,
    closeSettings: state.closeSettings,
  }));
  const { theme, setTheme } = useTheme();
  const {
    denseMode,
    audioCues,
    showTimestamps,
    focusMode,
    setDenseMode,
    setAudioCues,
    setShowTimestamps,
    setFocusMode,
    resetPreferences,
  } = usePreferencesStore((state) => ({
    denseMode: state.denseMode,
    audioCues: state.audioCues,
    showTimestamps: state.showTimestamps,
    focusMode: state.focusMode,
    setDenseMode: state.setDenseMode,
    setAudioCues: state.setAudioCues,
    setShowTimestamps: state.setShowTimestamps,
    setFocusMode: state.setFocusMode,
    resetPreferences: state.reset,
  }));

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.density = denseMode ? "compact" : "comfortable";
  }, [denseMode]);

  useEffect(() => {
    document.body.dataset.focusMode = focusMode ? "active" : "inactive";
  }, [focusMode]);

  if (!isSettingsOpen) {
    return null;
  }

  return createPortal(
    <div className="modal-overlay" role="presentation" onClick={closeSettings}>
      <div
        className="settings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="settings-header">
          <div>
            <h2 id="settings-title">Workspace preferences</h2>
            <p className="text-muted">
              Tune the ChatGPT workspace clone to match your ergonomics and sensory cues.
            </p>
          </div>
          <button className="glass-button" onClick={closeSettings}>
            Close
          </button>
        </header>

        <section className="settings-section">
          <h3>Appearance</h3>
          <div className="settings-list">
            <SettingToggle
              label="Density"
              description="Compact mode reduces padding and increases transcript throughput."
              value={denseMode}
              onChange={setDenseMode}
              trueLabel="Compact"
              falseLabel="Comfortable"
            />
            <div className="setting-choice-group">
              <span className="choice-label">Theme</span>
              <div className="choice-buttons">
                <button
                  className={theme === "dark" ? "choice active" : "choice"}
                  onClick={() => setTheme("dark")}
                >
                  Dark
                </button>
                <button
                  className={theme === "light" ? "choice active" : "choice"}
                  onClick={() => setTheme("light")}
                >
                  Light
                </button>
              </div>
            </div>
            <SettingToggle
              label="Focus mode"
              description="Hide ambient chrome and highlight core conversation context."
              value={focusMode}
              onChange={setFocusMode}
              trueLabel="On"
              falseLabel="Off"
            />
          </div>
        </section>

        <section className="settings-section">
          <h3>Conversation</h3>
          <div className="settings-list">
            <SettingToggle
              label="Timestamps"
              description="Display timestamps beside each message bubble."
              value={showTimestamps}
              onChange={setShowTimestamps}
              trueLabel="Visible"
              falseLabel="Hidden"
            />
            <SettingToggle
              label="Audio cues"
              description="Vibrate and play a subtle cue when messages send."
              value={audioCues}
              onChange={setAudioCues}
              trueLabel="Enabled"
              falseLabel="Muted"
            />
          </div>
        </section>

        <footer className="settings-footer">
          <button className="glass-button" onClick={resetPreferences}>
            Reset to defaults
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

type SettingToggleProps = {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
  trueLabel: string;
  falseLabel: string;
};

function SettingToggle({ label, description, value, onChange, trueLabel, falseLabel }: SettingToggleProps) {
  return (
    <button
      className={value ? "setting-toggle active" : "setting-toggle"}
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
    >
      <div className="toggle-status" aria-hidden>
        <span className="toggle-thumb" />
        <span className="toggle-label">{value ? trueLabel : falseLabel}</span>
      </div>
      <div className="toggle-copy">
        <span className="toggle-title">{label}</span>
        <span className="toggle-description">{description}</span>
      </div>
    </button>
  );
}
