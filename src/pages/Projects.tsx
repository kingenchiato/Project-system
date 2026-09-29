import { useMemo, useState, type FormEvent } from 'react'
import { TopBar } from '../components/TopBar'
import { Avatar, ProgressBar } from '../components/ui'
import { formatYen, getMember, members, projects as seedProjects } from '../data/mockData'
import type { Project, ProjectStatus } from '../types'

const statusLabel: Record<ProjectStatus, string> = {
  active: '進行中',
  planning: '計画中',
  on_hold: '一時停止',
  completed: '完了',
}

const statusClass: Record<ProjectStatus, string> = {
  active: 'badge-active',
  planning: 'badge-planning',
  on_hold: 'badge-hold',
  completed: 'badge-done',
}

const filters: Array<ProjectStatus | 'all'> = ['all', 'active', 'planning', 'on_hold', 'completed']

export function Projects() {
  const [items, setItems] = useState<Project[]>(seedProjects)
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all')
  const [open, setOpen] = useState(false)

  const visible = useMemo(
    () => (filter === 'all' ? items : items.filter((p) => p.status === filter)),
    [filter, items],
  )

  function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const next: Project = {
      id: `p${Date.now()}`,
      name: String(fd.get('name') || '新規プロジェクト'),
      client: String(fd.get('client') || '未設定'),
      status: (fd.get('status') as ProjectStatus) || 'planning',
      progress: Number(fd.get('progress') || 0),
      budget: Number(fd.get('budget') || 0),
      spent: 0,
      startDate: String(fd.get('startDate') || '2026-10-01'),
      endDate: String(fd.get('endDate') || '2026-12-31'),
      ownerId: String(fd.get('ownerId') || members[0].id),
      description: String(fd.get('description') || ''),
      tags: String(fd.get('tags') || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    }
    setItems((prev) => [next, ...prev])
    setOpen(false)
  }

  return (
    <>
      <TopBar
        title="プロジェクト"
        subtitle="案件の進捗・予算・担当を一覧管理"
        onNew={() => setOpen(true)}
        newLabel="案件を追加"
      />
      <div className="content">
        <div className="toolbar">
          <div className="chip-group">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                className={`chip${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'すべて' : statusLabel[f]}
              </button>
            ))}
          </div>
          <div className="spacer" />
          <span className="muted">{visible.length} 件</span>
        </div>

        <section className="panel">
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>案件</th>
                  <th>ステータス</th>
                  <th>進捗</th>
                  <th>期間</th>
                  <th>予算 / 消化</th>
                  <th>PM</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((p) => {
                  const owner = getMember(p.ownerId)
                  const burn = Math.round((p.spent / Math.max(p.budget, 1)) * 100)
                  return (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.name}</strong>
                        <div className="muted" style={{ fontSize: 11, marginTop: 3 }}>
                          {p.client}
                        </div>
                        <div style={{ marginTop: 6 }}>
                          {p.tags.map((t) => (
                            <span key={t} className="tag">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-dot ${statusClass[p.status]}`}>
                          {statusLabel[p.status]}
                        </span>
                      </td>
                      <td style={{ minWidth: 140 }}>
                        <ProgressBar value={p.progress} />
                      </td>
                      <td>
                        <div style={{ fontSize: 12 }}>
                          {p.startDate}
                          <br />
                          <span className="muted">〜 {p.endDate}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: 13 }}>{formatYen(p.budget)}</div>
                        <div className="muted" style={{ fontSize: 11 }}>
                          消化 {formatYen(p.spent)}（{burn}%）
                        </div>
                      </td>
                      <td>
                        {owner ? (
                          <span className="person">
                            <Avatar name={owner.name} color={owner.avatarColor} />
                            <span className="person-meta">
                              <strong>{owner.name}</strong>
                              <span>{owner.role}</span>
                            </span>
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {open ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-head">
              <h3>案件を追加</h3>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
                閉じる
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body form-grid">
                <div className="field full">
                  <label htmlFor="name">案件名</label>
                  <input className="input" id="name" name="name" required placeholder="例）Webサイトリニューアル" />
                </div>
                <div className="field">
                  <label htmlFor="client">クライアント</label>
                  <input className="input" id="client" name="client" placeholder="会社名" />
                </div>
                <div className="field">
                  <label htmlFor="status">ステータス</label>
                  <select className="select" id="status" name="status" defaultValue="planning">
                    <option value="planning">計画中</option>
                    <option value="active">進行中</option>
                    <option value="on_hold">一時停止</option>
                    <option value="completed">完了</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="budget">予算（円）</label>
                  <input className="input" id="budget" name="budget" type="number" min={0} defaultValue={1000000} />
                </div>
                <div className="field">
                  <label htmlFor="progress">初期進捗（%）</label>
                  <input className="input" id="progress" name="progress" type="number" min={0} max={100} defaultValue={0} />
                </div>
                <div className="field">
                  <label htmlFor="startDate">開始日</label>
                  <input className="input" id="startDate" name="startDate" type="date" defaultValue="2026-10-01" />
                </div>
                <div className="field">
                  <label htmlFor="endDate">終了日</label>
                  <input className="input" id="endDate" name="endDate" type="date" defaultValue="2026-12-31" />
                </div>
                <div className="field full">
                  <label htmlFor="ownerId">担当PM</label>
                  <select className="select" id="ownerId" name="ownerId" defaultValue={members[0].id}>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}（{m.role}）
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field full">
                  <label htmlFor="tags">タグ（カンマ区切り）</label>
                  <input className="input" id="tags" name="tags" placeholder="Web, リニューアル" />
                </div>
                <div className="field full">
                  <label htmlFor="description">概要</label>
                  <textarea className="textarea" id="description" name="description" placeholder="案件の目的や範囲" />
                </div>
              </div>
              <div className="modal-foot">
                <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>
                  キャンセル
                </button>
                <button type="submit" className="btn">
                  追加する
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}
