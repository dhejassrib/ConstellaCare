import { useId } from 'react';

interface ConstellaLogoProps {
  size?: number;
  className?: string;
}

export default function ConstellaLogo({ size = 32, className = '' }: ConstellaLogoProps) {
  const id = useId().replace(/:/g, '');
  const lineId = `constella-line-${id}`;
  const glowId = `constella-glow-${id}`;
  const filterId = `constella-star-glow-${id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={lineId} x1="8" y1="38" x2="40" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D4798E" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#9c82ba" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#c9a0dc" stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f4d4a8" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#D4798E" stopOpacity="0.6" />
        </radialGradient>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Constellation lines */}
      <path
        d="M10 38 L16 24 L24 10 L32 22 L38 36 M16 24 L32 22 M32 22 L28 38"
        stroke={`url(#${lineId})`}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.75"
      />

      {/* Outer stars */}
      <circle cx="10" cy="38" r="2" fill="#D4798E" filter={`url(#${filterId})`} />
      <circle cx="16" cy="24" r="2.25" fill="#9c82ba" filter={`url(#${filterId})`} />
      <circle cx="32" cy="22" r="2.25" fill="#D4798E" filter={`url(#${filterId})`} />
      <circle cx="38" cy="36" r="1.75" fill="#c9a0dc" filter={`url(#${filterId})`} />
      <circle cx="28" cy="38" r="1.75" fill="#7E6C9E" filter={`url(#${filterId})`} />

      {/* Central bright star */}
      <circle cx="24" cy="10" r="3.5" fill={`url(#${glowId})`} filter={`url(#${filterId})`} />
      <circle cx="24" cy="10" r="1.25" fill="#fff" opacity="0.85" />
    </svg>
  );
}
