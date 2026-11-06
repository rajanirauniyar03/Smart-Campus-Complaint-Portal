import React from 'react';

export default function GtuEmblem({ className = 'w-10 h-10', showText = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`relative shrink-0 ${className}`}>
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* Outer Gear / Cog Wheel for Technological University */}
          <circle cx="60" cy="60" r="56" fill="#092244" stroke="#c88a1e" strokeWidth="3" />
          
          {/* Outer Cog Notches */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <rect
              key={deg}
              x="57"
              y="2"
              width="6"
              height="8"
              rx="1.5"
              fill="#c88a1e"
              transform={`rotate(${deg} 60 60)`}
            />
          ))}

          {/* Inner Gold Ring */}
          <circle cx="60" cy="60" r="48" stroke="#c88a1e" strokeWidth="1.5" strokeDasharray="3 2" />
          <circle cx="60" cy="60" r="44" fill="#0d2b52" />

          {/* Central Sunrays / Tech Lines */}
          <path
            d="M60 20 L60 30 M60 90 L60 100 M20 60 L30 60 M90 60 L100 60"
            stroke="#c88a1e"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Open Book of Academic Knowledge */}
          <path
            d="M36 68 C44 64 54 65 60 68 C66 65 76 64 84 68 L84 52 C76 48 66 49 60 52 C54 49 44 48 36 52 Z"
            fill="#ffffff"
            stroke="#092244"
            strokeWidth="1.5"
          />
          <path d="M60 52 L60 68" stroke="#092244" strokeWidth="1.5" />

          {/* University Torch / Flame of Enlightenment */}
          <path
            d="M60 34 C64 40 66 44 63 48 C60 50 56 47 57 44 C54 48 66 50 60 34 Z"
            fill="#f59e0b"
          />
          <circle cx="60" cy="42" r="2.5" fill="#fef08a" />

          {/* GTU Monogram letters on book */}
          <text
            x="60"
            y="82"
            textAnchor="middle"
            fill="#f8fafc"
            fontSize="10"
            fontWeight="bold"
            fontFamily="system-ui, sans-serif"
            letterSpacing="2"
          >
            GTU
          </text>

          {/* Estd 2007 Ring Text */}
          <text
            x="60"
            y="96"
            textAnchor="middle"
            fill="#c88a1e"
            fontSize="7"
            fontWeight="bold"
            fontFamily="system-ui, sans-serif"
          >
            ESTD 2007
          </text>
        </svg>
      </div>

      {showText && (
        <div className="leading-tight">
          <span className="block font-bold text-sm tracking-tight text-white">
            Gujarat Technological University
          </span>
          <span className="block text-[11px] text-amber-300 font-medium font-sans">
            ગુજરાત ટેકનોલોજીકલ યુનિવર્સિટી
          </span>
        </div>
      )}
    </div>
  );
}
