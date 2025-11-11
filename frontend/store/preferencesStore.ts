"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type PreferencesState = {
  denseMode: boolean;
  showTimestamps: boolean;
  audioCues: boolean;
  focusMode: boolean;
  setDenseMode: (value: boolean) => void;
  setShowTimestamps: (value: boolean) => void;
  setAudioCues: (value: boolean) => void;
  setFocusMode: (value: boolean) => void;
  reset: () => void;
};

const DEFAULTS = {
  denseMode: false,
  showTimestamps: true,
  audioCues: false,
  focusMode: false,
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setDenseMode: (value) => set({ denseMode: value }),
      setShowTimestamps: (value) => set({ showTimestamps: value }),
      setAudioCues: (value) => set({ audioCues: value }),
      setFocusMode: (value) => set({ focusMode: value }),
      reset: () => set({ ...DEFAULTS }),
    }),
    { name: "chatgpt-2025-preferences" },
  ),
);
