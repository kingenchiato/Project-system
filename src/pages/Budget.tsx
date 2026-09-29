import { useMemo, useState } from 'react'
import { TopBar } from '../components/TopBar'
import { budgetEntries, formatYen, projects } from '../data/mockData'

export function Budget() {
  const [projectId, setProjectId] = useState(projects[0].id)

  const project = projects.find((p) => p.id === projectId) ?? projects[0]
  const entries = useMemo(() => budgetEntries.filter((b) => b.projectId === project.id), [project.id])

  const plannedTotal = entries.reduce((s, e) => s + e.planned, 0) || project.budget
  const actualTotal = entries.reduce((s, e) => s + e.actual, 0) || project.spent
  const remaining = plannedTotal - actualTotal
  const burnRate = Math.round((actualTotal / Math.max(plannedTotal, 1)) * 100)

  const allProjects = projects.map((p) => ({
    ...p,
    burn: Math.round((p.spent / Math.max(p.budget, 1)) * 100),
  }))

  return (
    <>
      <TopBar title="予算管理" subtitle="案件別の計画対実績を可視化" />
      <div className="content">
        <div className="toolbar">
          <div className="field" style={{ minWidth: 260 }}>
            <label htmlFor="projectSelect">案件を選択</label>
            <select
              className="select"
              id="projectSelect"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid-stats">
          <div className="stat">
            <div className="stat-label">計画予算</div>
            <div className="stat-value" style={{ fontSize: 22 }}>
              {formatYen(plannedTotal)}
            </div>
            <div className="stat-meta">{project.name}</div>
          </div>
          <div className="stat">
            <div className="stat-label">実績消化</div>
            <div className="stat-value" style={{ fontSize: 22 }}>
              {formatYen(actualTotal)}
            </div>
            <div className="stat-meta">消化率 {burnRate}%</div>
          </div>
          <div className="stat">
            <div className="stat-label">残予算</div>
            <div className="stat-value" style={{ fontSize: 22 }}>
              {formatYen(remaining)}
            </div>
            <div className={`stat-meta${remaining < 0 ? ' down' : ' up'}`}>
              {remaining < 0 ? '超過あり' : '余裕あり'}
            </div>
          </div>
          <div className="stat">
            <div className="stat-label">進捗とのバランス</div>
            <div className="stat-value" style={{ fontSize: 22 }}>
              {project.progress}%
            </div>
            <div className="stat-meta">
              予算消化 {burnRate}% に対し進捗 {project.progress}%
            </div>
          </div>
        </div>

        <div className="grid-2">
          <section className="panel">
            <div className="panel-head">
              <h3>費目別内訳</h3>
              <span>計画 vs 実績</span>
            </div>
            <div className="panel-body budget-list">
              {entries.length === 0 ? (
                <p className="muted">この案件の費目データはまだありません。</p>
              ) : (
                entries.map((e) => {
                  const pct = Math.min(100, Math.round((e.actual / Math.max(e.planned, 1)) * 100))
                  return (
                    <div key={e.id} className="budget-item">
                      <div className="label">{e.category}</div>
                      <div className="budget-track" title={`${pct}%`}>
                        <div className={`actual${pct > 100 ? ' over' : ''}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                      <div className="amount">
                        {formatYen(e.actual)}
                        <div style={{ fontSize: 10 }}>/ {formatYen(e.planned)}</div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <h3>全案件の予算消化</h3>
              <span>一覧</span>
            </div>
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>案件</th>
                    <th>予算</th>
                    <th>実績</th>
                    <th>消化率</th>
                  </tr>
                </thead>
                <tbody>
                  {allProjects.map((p) => (
                    <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => setProjectId(p.id)}>
                      <td>
                        <strong>{p.name}</strong>
                      </td>
                      <td>{formatYen(p.budget)}</td>
                      <td>{formatYen(p.spent)}</td>
                      <td>
                        <span className={`badge ${p.burn > 90 ? 'badge-critical' : p.burn > 70 ? 'badge-high' : 'badge-medium'}`}>
                          {p.burn}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
