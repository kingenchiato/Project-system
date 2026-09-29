type ProgressBarProps = {
  value: number
  showLabel?: boolean
}

export function ProgressBar({ value, showLabel = true }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className="progress-row">
      <div className="progress" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
        <span style={{ width: `${clamped}%` }} />
      </div>
      {showLabel ? <em>{clamped}%</em> : null}
    </div>
  )
}

export function Avatar({ name, color, size = 'sm' }: { name: string; color: string; size?: 'sm' | 'lg' }) {
  const initials = name
    .replace(/\s+/g, '')
    .slice(0, 2)
  return (
    <span className={`avatar${size === 'lg' ? ' avatar-lg' : ''}`} style={{ background: color }} title={name}>
      {initials}
    </span>
  )
}
