import { Search, Bell, Plus } from 'lucide-react'

type TopBarProps = {
  title: string
  subtitle?: string
  onNew?: () => void
  newLabel?: string
}

export function TopBar({ title, subtitle, onNew, newLabel = '新規作成' }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="topbar-title">
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <div className="topbar-actions">
        <div className="search-box">
          <Search strokeWidth={1.75} />
          <input type="search" placeholder="案件・タスクを検索" aria-label="検索" />
        </div>
        <button type="button" className="btn btn-secondary btn-icon" aria-label="通知">
          <Bell size={16} strokeWidth={1.75} />
        </button>
        {onNew ? (
          <button type="button" className="btn" onClick={onNew}>
            <Plus size={16} strokeWidth={2} />
            {newLabel}
          </button>
        ) : null}
      </div>
    </header>
  )
}
