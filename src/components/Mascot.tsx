"use client";
import { useEffect, useState } from "react";

type Mood = "happy" | "thinking" | "cheer" | "idle";

interface MascotProps {
  message?: string;
  mood?: Mood;
  size?: number;
}

export default function Mascot({ message, mood = "idle", size = 80 }: MascotProps) {
  const [blink, setBlink] = useState(false);
  const [bounce, setBounce] = useState(false);

  // Blink every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  // Bounce when message changes
  useEffect(() => {
    if (message) {
      setBounce(true);
      setTimeout(() => setBounce(false), 600);
    }
  }, [message]);

  const eyeH = blink ? 1 : 4;
  const s = size;
  const mouthMap: Record<Mood, string> = {
    happy: "M 30 52 Q 40 60 50 52",
    thinking: "M 33 54 L 47 54",
    cheer: "M 28 50 Q 40 64 52 50",
    idle: "M 32 52 Q 40 58 48 52",
  };

  return (
    <div className="flex items-start gap-3">
      {/* Character */}
      <div
        className="flex-shrink-0"
        style={{
          width: s,
          height: s + 10,
          animation: bounce ? "mascotBounce 0.6s ease" : "mascotFloat 3s ease-in-out infinite",
        }}
      >
        <svg viewBox="0 0 80 90" width={s} height={s + 10}>
          {/* Body - Diamond shape */}
          <polygon
            points="40,8 68,40 40,72 12,40"
            fill="url(#diamondGrad)"
            stroke="#635bff"
            strokeWidth="2"
          />
          {/* Helmet */}
          <ellipse cx="40" cy="18" rx="22" ry="10" fill="#ff9f43" />
          <rect x="18" y="14" width="44" height="8" rx="2" fill="#ff9f43" />
          <rect x="36" y="6" width="8" height="10" rx="2" fill="#ffb347" />
          <line x1="22" y1="18" x2="58" y2="18" stroke="#e67e22" strokeWidth="1.5" />
          {/* Shine on helmet */}
          <ellipse cx="30" cy="14" rx="6" ry="3" fill="rgba(255,255,255,0.3)" />

          {/* Face */}
          {/* Eyes */}
          <ellipse cx="32" cy="38" rx="4" ry={eyeH} fill="#0a2540" />
          <ellipse cx="48" cy="38" rx="4" ry={eyeH} fill="#0a2540" />
          {/* Eye shine */}
          {!blink && (
            <>
              <circle cx="33.5" cy="36.5" r="1.5" fill="white" />
              <circle cx="49.5" cy="36.5" r="1.5" fill="white" />
            </>
          )}
          {/* Cheeks */}
          <ellipse cx="24" cy="44" rx="5" ry="3" fill="rgba(233,69,96,0.2)" />
          <ellipse cx="56" cy="44" rx="5" ry="3" fill="rgba(233,69,96,0.2)" />
          {/* Mouth */}
          <path d={mouthMap[mood]} fill="none" stroke="#0a2540" strokeWidth="2" strokeLinecap="round" />

          {/* Arms */}
          {mood === "cheer" ? (
            <>
              <line x1="14" y1="38" x2="4" y2="24" stroke="#635bff" strokeWidth="3" strokeLinecap="round" />
              <line x1="66" y1="38" x2="76" y2="24" stroke="#635bff" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <>
              <line x1="14" y1="38" x2="6" y2="48" stroke="#635bff" strokeWidth="3" strokeLinecap="round" />
              <line x1="66" y1="38" x2="74" y2="48" stroke="#635bff" strokeWidth="3" strokeLinecap="round" />
            </>
          )}

          {/* Sparkle effect when cheering */}
          {mood === "cheer" && (
            <>
              <circle cx="6" cy="20" r="2" fill="#ffd700" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="0.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="74" cy="20" r="2" fill="#ffd700" opacity="0.8">
                <animate attributeName="opacity" values="0.2;0.8;0.2" dur="0.8s" repeatCount="indefinite" />
              </circle>
            </>
          )}

          <defs>
            <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#635bff" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Speech bubble */}
      {message && (
        <div className="relative bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text max-w-md animate-fadeIn">
          {/* Bubble tail */}
          <div className="absolute left-[-8px] top-4 w-0 h-0"
            style={{ borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderRight: "8px solid var(--border)" }} />
          <div className="absolute left-[-6px] top-4 w-0 h-0"
            style={{ borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderRight: "8px solid var(--bg2)" }} />
          {message}
        </div>
      )}

      <style jsx>{`
        @keyframes mascotFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes mascotBounce {
          0% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-8px) scale(1.05); }
          50% { transform: translateY(0) scale(0.95); }
          70% { transform: translateY(-3px) scale(1.02); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease;
        }
      `}</style>
    </div>
  );
}
