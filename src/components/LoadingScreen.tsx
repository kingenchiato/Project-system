import { useEffect, useState } from 'react'
import { LogoMarkLarge } from './Logo'

const STATUS_LINES = [
  '環境を初期化しています',
  'プロジェクトデータを読み込み中',
  'スケジュールを同期しています',
  'AIインサイトを準備中',
  '準備が整いました',
]

const LOADER_BG = `${import.meta.env.BASE_URL}images/loader-bg.jpg`

type LoadingScreenProps = {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [exiting, setExiting] = useState(false)
  const [statusIndex, setStatusIndex] = useState(0)

  useEffect(() => {
    const statusTimer = window.setInterval(() => {
      setStatusIndex((i) => Math.min(i + 1, STATUS_LINES.length - 1))
    }, 1500)

    const exitTimer = window.setTimeout(() => {
      setExiting(true)
    }, 7300)

    const doneTimer = window.setTimeout(() => {
      onComplete()
    }, 8000)

    return () => {
      window.clearInterval(statusTimer)
      window.clearTimeout(exitTimer)
      window.clearTimeout(doneTimer)
    }
  }, [onComplete])

  return (
    <div className={`loader${exiting ? ' exit' : ''}`} role="status" aria-live="polite">
      <div
        className="loader-bg"
        style={{
          backgroundImage: `linear-gradient(155deg, rgba(7, 20, 38, 0.55) 0%, rgba(14, 40, 72, 0.42) 48%, rgba(7, 20, 38, 0.68) 100%), url('${LOADER_BG}')`,
        }}
      />
      <div className="loader-grain" />
      <div className="loader-inner">
        <div className="loader-logo-wrap">
          <LogoMarkLarge size={104} />
        </div>
        <div className="loader-wordmark">STRIDE</div>
        <p className="loader-tagline">案件進行管理システム</p>
        <div className="loader-bar" aria-hidden="true">
          <span />
        </div>
        <p className="loader-status">{STATUS_LINES[statusIndex]}</p>
      </div>
    </div>
  )
}
