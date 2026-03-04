import React, { useState } from 'react'
import { questions } from '../utils/questions.js'
import { generateReport } from '../utils/api.js'

const css = `
.assess-wrap { max-width: 700px; }
.assess-header {
  font-family: 'Cormorant Garamond', serif;
  font-size: 34px; font-weight: 300;
  color: #d4b896; margin-bottom: 6px;
}
.assess-sub { color: #8b6f47; font-size: 14px; margin-bottom: 28px; line-height: 1.6; }
.progress-track {
  height: 3px; background: rgba(139,111,71,0.15);
  border-radius: 3px; margin-bottom: 28px; overflow: hidden;
}
.progress-fill {
  height:100%; border-radius:3px;
  background: linear-gradient(90deg, #8b6f47, #9aab8a);
  transition: width 0.5s cubic-bezier(0.4,0,0.2,1);
}
.progress-label {
  display: flex; justify-content: space-between;
  font-size: 11px; color: rgba(139,111,71,0.6);
  letter-spacing: 1.5px; text-transform: uppercase;
  margin-bottom: 8px;
}
.q-card {
  background: rgba(22,13,5,0.55);
  border: 1px solid rgba(212,184,150,0.1);
  border-radius: 14px; padding: 24px 26px;
  margin-bottom: 14px;
  backdrop-filter: blur(12px);
  transition: border-color 0.2s;
  animation: qIn 0.3s ease;
}
@keyframes qIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
.q-card.answered { border-color: rgba(212,184,150,0.2); }
.q-num { font-size: 10px; letter-spacing: 2.5px; color: #8b6f47; text-transform:uppercase; margin-bottom:8px; }
.q-text { font-size: 14.5px; color: #f5efe6; margin-bottom: 18px; line-height:1.6; }
.opts { display: flex; flex-wrap: wrap; gap: 9px; }
.opt {
  padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(212,184,150,0.18);
  background: rgba(139,111,71,0.08); color: rgba(212,184,150,0.6);
  font-size: 13px; cursor: pointer; transition: all 0.18s;
  font-family: 'DM Sans', sans-serif;
}
.opt:hover { background: rgba(139,111,71,0.2); color: #d4b896; }
.opt.sel {
  background: rgba(139,111,71,0.28);
  border-color: rgba(212,184,150,0.4);
  color: #d4b896;
}
.submit-row { margin-top: 22px; display: flex; align-items: center; gap: 16px; }
.submit-btn {
  padding: 13px 34px; border-radius: 10px; border: none;
  background: linear-gradient(135deg, #8b6f47, #6b7c5c);
  color: #f5efe6; font-size: 14.5px; font-weight: 500;
  cursor: pointer; transition: all 0.22s; letter-spacing: 0.3px;
}
.submit-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 28px rgba(139,111,71,0.28); }
.submit-btn:disabled { opacity:0.35; cursor:not-allowed; transform:none; box-shadow:none; }
.submit-hint { font-size: 12.5px; color: rgba(139,111,71,0.65); }
.loading-state {
  display:flex; flex-direction:column; align-items:center;
  justify-content:center; padding:60px 0; gap:16px;
}
.spinner {
  width:38px; height:38px; border-radius:50%;
  border:3px solid rgba(139,111,71,0.18);
  border-top-color:#8b6f47;
  animation: spin 0.75s linear infinite;
}
@keyframes spin { to { transform:rotate(360deg); } }
.loading-text { color:#8b6f47; font-size:14px; }
`

export default function AssessmentPanel({ onReportReady }) {
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)

  const answered = Object.keys(answers).length
  const pct = Math.round((answered / questions.length) * 100)

  const select = (qid, idx) => setAnswers(prev => ({ ...prev, [qid]: idx }))

  const submit = async () => {
    setLoading(true)
    const scoreRaw = Object.values(answers).reduce((a,b)=>a+b, 0)
    const maxScore = questions.length * 3
    const score = Math.round((scoreRaw / maxScore) * 100)

    const answersText = questions.map((q,i) =>
      `${i+1}. ${q.text}\nAnswer: ${q.options[answers[q.id]]}`
    ).join('\n\n')

    try {
      const report = await generateReport(answersText, score)
      onReportReady(report)
    } catch(e) {
      alert(`Report generation failed: ${e.message}\nCheck your API key in .env`)
    }
    setLoading(false)
  }

  if (loading) return (
    <>
      <style>{css}</style>
      <div className="loading-state">
        <div className="spinner" />
        <div className="loading-text">Serene is deeply understanding your patterns...</div>
      </div>
    </>
  )

  return (
    <>
      <style>{css}</style>
      <div className="assess-wrap">
        <div className="assess-header">Overthinking Assessment</div>
        <div className="assess-sub">
          Answer each question honestly. There are no right or wrong answers —
          only your truth. This helps Serene understand your unique mind patterns.
        </div>

        <div className="progress-label">
          <span>Progress</span>
          <span>{answered} / {questions.length} answered</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>

        {questions.map((q, i) => (
          <div key={q.id} className={`q-card${answers[q.id] !== undefined ? ' answered' : ''}`}>
            <div className="q-num">Question {i+1} of {questions.length}</div>
            <div className="q-text">{q.text}</div>
            <div className="opts">
              {q.options.map((opt, j) => (
                <button
                  key={j}
                  className={`opt${answers[q.id] === j ? ' sel' : ''}`}
                  onClick={() => select(q.id, j)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="submit-row">
          <button
            className="submit-btn"
            disabled={answered < questions.length}
            onClick={submit}
          >
            Generate My Report →
          </button>
          {answered < questions.length && (
            <span className="submit-hint">
              {questions.length - answered} question{questions.length - answered !== 1 ? 's' : ''} remaining
            </span>
          )}
        </div>
      </div>
    </>
  )
}
