import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { ja } from 'date-fns/locale'
import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { TopBar } from '../components/TopBar'
import { getProject, milestones, tasks } from '../data/mockData'

const weekDays = ['日', '月', '火', '水', '木', '金', '土']

export function Schedule() {
  const [cursor, setCursor] = useState(new Date(2026, 8, 1)) // Sep 2026 demo month aligned with sample data

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 0 })
    return eachDayOfInterval({ start, end })
  }, [cursor])

  const eventsByDate = useMemo(() => {
    const map = new Map<string, Array<{ title: string; kind: 'task' | 'milestone' }>>()
    for (const t of tasks) {
      const key = t.dueDate
      const list = map.get(key) ?? []
      list.push({ title: t.title, kind: 'task' })
      map.set(key, list)
    }
    for (const m of milestones) {
      const key = m.date
      const list = map.get(key) ?? []
      list.push({ title: `${m.title}（${getProject(m.projectId)?.name ?? ''}）`, kind: 'milestone' })
      map.set(key, list)
    }
    return map
  }, [])

  const upcoming = [...milestones]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8)

  return (
    <>
      <TopBar title="スケジュール" subtitle="マイルストーンとタスク期限を俯瞰" />
      <div className="content">
        <div className="toolbar">
          <button type="button" className="btn btn-secondary btn-icon" onClick={() => setCursor((d) => addDays(startOfMonth(d), -1))} aria-label="前月">
            <ChevronLeft size={16} />
          </button>
          <h2 style={{ fontSize: 18, margin: '0 8px' }}>{format(cursor, 'yyyy年 M月', { locale: ja })}</h2>
          <button type="button" className="btn btn-secondary btn-icon" onClick={() => setCursor((d) => addDays(endOfMonth(d), 1))} aria-label="翌月">
            <ChevronRight size={16} />
          </button>
          <div className="spacer" />
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setCursor(new Date(2026, 8, 1))}>
            デモ月へ戻る
          </button>
        </div>

        <div className="grid-2">
          <section className="panel" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="calendar-grid">
              {weekDays.map((d) => (
                <div key={d} className="cal-head">
                  {d}
                </div>
              ))}
              {days.map((day) => {
                const key = format(day, 'yyyy-MM-dd')
                const events = eventsByDate.get(key) ?? []
                return (
                  <div key={key} className={`cal-cell${!isSameMonth(day, cursor) ? ' muted' : ''}`}>
                    <div className="cal-day">{format(day, 'd')}</div>
                    {events.slice(0, 3).map((ev, i) => (
                      <div key={`${key}-${i}`} className={`cal-event${ev.kind === 'milestone' ? ' milestone' : ''}`} title={ev.title}>
                        {ev.title}
                      </div>
                    ))}
                    {events.length > 3 ? (
                      <div className="muted" style={{ fontSize: 10, marginTop: 4 }}>
                        +{events.length - 3} 件
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <h3>マイルストーン一覧</h3>
              <span>{milestones.length} 件</span>
            </div>
            <div className="panel-body">
              <div className="timeline-list">
                {upcoming.map((m) => (
                  <div key={m.id} className={`timeline-item${m.completed ? ' done' : ''}`}>
                    <div className="date">{m.date.slice(5).replace('-', '/')}</div>
                    <div className="rail">
                      <span className="dot" />
                    </div>
                    <div className="body">
                      <strong>{m.title}</strong>
                      <span>
                        {getProject(m.projectId)?.name}
                        {m.completed ? ' · 完了' : ' · 予定'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
