"use client";

import { clsx } from "clsx";
import type { ReactNode } from "react";

export function IconButton({
  icon,
  label,
  onClick,
  subtle,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  subtle?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx("glass-button", subtle && "text-muted")}
      style={{
        padding: "0.35rem 0.65rem",
        borderRadius: "var(--radius-md)",
        fontSize: "0.85rem",
        gap: "0.35rem",
        background: subtle ? "rgba(255,255,255,0.08)" : undefined,
      }}
      aria-label={label}
      title={label}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
