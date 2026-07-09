import React from "react";

/**
 * SVG circular progress ring.
 * @param {number} percent   0–100
 * @param {number} size      diameter in px (default 160)
 * @param {number} stroke    stroke width (default 12)
 * @param {string} color     hex/css color of the progress arc
 */
export default function ScoreRing({ percent, size = 160, stroke = 12, color = "#8b5cf6" }) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;
  const center = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label={`Score: ${percent}%`}
    >
      {/* Background track */}
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth={stroke}
      />
      {/* Progress arc */}
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${center} ${center})`}
        style={{
          transition: "stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          filter: `drop-shadow(0 0 8px ${color}88)`,
        }}
      />
    </svg>
  );
}
