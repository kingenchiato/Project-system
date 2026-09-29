type LogoProps = {
  size?: number
  variant?: 'light' | 'dark'
  className?: string
}

/** Handcrafted mark: ascending path + horizon — progress as stride. */
export function Logo({ size = 40, variant = 'dark', className }: LogoProps) {
  const field = variant === 'light' ? '#2A4F7A' : '#E8F2FA'
  const stroke = variant === 'light' ? '#E8F2FA' : '#3A6AA0'
  const accent = variant === 'light' ? '#8FBAE4' : '#4A7FB8'
  const solid = variant === 'light' ? '#FFFFFF' : '#1E3A5F'

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="60" height="60" fill={field} />
      <path d="M10 44.5H54" stroke={stroke} strokeWidth="1.2" strokeOpacity="0.4" />
      <path
        d="M12 42 L22 42 L22 32 L34 32 L34 22 L46 22 L46 14"
        stroke={accent}
        strokeWidth="2.4"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      <path d="M42 10 H50 V18" stroke={solid} strokeWidth="2.2" strokeLinecap="square" />
      <path d="M50 10 L40 20" stroke={solid} strokeWidth="2.2" strokeLinecap="square" />
      <rect x="12" y="46" width="6" height="2.5" fill={accent} opacity="0.9" />
      <rect x="22" y="46" width="6" height="2.5" fill={accent} opacity="0.55" />
      <rect x="32" y="46" width="6" height="2.5" fill={accent} opacity="0.3" />
      <path d="M54 50 L58 50 L58 54" stroke={stroke} strokeWidth="1" strokeOpacity="0.5" />
    </svg>
  )
}

export function LogoMarkLarge({ size = 96 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="STRIDE"
    >
      <rect width="96" height="96" fill="rgba(255,255,255,0.72)" />
      <rect x="1.5" y="1.5" width="93" height="93" stroke="rgba(74,127,184,0.28)" strokeWidth="1" />
      <path d="M18 66.5H78" stroke="rgba(74,127,184,0.28)" strokeWidth="1.4" />
      <path
        d="M20 64 L34 64 L34 50 L50 50 L50 36 L66 36 L66 24"
        stroke="#4A7FB8"
        strokeWidth="3.2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path d="M60 18 H74 V32" stroke="#1E3A5F" strokeWidth="3" strokeLinecap="square" />
      <path d="M74 18 L58 34" stroke="#1E3A5F" strokeWidth="3" strokeLinecap="square" />
      <rect x="20" y="72" width="9" height="3.5" fill="#5B93CC" />
      <rect x="34" y="72" width="9" height="3.5" fill="#5B93CC" opacity="0.55" />
      <rect x="48" y="72" width="9" height="3.5" fill="#5B93CC" opacity="0.28" />
      <path d="M78 76 L84 76 L84 82" stroke="rgba(74,127,184,0.55)" strokeWidth="1.4" />
    </svg>
  )
}
