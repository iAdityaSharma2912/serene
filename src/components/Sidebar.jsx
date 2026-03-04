import React from 'react'

const css = `
.sidebar {
  width: 258px;
  flex-shrink: 0;
  background: rgba(18,10,4,0.65);
  backdrop-filter: blur(22px);
  border-right: 1px solid rgba(212,184,150,0.1);
  display: flex;
  flex-direction: column;
  padding: 32px 20px;
  gap: 4px;
  z-index: 10;
}
.sidebar-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 30px;
  font-weight: 300;
  color: #d4b896;
  letter-spacing: 1.5px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}
.sidebar-tagline {
  font-size: 9.5px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #8b6f47;
  margin-bottom: 28px;
  padding-left: 2px;
}
.nav-section-label {
  font-size: 9px;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: rgba(139,111,71,0.5);
  padding: 12px 12px 6px;
}
.nav-btn {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 11px 14px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: transparent;
  color: rgba(212,184,150,0.5);
  font-size: 13.5px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.22s;
  width: 100%;
  text-align: left;
}
.nav-btn:hover {
  background: rgba(139,111,71,0.12);
  color: rgba(212,184,150,0.85);
}
.nav-btn.active {
  background: rgba(139,111,71,0.2);
  border-color: rgba(212,184,150,0.18);
  color: #d4b896;
}
.nav-icon {
  font-size: 17px;
  width: 22px;
  text-align: center;
  flex-shrink: 0;
}
.sidebar-footer {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid rgba(212,184,150,0.08);
}
.human-card {
  background: rgba(107,124,92,0.12);
  border: 1px solid rgba(154,171,138,0.18);
  border-radius: 12px;
  padding: 14px 16px;
}
.human-card-title {
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #9aab8a;
  margin-bottom: 6px;
}
.human-card-body {
  font-size: 12px;
  color: rgba(212,184,150,0.6);
  line-height: 1.55;
  margin-bottom: 10px;
}
.ig-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #9aab8a;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}
.ig-link:hover { color: #d4b896; }
`

const navItems = [
  { id: 'dashboard', icon: '◈', label: 'Dashboard' },
  { id: 'chat',      icon: '💬', label: 'Talk to Serene' },
  { id: 'assessment',icon: '📋', label: 'Overthinking Test' },
  { id: 'report',    icon: '📊', label: 'Wellness Report' },
]

export default function Sidebar({ active, onNav, hasReport }) {
  return (
    <>
      <style>{css}</style>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>🌿</span> Serene
        </div>
        <div className="sidebar-tagline">AI Therapy Companion</div>

        <div className="nav-section-label">Navigation</div>
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-btn${active === item.id ? ' active' : ''}`}
            onClick={() => onNav(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            {item.id === 'report' && hasReport && (
              <span style={{
                marginLeft:'auto', fontSize:'9px', padding:'2px 7px',
                background:'rgba(154,171,138,0.2)', border:'1px solid rgba(154,171,138,0.3)',
                borderRadius:'20px', color:'#9aab8a', letterSpacing:'1px'
              }}>NEW</span>
            )}
          </button>
        ))}

        <div className="sidebar-footer">
          <div className="human-card">
            <div className="human-card-title">🤝 Human Support</div>
            <div className="human-card-body">
              Need a real person to talk to? Reach out directly.
            </div>
            <a className="ig-link" href="https://instagram.com/iaddy29" target="_blank" rel="noreferrer">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              @iaddy29
            </a>
          </div>
        </div>
      </aside>
    </>
  )
}
