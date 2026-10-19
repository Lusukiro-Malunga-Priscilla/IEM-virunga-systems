// src/components/PageStats.tsx
import React from "react";

export interface PageStatItem {
  label: string;
  value: string | number;
  tone?: "default" | "success" | "warning" | "danger";
}

interface Props {
  items: PageStatItem[];
}

const TONE: Record<NonNullable<PageStatItem["tone"]>, { bg: string; color: string; border: string }> = {
  default: { bg: "#fff",    color: "#0B1B3A", border: "#E4E8EF" },
  success: { bg: "#E6F4EA", color: "#14532D", border: "#BFE3CA" },
  warning: { bg: "#FEF3C7", color: "#92400E", border: "#FDE68A" },
  danger:  { bg: "#FDECEC", color: "#9B2C2C", border: "#F3C6C6" },
};

export default function PageStats({ items }: Props) {
  if (!items.length) return null;
  return (
    <div className="ps-grid">
      <style>{`
        .ps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
          margin-bottom: 18px;
        }
        .ps-card {
          border-radius: 10px;
          padding: 14px 16px;
          border: 1px solid;
          font-family: 'IBM Plex Sans', system-ui, sans-serif;
        }
        .ps-card .k {
          font-size: 11.5px; font-weight: 600;
          letter-spacing: .04em; text-transform: uppercase;
          opacity: .72;
        }
        .ps-card .v {
          font-size: 22px; font-weight: 700; margin-top: 4px;
        }
      `}</style>
      {items.map((it, i) => {
        const tone = TONE[it.tone || "default"];
        return (
          <div
            key={i}
            className="ps-card"
            style={{ background: tone.bg, color: tone.color, borderColor: tone.border }}
          >
            <div className="k">{it.label}</div>
            <div className="v">{it.value}</div>
          </div>
        );
      })}
    </div>
  );
}