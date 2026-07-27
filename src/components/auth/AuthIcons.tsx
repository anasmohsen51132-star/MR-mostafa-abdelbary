// src/components/auth/AuthIcons.tsx
// Small line-style icon set for the Chemistry Academy auth experience.
// Replaces the previous emoji icons (📱🔑👤🎓) with crisp SVGs that match
// the landing page's scientific/glass visual language and scale cleanly at
// any size or color.

type IconProps = {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
};

export function PhoneIcon({ size = 18, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} aria-hidden="true">
      <path
        d="M6.6 10.8c1.2 2.4 3.2 4.4 5.6 5.6l1.9-1.9c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1v3.2c0 .6-.4 1-1 1C10.6 20.1 3.9 13.4 3.9 5.3c0-.6.4-1 1-1H8.1c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LockIcon({ size = 18, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} aria-hidden="true">
      <rect x="5" y="10.5" width="14" height="9.5" rx="2.2" stroke={color} strokeWidth="1.6" />
      <path d="M8 10.5V7.8a4 4 0 1 1 8 0v2.7" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="15" r="1.4" fill={color} />
    </svg>
  );
}

export function UserIcon({ size = 18, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} aria-hidden="true">
      <circle cx="12" cy="8" r="3.4" stroke={color} strokeWidth="1.6" />
      <path
        d="M5 19.2c.9-3.3 3.6-5.2 7-5.2s6.1 1.9 7 5.2"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// A minimal atom-orbit glyph, used in place of the graduation-cap emoji so
// the "academic level" field still reads as scientific rather than generic.
export function LevelIcon({ size = 18, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} aria-hidden="true">
      <ellipse cx="12" cy="12" rx="9" ry="3.6" stroke={color} strokeWidth="1.4" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" stroke={color} strokeWidth="1.4" transform="rotate(60 12 12)" />
      <circle cx="12" cy="12" r="1.6" fill={color} />
    </svg>
  );
}

export function EyeIcon({ size = 18, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} aria-hidden="true">
      <path
        d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.8" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}

export function EyeOffIcon({ size = 18, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} aria-hidden="true">
      <path
        d="M3.5 3.5l17 17M10.6 10.7a2.8 2.8 0 0 0 3.9 3.9M6.2 6.6C4 8.1 2.5 12 2.5 12s3.5 6.5 9.5 6.5c1.6 0 3-.4 4.2-1.1M9.6 5.7c.8-.2 1.6-.3 2.4-.3 6 0 9.5 6.5 9.5 6.5s-.8 1.5-2.2 3"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AlertIcon({ size = 16, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} aria-hidden="true">
      <circle cx="12" cy="12" r="9.2" stroke={color} strokeWidth="1.6" />
      <path d="M12 7.5v5.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.3" r="1.1" fill={color} />
    </svg>
  );
}

export function SpinnerIcon({ size = 18, color = "currentColor", style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ ...style }}
      className="animate-spin"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2.2" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
