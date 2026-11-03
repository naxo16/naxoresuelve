"use client";

import React from "react";

interface NeonBrandSpanProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function NeonBrandSpan({
  className = "",
  size = "md",
}: NeonBrandSpanProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  }[size];

  return (
    <>
      <style>{`
        @keyframes neon-flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            opacity: 1;
            text-shadow: 
              0 0 4px #00aaff,
              0 0 10px #00aaff,
              0 0 20px #0055ff,
              0 0 40px #0055ff,
              0 0 80px #0022aa;
          }
          20%, 24%, 55% {
            opacity: 0.22;
            text-shadow: none;
          }
        }
        .dmc-neon-active {
          font-family: var(--font-cinzel), 'Cinzel', serif !important;
          font-weight: 900 !important;
          color: #080f1a !important;
          text-shadow: 
            0 0 5px #00aaff,
            0 0 10px #00aaff,
            0 0 20px #0055ff,
            0 0 40px #0055ff,
            0 0 80px #0022aa !important;
          filter: drop-shadow(0 2px 4px rgba(0, 25, 70, 0.65));
          
          animation: neon-flicker 3s infinite alternate !important;
          display: inline-block;
          letter-spacing: 0.05em;
          transition: text-shadow 0.25s ease, transform 0.2s ease;
        }
        .dmc-neon-active:hover {
          text-shadow: 
            0 0 6px #00d4ff,
            0 0 14px #00aaff,
            0 0 28px #0066ff,
            0 0 55px #0044ff,
            0 0 95px #0022cc !important;
          transform: scale(1.02);
        }
      `}</style>
      <span
        className={`inline-flex items-center tracking-tight font-black ${sizeClasses} select-none ${className}`}
      >
        <span
          className="dmc-neon-span dmc-neon-active"
          style={{
            fontFamily: "var(--font-cinzel), 'Cinzel', serif",
            fontWeight: 900,
            color: "#0c1b33",
            textShadow:
              "0 0 5px #00aaff, 0 0 10px #00aaff, 0 0 20px #0055ff, 0 0 40px #0055ff, 0 0 80px #0022aa",
            animation: "neon-flicker 3s infinite alternate",
            letterSpacing: "0.05em",
            display: "inline-block",
          }}
        >
          Naxo Resuelve
        </span>
      </span>
    </>
  );
}
