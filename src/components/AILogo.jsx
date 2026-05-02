// src/components/AILogo.jsx — CampusFind Professional Logo
export default function AILogo({ size = 36, style = {} }) {
  const s = size;
  return (
    <svg
      width={s} height={s}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <defs>
        <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>

      {/* Background square with rounded corners */}
      <rect width="40" height="40" rx="10" fill="url(#lg1)" />

      {/* Magnifying glass circle */}
      <circle cx="17" cy="17" r="8" stroke="white" strokeWidth="2.5" fill="none" opacity="0.9" />

      {/* Magnifying glass handle */}
      <line x1="23" y1="23" x2="30" y2="30" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />

      {/* AI sparkle inside lens */}
      <path
        d="M17 12 L18 15.5 L21.5 16.5 L18 17.5 L17 21 L16 17.5 L12.5 16.5 L16 15.5 Z"
        fill="url(#lg2)"
        opacity="0.95"
      />
    </svg>
  );
}
