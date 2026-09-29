import { useEffect, useRef, useState, type FormEvent } from 'react'
import { LogoMarkLarge } from './Logo'

const STATUS_LINES = [
  '環境を初期化しています',
  'プロジェクトデータを読み込み中',
  'スケジュールを同期しています',
  'AIインサイトを準備中',
  '準備が整いました',
]

const ACCESS_CODE = '8000'
const LOADER_BG = `${import.meta.env.BASE_URL}images/loader-bg.jpg`
const AUTH_KEY = 'stride-access'

type LoadingScreenProps = {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const alreadyAuthed = typeof window !== 'undefined' && sessionStorage.getItem(AUTH_KEY) === '1'
  const [phase, setPhase] = useState<'loading' | 'gate'>(alreadyAuthed ? 'loading' : 'loading')
  const [exiting, setExiting] = useState(false)
  const [statusIndex, setStatusIndex] = useState(0)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const statusTimer = window.setInterval(() => {
      setStatusIndex((i) => Math.min(i + 1, STATUS_LINES.length - 1))
    }, 1500)

    const gateTimer = window.setTimeout(() => {
      if (alreadyAuthed) {
        setExiting(true)
        window.setTimeout(onComplete, 700)
      } else {
        setPhase('gate')
      }
    }, 8000)

    return () => {
      window.clearInterval(statusTimer)
      window.clearTimeout(gateTimer)
    }
  }, [alreadyAuthed, onComplete])

  useEffect(() => {
    if (phase === 'gate') {
      inputRef.current?.focus()
    }
  }, [phase])

  function finish() {
    sessionStorage.setItem(AUTH_KEY, '1')
    setExiting(true)
    window.setTimeout(onComplete, 700)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (code.trim() === ACCESS_CODE) {
      setError('')
      finish()
      return
    }
    setError('アクセスコードが正しくありません')
    setCode('')
    inputRef.current?.focus()
  }

  return (
    <div className={`loader${exiting ? ' exit' : ''}`} role="status" aria-live="polite">
      <div
        className="loader-bg"
        style={{
          backgroundImage: `url('${LOADER_BG}')`,
        }}
      />
      <div className="loader-grain" />
      <div className="loader-inner">
        <div className="loader-logo-wrap">
          <LogoMarkLarge size={96} />
        </div>
        <div className="loader-wordmark">STRIDE</div>
        <p className="loader-tagline">案件進行管理システム</p>

        {phase === 'loading' ? (
          <div className="loader-phase-load">
            <div className="loader-bar" aria-hidden="true">
              <span />
            </div>
            <p className="loader-status">{STATUS_LINES[statusIndex]}</p>
          </div>
        ) : (
          <div className="loader-gate">
            <div className="loader-gate-kicker">ACCESS</div>
            <h2>ご登録コード</h2>
            <p>
              デモ閲覧のため、アクセスコードの入力をお願いします。
              <br />
              正しいコードを入力するとシステムへ入れます。
            </p>
            <form className="loader-gate-form" onSubmit={handleSubmit}>
              <div className="loader-gate-field">
                <label htmlFor="access-code">アクセスコード</label>
                <input
                  ref={inputRef}
                  id="access-code"
                  name="access-code"
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="····"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value)
                    if (error) setError('')
                  }}
                  maxLength={12}
                />
              </div>
              <div className="loader-gate-error" role="alert">
                {error}
              </div>
              <button type="submit" className="btn">
                登録して入る
              </button>
            </form>
            <p className="loader-gate-note">招待制デモ · STRIDE Prototype</p>
          </div>
        )}
      </div>
    </div>
  )
}
