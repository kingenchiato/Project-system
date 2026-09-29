import { useState, type FormEvent } from 'react'
import { TopBar } from '../components/TopBar'
import { aiInsights, formatYen, getMember, projects, tasks } from '../data/mockData'

type ChatMessage = { id: string; role: 'user' | 'assistant'; text: string }

function craftReply(prompt: string): string {
  const q = prompt.toLowerCase()
  const open = tasks.filter((t) => t.status !== 'done')
  const critical = tasks.filter((t) => t.priority === 'critical' && t.status !== 'done')
  const overloaded = getMember('m3')
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0)
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0)

  if (q.includes('リスク') || q.includes('遅延') || q.includes('危険')) {
    return `遅延リスクが高いのは「${critical[0]?.title ?? '認証フロー実装'}」です。担当の${overloaded?.name ?? '田中'}さんの稼働は${overloaded?.allocated ?? 38}h/${overloaded?.capacity ?? 40}hです。工数の一部をフロント担当へ委譲するか、期限を3〜5日延ばす案を推奨します。`
  }
  if (q.includes('予算') || q.includes('コスト')) {
    return `全案件の予算合計は${formatYen(totalBudget)}、実績は${formatYen(totalSpent)}（消化率${Math.round((totalSpent / totalBudget) * 100)}%）です。ECサイトリニューアルは進捗62%に対し消化率約61%でバランス良好。モバイルMVPは消化が浅いため、要件凍結後に開発投資を集中してください。`
  }
  if (q.includes('今週') || q.includes('サマリー') || q.includes('状況')) {
    return `今週の状況：進行中/計画中案件 ${projects.filter((p) => p.status === 'active' || p.status === 'planning').length}件、未完了タスク ${open.length}件、レビュー待ち ${tasks.filter((t) => t.status === 'review').length}件。優先対応は決済API連携と認証フローです。`
  }
  if (q.includes('担当') || q.includes('誰') || q.includes('アサイン')) {
    return `余力があるのは高橋 結衣さん（稼働70%）です。社内ポータルの画面設計やモバイルMVPのプロトタイプを前倒し割当すると、全体のスループットが上がります。`
  }
  return `ご質問「${prompt}」を既存データで解析しました。未完了タスクは${open.length}件、うち緊急は${critical.length}件です。リスク・予算・今週の状況・担当提案について聞くと、より具体的な提案を返せます。`
}

export function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'STRIDE AIです。案件の遅延リスク、予算バランス、担当の余力について自然文で聞いてください。デモではローカルのプロジェクトデータを解析して回答します。',
    },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)

  function send(prompt: string) {
    if (!prompt.trim() || thinking) return
    const userMsg: ChatMessage = { id: `u${Date.now()}`, role: 'user', text: prompt.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setThinking(true)
    window.setTimeout(() => {
      const reply: ChatMessage = {
        id: `a${Date.now()}`,
        role: 'assistant',
        text: craftReply(prompt.trim()),
      }
      setMessages((prev) => [...prev, reply])
      setThinking(false)
    }, 700)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    send(input)
  }

  const prompts = ['今週の状況を教えて', '遅延リスクはある？', '予算の消化状況は？', '誰に余力がある？']

  return (
    <>
      <TopBar title="AIアシスタント" subtitle="進行データに基づく提案と要約" />
      <div className="content">
        <div className="ai-layout">
          <section className="panel">
            <div className="panel-head">
              <h3>対話</h3>
              <span>デモ応答</span>
            </div>
            <div className="panel-body ai-composer">
              <div className="ai-thread">
                {messages.map((m) => (
                  <div key={m.id} className={`ai-bubble ${m.role}`}>
                    {m.text}
                  </div>
                ))}
                {thinking ? <div className="ai-bubble assistant">解析中…</div> : null}
              </div>
              <div className="chip-group">
                {prompts.map((p) => (
                  <button key={p} type="button" className="chip" onClick={() => send(p)}>
                    {p}
                  </button>
                ))}
              </div>
              <form className="ai-composer-row" onSubmit={handleSubmit}>
                <input
                  className="input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="例）EC案件の遅延リスクを教えて"
                  aria-label="AIへの質問"
                />
                <button type="submit" className="btn" disabled={thinking}>
                  送信
                </button>
              </form>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <h3>自動インサイト</h3>
              <span>毎朝更新想定</span>
            </div>
            <div className="panel-body insight-list">
              {aiInsights.map((insight) => (
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
    </>
  )
}
