import { useMemo, useState, type FormEvent } from 'react'
import { TopBar } from '../components/TopBar'
import { Avatar } from '../components/ui'
import { getMember, getProject, members, projects, tasks as seedTasks } from '../data/mockData'
import type { Priority, Task, TaskStatus } from '../types'

const columns: { key: TaskStatus; label: string }[] = [
  { key: 'todo', label: '未着手' },
  { key: 'in_progress', label: '進行中' },
  { key: 'review', label: 'レビュー' },
  { key: 'done', label: '完了' },
]

const priorityLabel: Record<Priority, string> = {
  low: '低',
  medium: '中',
  high: '高',
  critical: '緊急',
}

const priorityClass: Record<Priority, string> = {
  low: 'badge-low',
  medium: 'badge-medium',
  high: 'badge-high',
  critical: 'badge-critical',
}

export function Tasks() {
  const [items, setItems] = useState<Task[]>(seedTasks)
  const [view, setView] = useState<'board' | 'list'>('board')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Task | null>(null)

  const grouped = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      review: [],
      done: [],
    }
    for (const t of items) map[t.status].push(t)
    return map
  }, [items])

  function moveTask(id: string, status: TaskStatus) {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
  }

  function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const next: Task = {
      id: `t${Date.now()}`,
      title: String(fd.get('title') || '新規タスク'),
      projectId: String(fd.get('projectId') || projects[0].id),
      assigneeId: String(fd.get('assigneeId') || members[0].id),
      status: 'todo',
      priority: (fd.get('priority') as Priority) || 'medium',
      dueDate: String(fd.get('dueDate') || '2026-10-31'),
      estimateHours: Number(fd.get('estimateHours') || 8),
      spentHours: 0,
      description: String(fd.get('description') || ''),
    }
    setItems((prev) => [next, ...prev])
    setOpen(false)
  }

  return (
    <>
      <TopBar
        title="タスク管理"
        subtitle="ボードとリストで進捗を可視化"
        onNew={() => setOpen(true)}
        newLabel="タスク追加"
      />
      <div className="content">
        <div className="toolbar">
          <div className="chip-group">
            <button type="button" className={`chip${view === 'board' ? ' active' : ''}`} onClick={() => setView('board')}>
              ボード
            </button>
            <button type="button" className={`chip${view === 'list' ? ' active' : ''}`} onClick={() => setView('list')}>
              リスト
            </button>
          </div>
          <div className="spacer" />
          <span className="muted">全 {items.length} 件</span>
        </div>

        {view === 'board' ? (
          <div className="kanban">
            {columns.map((col) => (
              <div key={col.key} className="kanban-col">
                <div className="kanban-col-head">
                  <h3>{col.label}</h3>
                  <span>{grouped[col.key].length}</span>
                </div>
                <div className="kanban-list">
                  {grouped[col.key].map((task) => {
                    const assignee = getMember(task.assigneeId)
                    const project = getProject(task.projectId)
                    return (
                      <article
                        key={task.id}
                        className="task-card"
                        onClick={() => setSelected(task)}
                        onKeyDown={(e) => e.key === 'Enter' && setSelected(task)}
                        role="button"
                        tabIndex={0}
                      >
                        <span className={`badge ${priorityClass[task.priority]}`}>
                          {priorityLabel[task.priority]}
                        </span>
                        <h4>{task.title}</h4>
                        <div className="muted" style={{ fontSize: 11 }}>
                          {project?.name}
                        </div>
                        <div className="meta">
                          <span>{task.dueDate.slice(5).replace('-', '/')}</span>
                          {assignee ? <Avatar name={assignee.name} color={assignee.avatarColor} /> : null}
                        </div>
                        {col.key !== 'done' ? (
                          <div style={{ marginTop: 10, display: 'flex', gap: 4 }} onClick={(e) => e.stopPropagation()}>
                            {columns
                              .filter((c) => c.key !== col.key)
                              .slice(0, 2)
                              .map((c) => (
                                <button
                                  key={c.key}
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => moveTask(task.id, c.key)}
                                >
                                  → {c.label}
                                </button>
                              ))}
                          </div>
                        ) : null}
                      </article>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <section className="panel">
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>タスク</th>
                    <th>案件</th>
                    <th>優先度</th>
                    <th>状態</th>
                    <th>担当</th>
                    <th>期限</th>
                    <th>工数</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((task) => {
                    const assignee = getMember(task.assigneeId)
                    const project = getProject(task.projectId)
                    return (
                      <tr key={task.id} onClick={() => setSelected(task)} style={{ cursor: 'pointer' }}>
                        <td>
                          <strong>{task.title}</strong>
                        </td>
                        <td>{project?.name}</td>
                        <td>
                          <span className={`badge ${priorityClass[task.priority]}`}>
                            {priorityLabel[task.priority]}
                          </span>
                        </td>
                        <td>{columns.find((c) => c.key === task.status)?.label}</td>
                        <td>
                          {assignee ? (
                            <span className="person">
                              <Avatar name={assignee.name} color={assignee.avatarColor} />
                              {assignee.name}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td>{task.dueDate}</td>
                        <td>
                          {task.spentHours}h / {task.estimateHours}h
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {open ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-head">
              <h3>タスクを追加</h3>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
                閉じる
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body form-grid">
                <div className="field full">
                  <label htmlFor="title">タイトル</label>
                  <input className="input" id="title" name="title" required />
                </div>
                <div className="field">
                  <label htmlFor="projectId">案件</label>
                  <select className="select" id="projectId" name="projectId">
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="assigneeId">担当者</label>
                  <select className="select" id="assigneeId" name="assigneeId">
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="priority">優先度</label>
                  <select className="select" id="priority" name="priority" defaultValue="medium">
                    <option value="low">低</option>
                    <option value="medium">中</option>
                    <option value="high">高</option>
                    <option value="critical">緊急</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="dueDate">期限</label>
                  <input className="input" id="dueDate" name="dueDate" type="date" defaultValue="2026-10-31" />
                </div>
                <div className="field">
                  <label htmlFor="estimateHours">見積工数（h）</label>
                  <input className="input" id="estimateHours" name="estimateHours" type="number" defaultValue={8} />
                </div>
                <div className="field full">
                  <label htmlFor="description">詳細</label>
                  <textarea className="textarea" id="description" name="description" />
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

      {selected ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{selected.title}</h3>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>
                閉じる
              </button>
            </div>
            <div className="modal-body">
              <p className="muted">{selected.description || '詳細メモはありません。'}</p>
              <div className="form-grid">
                <div>
                  <div className="muted" style={{ fontSize: 11 }}>
                    案件
                  </div>
                  <strong>{getProject(selected.projectId)?.name}</strong>
                </div>
                <div>
                  <div className="muted" style={{ fontSize: 11 }}>
                    担当
                  </div>
                  <strong>{getMember(selected.assigneeId)?.name}</strong>
                </div>
                <div>
                  <div className="muted" style={{ fontSize: 11 }}>
                    期限
                  </div>
                  <strong>{selected.dueDate}</strong>
                </div>
                <div>
                  <div className="muted" style={{ fontSize: 11 }}>
                    工数
                  </div>
                  <strong>
                    {selected.spentHours}h / {selected.estimateHours}h
                  </strong>
                </div>
              </div>
              <div className="field">
                <label htmlFor="moveStatus">ステータス変更</label>
                <select
                  className="select"
                  id="moveStatus"
                  value={selected.status}
                  onChange={(e) => {
                    const status = e.target.value as TaskStatus
                    moveTask(selected.id, status)
                    setSelected({ ...selected, status })
                  }}
                >
                  {columns.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
