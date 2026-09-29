import { Link } from 'react-router-dom'
import { TopBar } from '../components/TopBar'
import { Avatar, ProgressBar } from '../components/ui'
import {
  projects,
  tasks,
  members,
  milestones,
  aiInsights,
  formatYen,
  getMember,
  getProject,
} from '../data/mockData'

const statusLabel: Record<string, string> = {
  active: '進行中',
  planning: '計画中',
  on_hold: '一時停止',
  completed: '完了',
}

const statusClass: Record<string, string> = {
  active: 'badge-active',
  planning: 'badge-planning',
  on_hold: 'badge-hold',
  completed: 'badge-done',
}

export function Dashboard() {
  const activeProjects = projects.filter((p) => p.status === 'active' || p.status === 'planning')
  const openTasks = tasks.filter((t) => t.status !== 'done')
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0)
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0)
  const avgProgress = Math.round(
    activeProjects.reduce((s, p) => s + p.progress, 0) / Math.max(activeProjects.length, 1),
  )
  const upcoming = [...milestones]
    .filter((m) => !m.completed)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5)

  return (
    <>
      <TopBar title="ダッシュボード" subtitle="本日の進行状況と優先事項" />
      <div className="content">
        <div className="page-intro">
          <div>
            <h2>おはようございます</h2>
            <p>5案件・{openTasks.length}件の未完了タスクを監視中。AIが1件の遅延リスクを検出しています。</p>
          </div>
          <Link to="/ai" className="btn btn-secondary">
            AIインサイトを見る
          </Link>
        </div>

        <div className="grid-stats">
          <div className="stat">
            <div className="stat-label">進行中案件</div>
            <div className="stat-value">{activeProjects.length}</div>
            <div className="stat-meta up">うち計画中 {projects.filter((p) => p.status === 'planning').length}</div>
          </div>
          <div className="stat">
            <div className="stat-label">未完了タスク</div>
            <div className="stat-value">{openTasks.length}</div>
            <div className="stat-meta">レビュー待ち {tasks.filter((t) => t.status === 'review').length}</div>
          </div>
          <div className="stat">
            <div className="stat-label">予算消化率</div>
            <div className="stat-value">{Math.round((totalSpent / totalBudget) * 100)}%</div>
            <div className="stat-meta">
              {formatYen(totalSpent)} / {formatYen(totalBudget)}
            </div>
          </div>
          <div className="stat">
            <div className="stat-label">平均進捗</div>
            <div className="stat-value">{avgProgress}%</div>
            <div className="stat-meta">稼働メンバー {members.length}名</div>
          </div>
        </div>

        <div className="grid-2">
          <section className="panel">
            <div className="panel-head">
              <h3>進行中プロジェクト</h3>
              <Link to="/projects" className="btn btn-ghost btn-sm">
                すべて見る
              </Link>
            </div>
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>案件名</th>
                    <th>状態</th>
                    <th>進捗</th>
                    <th>担当</th>
                    <th>予算</th>
                  </tr>
                </thead>
                <tbody>
                  {activeProjects.map((p) => {
                    const owner = getMember(p.ownerId)
                    return (
                      <tr key={p.id}>
                        <td>
                          <strong>{p.name}</strong>
                          <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
                            {p.client}
                          </div>
                        </td>
                        <td>
                          <span className={`badge badge-dot ${statusClass[p.status]}`}>
                            {statusLabel[p.status]}
                          </span>
                        </td>
                        <td style={{ minWidth: 120 }}>
                          <ProgressBar value={p.progress} />
                        </td>
                        <td>
                          {owner ? (
                            <span className="person">
                              <Avatar name={owner.name} color={owner.avatarColor} />
                              <span>{owner.name}</span>
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td>{formatYen(p.spent)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <div className="stack-sm" style={{ gap: 14 }}>
            <section className="panel">
              <div className="panel-head">
                <h3>今後のマイルストーン</h3>
                <span>直近5件</span>
              </div>
              <div className="panel-body">
                <div className="timeline-list">
                  {upcoming.map((m) => {
                    const project = getProject(m.projectId)
                    return (
                      <div key={m.id} className="timeline-item">
                        <div className="date">{m.date.slice(5).replace('-', '/')}</div>
                        <div className="rail">
                          <span className="dot" />
                        </div>
                        <div className="body">
                          <strong>{m.title}</strong>
                          <span>{project?.name}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>

            <section className="panel">
              <div className="panel-head">
                <h3>AIからの注意点</h3>
                <span>自動解析</span>
              </div>
              <div className="panel-body insight-list">
                {aiInsights.slice(0, 2).map((insight) => (
                  <div key={insight.id} className={`insight ${insight.type}`}>
                    <div className="insight-type">{insight.type}</div>
                    <h4>{insight.title}</h4>
                    <p>{insight.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
