import React from 'react'
import { severityConfig } from '../utils/questions.js'
import {
  RadialBarChart, RadialBar, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts'

const css = `
.dash-wrap {}
.dash-greeting {
  font-family: 'Cormorant Garamond', serif;
  font-size: 38px; font-weight: 300; color: #d4b896;
  margin-bottom: 4px;
}
.dash-sub { color: #8b6f47; font-size: 14px; margin-bottom: 32px; }

.dash-row { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; margin-bottom:20px; }
.dash-row-2 { display:grid; grid-template-columns:1.6fr 1fr; gap:14px; margin-bottom:20px; }
.dash-card {
  background: rgba(22,13,5,0.55);
  border:1px solid rgba(212,184,150,0.1);
  border-radius:14px; padding:22px;
  backdrop-filter:blur(12px); transition:border-color 0.2s;
}
.dash-card:hover { border-color:rgba(212,184,150,0.22); }
.dash-card-label { font-size:10px; letter-spacing:2.5px; text-transform:uppercase; color:#8b6f47; margin-bottom:10px; }
.dash-card-big { font-family:'Cormorant Garamond',serif; font-size:42px; font-weight:300; color:#d4b896; line-height:1; }
.dash-card-desc { font-size:12px; color:rgba(212,184,150,0.45); margin-top:6px; }

.quick-actions { display:flex; gap:12px; flex-wrap:wrap; }
.qa-btn {
  display:flex; align-items:center; gap:9px;
  padding:11px 20px; border-radius:10px;
  border:1px solid rgba(212,184,150,0.15);
  background:rgba(139,111,71,0.1); color:rgba(212,184,150,0.75);
  font-size:13px; cursor:pointer; transition:all 0.2s;
}
.qa-btn:hover { background:rgba(139,111,71,0.22); color:#d4b896; border-color:rgba(212,184,150,0.28); transform:translateY(-1px); }

.tip-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.tip-card {
  background:rgba(30,45,28,0.35);
  border:1px solid rgba(107,124,92,0.18);
  border-radius:11px; padding:16px;
}
.tip-icon { font-size:20px; margin-bottom:8px; }
.tip-title { font-size:12.5px; font-weight:500; color:#9aab8a; margin-bottom:5px; }
.tip-body { font-size:12px; color:rgba(212,184,150,0.6); line-height:1.6; }

.state-mini {
  border-radius:12px; padding:20px 22px;
  border:1px solid; margin-bottom:14px;
}
.state-mini-label { font-size:10px; letter-spacing:2px; text-transform:uppercase; margin-bottom:6px; }
.state-mini-value { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:300; }
`

const wellnessTips = [
  { icon:'🌬', title:'Box Breathing', body:'Inhale 4s · Hold 4s · Exhale 4s · Hold 4s. Resets your nervous system instantly.' },
  { icon:'📝', title:'Brain Dump', body:'Write every thought for 5 minutes. Getting it out of your head reduces its weight.' },
  { icon:'🌿', title:'5-4-3-2-1 Grounding', body:'Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.' },
  { icon:'⏰', title:'Worry Window', body:'Set a 15-min daily "worry time". Outside that window, defer all anxious thoughts.' },
]

function MiniGauge({ value, color }) {
  const data = [{ value }, { value: 100 - value }]
  return (
    <ResponsiveContainer width={80} height={80}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={26} outerRadius={36} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
          <Cell fill={color} />
          <Cell fill="rgba(139,111,71,0.1)" />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

export default function Dashboard({ report, onNav }) {
  const sev = report ? (severityConfig[report.severity] || severityConfig.moderate) : null
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <>
      <style>{css}</style>
      <div className="dash-wrap">
        <div className="dash-greeting">{greeting} 🌿</div>
        <div className="dash-sub">Welcome to your wellness dashboard. How are you feeling today?</div>

        {/* Quick actions */}
        <div className="dash-card" style={{ marginBottom:'20px' }}>
          <div className="dash-card-label">Quick Actions</div>
          <div className="quick-actions">
            <button className="qa-btn" onClick={() => onNav('chat')}>💬 Talk to Serene</button>
            <button className="qa-btn" onClick={() => onNav('assessment')}>📋 Take Assessment</button>
            {report && <button className="qa-btn" onClick={() => onNav('report')}>📊 View Report</button>}
          </div>
        </div>

        {/* Stats Row */}
        <div className="dash-row">
          <div className="dash-card">
            <div className="dash-card-label">Mental State</div>
            {report ? (
              <>
                <div className="dash-card-big" style={{ fontSize:'26px', marginTop:'6px', color: sev.color }}>{report.overallState}</div>
                <div className="dash-card-desc">From your latest assessment</div>
              </>
            ) : (
              <>
                <div className="dash-card-big" style={{ fontSize:'24px', color:'rgba(212,184,150,0.3)' }}>—</div>
                <div className="dash-card-desc">Take the assessment to see</div>
              </>
            )}
          </div>
          <div className="dash-card">
            <div className="dash-card-label">Overthinking Score</div>
            <div className="dash-card-big" style={{ color: report ? sev.color : 'rgba(212,184,150,0.3)' }}>
              {report ? report.overthinkingScore : '—'}
              {report && <span style={{ fontSize:'20px', color:'rgba(212,184,150,0.4)' }}>/100</span>}
            </div>
            <div className="dash-card-desc">{report ? 'Measured from 10 questions' : 'No assessment yet'}</div>
          </div>
          <div className="dash-card">
            <div className="dash-card-label">Mindfulness Score</div>
            <div className="dash-card-big" style={{ color: '#9aab8a' }}>
              {report ? report.mindfulnessScore : '—'}
              {report && <span style={{ fontSize:'20px', color:'rgba(212,184,150,0.4)' }}>/100</span>}
            </div>
            <div className="dash-card-desc">{report ? 'Present-moment awareness' : 'Complete a test first'}</div>
          </div>
        </div>

        {/* Visual + Tips */}
        <div className="dash-row-2">
          {/* Gauges if report */}
          {report ? (
            <div className="dash-card">
              <div className="dash-card-label">Score Visual Overview</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'8px' }}>
                {[
                  { label:'Overthinking', value:report.overthinkingScore, color:'#e8a07a' },
                  { label:'Mindfulness',  value:report.mindfulnessScore,  color:'#9aab8a' },
                  { label:'Resilience',   value:report.resilienceScore,   color:'#8b6f47' },
                  { label:'Clarity',      value:report.clarityScore,      color:'#d4b896' },
                ].map(s => (
                  <div key={s.label} style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <MiniGauge value={s.value} color={s.color} />
                    <div>
                      <div style={{ fontSize:'10px', letterSpacing:'1.5px', textTransform:'uppercase', color:s.color, marginBottom:'2px' }}>{s.label}</div>
                      <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'26px', color:s.color }}>{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="dash-card" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', gap:'12px' }}>
              <div style={{ fontSize:'48px' }}>🌀</div>
              <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'20px', color:'#d4b896' }}>No data yet</div>
              <div style={{ fontSize:'13px', color:'#8b6f47' }}>Complete the Overthinking Test to see your visual scores here.</div>
              <button className="qa-btn" style={{ marginTop:'4px' }} onClick={() => onNav('assessment')}>Take the Test →</button>
            </div>
          )}

          {/* Wellness Tips */}
          <div className="dash-card">
            <div className="dash-card-label">Daily Wellness Tips</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginTop:'8px' }}>
              {wellnessTips.slice(0,3).map(tip => (
                <div className="tip-card" key={tip.title}>
                  <div style={{ display:'flex', gap:'8px', alignItems:'flex-start' }}>
                    <span style={{ fontSize:'16px', flexShrink:0 }}>{tip.icon}</span>
                    <div>
                      <div className="tip-title">{tip.title}</div>
                      <div className="tip-body">{tip.body}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Report summary if available */}
        {report && (
          <div className="dash-card">
            <div className="dash-card-label">Your Affirmation</div>
            <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'20px', fontStyle:'italic', color:'#d4b896', lineHeight:1.6, marginTop:'6px' }}>
              "{report.affirmation}"
            </div>
            <button
              className="qa-btn"
              style={{ marginTop:'14px' }}
              onClick={() => onNav('report')}
            >
              View Full Report →
            </button>
          </div>
        )}
      </div>
    </>
  )
}
