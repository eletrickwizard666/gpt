"use client";

import { create } from "zustand";

type UIState = {
  isPaletteOpen: boolean;
  isSettingsOpen: boolean;
  paletteQuery: string;
  openPalette: () => void;
  closePalette: () => void;
  setPaletteQuery: (value: string) => void;
  openSettings: () => void;
  closeSettings: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  isPaletteOpen: false,
  isSettingsOpen: false,
  paletteQuery: "",
  openPalette: () => set({ isPaletteOpen: true, paletteQuery: "" }),
  closePalette: () => set({ isPaletteOpen: false, paletteQuery: "" }),
  setPaletteQuery: (value) => set({ paletteQuery: value }),
  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),
}));
