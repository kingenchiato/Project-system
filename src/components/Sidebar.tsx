import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  CalendarDays,
  Wallet,
  Users,
  Sparkles,
} from 'lucide-react'
import { Logo } from './Logo'

const links = [
  { to: '/', label: 'ダッシュボード', icon: LayoutDashboard, end: true },
  { to: '/projects', label: 'プロジェクト', icon: FolderKanban },
  { to: '/tasks', label: 'タスク', icon: CheckSquare },
  { to: '/schedule', label: 'スケジュール', icon: CalendarDays },
  { to: '/budget', label: '予算管理', icon: Wallet },
  { to: '/team', label: '担当管理', icon: Users },
  { to: '/ai', label: 'AIアシスタント', icon: Sparkles },
]

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Logo size={36} variant="light" />
        <div className="sidebar-brand-text">
          <strong>STRIDE</strong>
          <span>PROJECT SYSTEM</span>
        </div>
      </div>

      <p className="nav-label">メニュー</p>
      <nav className="nav-list" aria-label="メインナビゲーション">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <Icon strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-foot">
        <p>
          予算・工程・担当を一画面で。
          <br />
          AIが遅延リスクを先読みします。
        </p>
      </div>
    </aside>
  )
}
