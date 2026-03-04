import React, { useState } from 'react'
import Background from './components/Background.jsx'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './components/Dashboard.jsx'
import ChatPanel from './components/ChatPanel.jsx'
import AssessmentPanel from './components/AssessmentPanel.jsx'
import ReportPanel from './components/ReportPanel.jsx'

const css = `
.app-shell {
  position: relative; z-index: 10;
  display: flex; height: 100vh; overflow: hidden;
}
.main-area {
  flex: 1; display: flex; flex-direction: column; overflow: hidden;
}
.topbar {
  padding: 18px 36px;
  border-bottom: 1px solid rgba(212,184,150,0.08);
  background: rgba(15,8,2,0.5);
  backdrop-filter: blur(14px);
  display: flex; align-items: center; justify-content: space-between;
  flex-shrink: 0; z-index: 10;
}
.page-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 21px; font-weight: 300; color: #d4b896;
}
.mood-pill {
  display: flex; align-items: center; gap: 7px;
  padding: 6px 14px; border-radius: 20px;
  background: rgba(139,111,71,0.12);
  border: 1px solid rgba(212,184,150,0.12);
}
.mood-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #9aab8a;
  animation: pulse 2.2s ease-in-out infinite;
}
@keyframes pulse {
  0%,100% { opacity:1; transform:scale(1); }
  50% { opacity:0.45; transform:scale(0.6); }
}
.mood-text { font-size: 11.5px; color: #8b6f47; letter-spacing: 1px; }
.scroll-area {
  flex: 1; overflow-y: auto; padding: 28px 36px;
  scrollbar-width: thin; scrollbar-color: rgba(139,111,71,0.25) transparent;
}
@media(max-width:768px) {
  .app-shell { flex-direction: column; }
}
`

const PAGE_TITLES = {
  dashboard:  'Dashboard',
  chat:       'Your Safe Space',
  assessment: 'Overthinking Assessment',
  report:     'Wellness Report',
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [report, setReport] = useState(null)

  const handleReportReady = (r) => {
    setReport(r)
    setPage('report')
  }

  return (
    <>
      <style>{css}</style>
      <Background />
      <div className="app-shell">
        <Sidebar active={page} onNav={setPage} hasReport={!!report} />
        <div className="main-area">
          <div className="topbar">
            <div className="page-title">{PAGE_TITLES[page]}</div>
            <div className="mood-pill">
              <div className="mood-dot" />
              <span className="mood-text">
                {report ? report.overallState.toUpperCase() : 'SERENE IS LISTENING'}
              </span>
            </div>
          </div>
          <div className="scroll-area">
            {page === 'dashboard'   && <Dashboard report={report} onNav={setPage} />}
            {page === 'chat'        && <ChatPanel />}
            {page === 'assessment'  && <AssessmentPanel onReportReady={handleReportReady} />}
            {page === 'report'      && <ReportPanel report={report} />}
          </div>
        </div>
      </div>
    </>
  )
}
