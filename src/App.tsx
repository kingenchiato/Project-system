import { useCallback, useState } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoadingScreen } from './components/LoadingScreen'
import { Sidebar } from './components/Sidebar'
import { AIAssistant } from './pages/AIAssistant'
import { Budget } from './pages/Budget'
import { Dashboard } from './pages/Dashboard'
import { Projects } from './pages/Projects'
import { Schedule } from './pages/Schedule'
import { Tasks } from './pages/Tasks'
import { Team } from './pages/Team'

export default function App() {
  const [ready, setReady] = useState(false)
  const handleReady = useCallback(() => setReady(true), [])

  return (
    <>
      {!ready ? <LoadingScreen onComplete={handleReady} /> : null}
      {ready ? (
        <HashRouter>
          <div className="app-shell app-enter">
            <Sidebar />
            <div className="main-area">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/team" element={<Team />} />
                <Route path="/ai" element={<AIAssistant />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </HashRouter>
      ) : null}
    </>
  )
}
