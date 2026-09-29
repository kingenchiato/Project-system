import { useMemo, useState, type FormEvent } from 'react'
import { TopBar } from '../components/TopBar'
import { Avatar, ProgressBar } from '../components/ui'
import { getProject, members as seedMembers, tasks } from '../data/mockData'
import type { Member } from '../types'

export function Team() {
  const [people, setPeople] = useState<Member[]>(seedMembers)
  const [open, setOpen] = useState(false)

  const workload = useMemo(() => {
    return people.map((m) => {
      const assigned = tasks.filter((t) => t.assigneeId === m.id && t.status !== 'done')
      return { member: m, assigned }
    })
  }, [people])

  function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const colors = ['#1a4a8a', '#2463b8', '#0e7490', '#1d4ed8', '#1e3a5f', '#2563eb']
    const next: Member = {
      id: `m${Date.now()}`,
      name: String(fd.get('name') || '新規メンバー'),
      role: String(fd.get('role') || 'メンバー'),
      email: String(fd.get('email') || ''),
      avatarColor: colors[people.length % colors.length],
      department: String(fd.get('department') || '開発'),
      capacity: Number(fd.get('capacity') || 40),
      allocated: Number(fd.get('allocated') || 0),
    }
    setPeople((prev) => [...prev, next])
    setOpen(false)
  }

  return (
    <>
      <TopBar
        title="担当管理"
        subtitle="メンバーの役割と稼働状況"
        onNew={() => setOpen(true)}
        newLabel="メンバー追加"
      />
      <div className="content">
        <div className="member-grid">
          {workload.map(({ member, assigned }) => {
            const load = Math.round((member.allocated / Math.max(member.capacity, 1)) * 100)
            return (
              <article key={member.id} className="member-card">
                <div className="member-card-top">
                  <Avatar name={member.name} color={member.avatarColor} size="lg" />
                  <div>
                    <h4>{member.name}</h4>
                    <div className="role">{member.role}</div>
                  </div>
                </div>
                <div className="muted" style={{ fontSize: 12 }}>
                  {member.department} · {member.email}
                </div>
                <div style={{ marginTop: 14 }}>
                  <div className="row-between" style={{ marginBottom: 6 }}>
                    <span className="muted" style={{ fontSize: 11 }}>
                      稼働率
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{load}%</span>
                  </div>
                  <ProgressBar value={load} showLabel={false} />
                </div>
                <div className="member-stats">
                  <div>
                    <span>稼働 / 定員</span>
                    <strong>
                      {member.allocated}/{member.capacity}h
                    </strong>
                  </div>
                  <div>
                    <span>未完了タスク</span>
                    <strong>{assigned.length}</strong>
                  </div>
                </div>
                {assigned.length > 0 ? (
                  <div style={{ marginTop: 14 }}>
                    <div className="muted" style={{ fontSize: 11, marginBottom: 6 }}>
                      担当タスク
                    </div>
                    <ul className="stack-sm">
                      {assigned.slice(0, 3).map((t) => (
                        <li key={t.id} style={{ fontSize: 12 }}>
                          {t.title}
                          <div className="muted" style={{ fontSize: 11 }}>
                            {getProject(t.projectId)?.name}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>
      </div>

      {open ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-head">
              <h3>メンバーを追加</h3>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
                閉じる
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body form-grid">
                <div className="field">
                  <label htmlFor="name">氏名</label>
                  <input className="input" id="name" name="name" required />
                </div>
                <div className="field">
                  <label htmlFor="role">役割</label>
                  <input className="input" id="role" name="role" placeholder="エンジニア" />
                </div>
                <div className="field">
                  <label htmlFor="department">部署</label>
                  <input className="input" id="department" name="department" placeholder="開発" />
                </div>
                <div className="field">
                  <label htmlFor="email">メール</label>
                  <input className="input" id="email" name="email" type="email" />
                </div>
                <div className="field">
                  <label htmlFor="capacity">週次キャパ（h）</label>
                  <input className="input" id="capacity" name="capacity" type="number" defaultValue={40} />
                </div>
                <div className="field">
                  <label htmlFor="allocated">現在の割当（h）</label>
                  <input className="input" id="allocated" name="allocated" type="number" defaultValue={0} />
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
