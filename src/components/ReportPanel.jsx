import React, { useEffect, useRef } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts'
import { severityConfig } from '../utils/questions.js'
import { downloadReport } from '../utils/pdfExport.js'

const css = `
.report-page { max-width: 820px; }
.report-header-row { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:28px; gap:16px; flex-wrap:wrap; }
.report-title { font-family:'Cormorant Garamond',serif; font-size:36px; font-weight:300; color:#d4b896; }
.report-date { font-size:11px; letter-spacing:2.5px; text-transform:uppercase; color:#8b6f47; margin-top:4px; }
.dl-btn {
  padding:11px 22px; border-radius:9px; border:1px solid rgba(212,184,150,0.22);
  background:rgba(139,111,71,0.15); color:#d4b896;
  font-size:13px; font-weight:500; cursor:pointer; transition:all 0.2s;
  display:flex; align-items:center; gap:8px; flex-shrink:0;
}
.dl-btn:hover { background:rgba(139,111,71,0.28); border-color:rgba(212,184,150,0.38); transform:translateY(-1px); }

/* State hero */
.state-hero {
  border-radius:16px; padding:28px 32px;
  border:1px solid; margin-bottom:24px;
  display:flex; align-items:center; gap:24px;
  animation:heroIn 0.5s ease;
}
@keyframes heroIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
.state-icon { font-size:52px; line-height:1; }
.state-info {}
.state-label { font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:300; margin-bottom:4px; }
.state-desc { font-size:13.5px; line-height:1.65; opacity:0.8; }

/* Score grid */
.score-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(175px,1fr)); gap:14px; margin-bottom:24px; }
.score-card {
  background:rgba(22,13,5,0.55);
  border:1px solid rgba(212,184,150,0.1);
  border-radius:13px; padding:18px 20px;
  backdrop-filter:blur(10px);
  transition:border-color 0.2s;
}
.score-card:hover { border-color:rgba(212,184,150,0.22); }
.score-card-label { font-size:10px; letter-spacing:2px; text-transform:uppercase; margin-bottom:10px; }
.score-card-value { font-family:'Cormorant Garamond',serif; font-size:38px; font-weight:300; line-height:1; margin-bottom:6px; }
.score-card-desc { font-size:11.5px; color:rgba(212,184,150,0.5); }

/* charts row */
.charts-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px; }
.chart-card {
  background:rgba(22,13,5,0.55);
  border:1px solid rgba(212,184,150,0.1);
  border-radius:13px; padding:20px;
  backdrop-filter:blur(10px);
}
.chart-title { font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#8b6f47; margin-bottom:16px; }

/* sections */
.report-section {
  background:rgba(22,13,5,0.55);
  border:1px solid rgba(212,184,150,0.1);
  border-radius:13px; padding:22px 24px;
  margin-bottom:14px; backdrop-filter:blur(10px);
}
.section-title {
  font-family:'Cormorant Garamond',serif; font-size:18px;
  color:#d4b896; margin-bottom:12px;
  display:flex; align-items:center; gap:8px;
}
.tag {
  display:inline-block; padding:5px 13px; border-radius:20px;
  background:rgba(107,124,92,0.18); border:1px solid rgba(154,171,138,0.22);
  color:#9aab8a; font-size:12px; margin:3px; letter-spacing:0.3px;
}
.tag.trigger {
  background:rgba(196,113,79,0.15); border-color:rgba(196,113,79,0.25); color:#e8a07a;
}
.tag.strength {
  background:rgba(139,111,71,0.15); border-color:rgba(212,184,150,0.22); color:#d4b896;
}
.remedy-group { margin-bottom:14px; }
.remedy-group-title { font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#6b7c5c; margin-bottom:8px; }
.remedy-item { font-size:13.5px; color:rgba(212,184,150,0.78); margin-bottom:7px; line-height:1.65; display:flex; gap:8px; }
.remedy-dot { color:#8b6f47; flex-shrink:0; margin-top:2px; }
.affirmation-box {
  background:rgba(50,35,18,0.6);
  border:1px solid rgba(212,184,150,0.18);
  border-radius:12px; padding:22px 28px;
  margin-bottom:14px; text-align:center;
}
.affirmation-text {
  font-family:'Cormorant Garamond',serif;
  font-size:20px; font-style:italic; color:#d4b896; line-height:1.6;
}
.breathing-box {
  background:rgba(30,45,30,0.4);
  border:1px solid rgba(107,124,92,0.25);
  border-radius:12px; padding:20px 24px; margin-bottom:14px;
}
.journal-box {
  background:rgba(35,25,12,0.6);
  border:1px solid rgba(139,111,71,0.2);
  border-radius:12px; padding:20px 24px; margin-bottom:14px;
}
.ig-cta {
  background:rgba(107,124,92,0.1);
  border:1px solid rgba(154,171,138,0.2);
  border-radius:12px; padding:20px 24px;
  display:flex; align-items:center; justify-content:space-between; gap:16px;
}
.ig-cta-text { font-size:13.5px; color:rgba(212,184,150,0.7); line-height:1.6; }
.ig-btn {
  display:inline-flex; align-items:center; gap:8px;
  padding:10px 20px; border-radius:8px; border:1px solid rgba(154,171,138,0.3);
  background:rgba(107,124,92,0.2); color:#9aab8a;
  font-size:13px; font-weight:500; cursor:pointer; text-decoration:none;
  transition:all 0.2s; white-space:nowrap; flex-shrink:0;
}
.ig-btn:hover { background:rgba(107,124,92,0.35); color:#d4b896; }

@media(max-width:600px) {
  .charts-row { grid-template-columns:1fr; }
  .score-grid { grid-template-columns:1fr 1fr; }
}
`

