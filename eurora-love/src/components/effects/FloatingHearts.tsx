"use client";

import { useEffect, useState } from "react";

interface Heart {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  emoji: string;
  hue: number;
}

const EMOJIS = ["♥", "❤︎", "✦"];

function generateHearts(count: number): Heart[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 10 + Math.random() * 20,
    duration: 12 + Math.random() * 16,
    delay: Math.random() * 14,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    hue: Math.random() > 0.7 ? 38 : 340,
  }));
}

export default function FloatingHearts({
  count = 14,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  const [hearts, setHearts] = useState<Heart[] | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHearts(generateHearts(count));
  }, [count]);

  if (!hearts) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden z-0 ${className}`}
      aria-hidden
    >
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute animate-float-hearts"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            color: h.hue === 38 ? "#f6c986" : "#ff2d6a",
            opacity: 0.14,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}