const COLORS = {
  overthinking: '#e8a07a',
  mindfulness: '#9aab8a',
  resilience: '#8b6f47',
  clarity: '#d4b896',
}

function ScoreRing({ value, color, size = 68 }) {
  const r = (size / 2) - 6
  const circ = 2 * Math.PI * r
  const fill = (value / 100) * circ
  return (
    <svg width={size} height={size} style={{ display:'block' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(139,111,71,0.12)" strokeWidth="5"/>
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth="5"
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition:'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  )
}

export default function ReportPanel({ report }) {
  if (!report) return (
    <>
      <style>{css}</style>
      <div style={{ textAlign:'center', padding:'80px 0' }}>
        <div style={{ fontSize:'52px', marginBottom:'16px' }}>📋</div>
        <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'22px', color:'#d4b896', marginBottom:'8px' }}>No Report Yet</div>
        <div style={{ color:'#8b6f47', fontSize:'14px' }}>Complete the Overthinking Test to generate your personal wellness report.</div>
      </div>
    </>
  )

  const sev = severityConfig[report.severity] || severityConfig.moderate
  const date = new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})

  const radarData = [
    { subject:'Overthinking', value: report.overthinkingScore },
    { subject:'Mindfulness', value: report.mindfulnessScore },
    { subject:'Resilience', value: report.resilienceScore },
    { subject:'Clarity', value: report.clarityScore },
  ]

  const barData = [
    { name:'Overthinking', score: report.overthinkingScore, color: COLORS.overthinking },
    { name:'Mindfulness',  score: report.mindfulnessScore,  color: COLORS.mindfulness },
    { name:'Resilience',   score: report.resilienceScore,   color: COLORS.resilience },
    { name:'Clarity',      score: report.clarityScore,      color: COLORS.clarity },
  ]

  const scores = [
    { label:'Overthinking',  value: report.overthinkingScore,  color: COLORS.overthinking, desc:'Rumination level' },
    { label:'Mindfulness',   value: report.mindfulnessScore,   color: COLORS.mindfulness,  desc:'Present awareness' },
    { label:'Resilience',    value: report.resilienceScore,    color: COLORS.resilience,   desc:'Emotional bounce-back' },
    { label:'Mental Clarity',value: report.clarityScore,       color: COLORS.clarity,      desc:'Focus & decisions' },
  ]

  return (
    <>
      <style>{css}</style>
      <div className="report-page">

        <div className="report-header-row">
          <div>
            <div className="report-title">Your Wellness Report</div>
            <div className="report-date">{date}</div>
          </div>
          <button className="dl-btn" onClick={() => downloadReport(report)}>
            ⬇ Download PDF Report
          </button>
        </div>

        {/* State Hero */}
        <div className="state-hero" style={{ background: sev.bg, borderColor: sev.border, color: sev.color }}>
          <div className="state-icon">{sev.icon}</div>
          <div className="state-info">
            <div className="state-label">{report.overallState}</div>
            <div className="state-desc">{sev.description}</div>
          </div>
          <div style={{ marginLeft:'auto', textAlign:'center', flexShrink:0 }}>
            <ScoreRing value={report.overthinkingScore} color={sev.color} size={72}/>
            <div style={{ fontSize:'11px', letterSpacing:'1.5px', textTransform:'uppercase', marginTop:'4px', opacity:0.7 }}>Score</div>
            <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'22px' }}>{report.overthinkingScore}/100</div>
          </div>
        </div>

        {/* Score Grid */}
        <div className="score-grid">
          {scores.map(s => (
            <div className="score-card" key={s.label}>
              <div className="score-card-label" style={{ color: s.color }}>{s.label}</div>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <ScoreRing value={s.value} color={s.color} size={52}/>
                <div>
                  <div className="score-card-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="score-card-desc">{s.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="charts-row">
          <div className="chart-card">
            <div className="chart-title">Mind Wellness Radar</div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(139,111,71,0.2)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill:'#8b6f47', fontSize:11 }} />
                <PolarRadiusAxis domain={[0,100]} tick={false} axisLine={false} />
                <Radar name="Score" dataKey="value" stroke="#8b6f47" fill="#8b6f47" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card">
            <div className="chart-title">Score Breakdown</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} barCategoryGap="28%">
                <XAxis dataKey="name" tick={{ fill:'#8b6f47', fontSize:10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0,100]} tick={{ fill:'rgba(139,111,71,0.5)', fontSize:10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background:'#1a1008', border:'1px solid rgba(212,184,150,0.2)', borderRadius:'8px', color:'#d4b896' }}
                  cursor={{ fill:'rgba(139,111,71,0.08)' }}
                />
                <Bar dataKey="score" radius={[5,5,0,0]}>
                  {barData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary */}
        <div className="report-section">
          <div className="section-title">🌿 Summary</div>
          <p style={{ fontSize:'14px', color:'rgba(212,184,150,0.8)', lineHeight:1.8 }}>{report.summary}</p>
        </div>

        {/* Patterns + Triggers + Strengths */}
        <div className="report-section">
          <div className="section-title">🌀 Thinking Patterns</div>
          {(report.patterns || []).map((p,i) => <span key={i} className="tag">{p}</span>)}
        </div>
        <div className="charts-row" style={{ gridTemplateColumns:'1fr 1fr' }}>
          <div className="report-section" style={{ marginBottom:0 }}>
            <div className="section-title">⚡ Triggers</div>
            {(report.triggers || []).map((t,i) => <span key={i} className="tag trigger">{t}</span>)}
          </div>
          <div className="report-section" style={{ marginBottom:0 }}>
            <div className="section-title">✦ Your Strengths</div>
            {(report.strengths || []).map((s,i) => <span key={i} className="tag strength">{s}</span>)}
          </div>
        </div>
        <div style={{ marginBottom:'14px' }} />

        {/* Remedies */}
        <div className="report-section">
          <div className="section-title">🌱 Personalised Remedies</div>
          {[
            { key:'immediate', icon:'⚡', title:'Immediate Relief' },
            { key:'daily',     icon:'☀',  title:'Daily Practices' },
            { key:'longTerm',  icon:'🌱',  title:'Long-Term Strategies' },
          ].map(group => (
            <div className="remedy-group" key={group.key}>
              <div className="remedy-group-title">{group.icon} {group.title}</div>
              {(report.remedies?.[group.key] || []).map((r,i) => (
                <div className="remedy-item" key={i}>
                  <span className="remedy-dot">◦</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Breathing */}
        <div className="breathing-box">
          <div style={{ fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'#9aab8a', marginBottom:'8px' }}>
            🌬 Breathing Exercise
          </div>
          <p style={{ fontSize:'13.5px', color:'rgba(180,210,165,0.85)', lineHeight:1.7 }}>{report.breathingExercise}</p>
        </div>

        {/* Journal */}
        <div className="journal-box">
          <div style={{ fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'#8b6f47', marginBottom:'8px' }}>
            ✍ Journal Prompt
          </div>
          <p style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'17px', fontStyle:'italic', color:'rgba(212,184,150,0.85)', lineHeight:1.7 }}>
            "{report.journalPrompt}"
          </p>
        </div>

        {/* Affirmation */}
        <div className="affirmation-box">
          <div style={{ fontSize:'10px', letterSpacing:'2.5px', textTransform:'uppercase', color:'#8b6f47', marginBottom:'10px' }}>
            ✨ Your Affirmation
          </div>
          <div className="affirmation-text">"{report.affirmation}"</div>
        </div>

        {/* Human Support */}
        <div className="ig-cta">
          <div className="ig-cta-text">
            <strong style={{ color:'#9aab8a' }}>🤝 Need a real human?</strong><br/>
            Serene is here, but sometimes we need a genuine human connection. Reach out directly.
          </div>
          <a className="ig-btn" href="https://instagram.com/iaddy29" target="_blank" rel="noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            @iaddy29
          </a>
        </div>

      </div>
    </>
  )
}
