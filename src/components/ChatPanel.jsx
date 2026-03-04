import React, { useState, useRef, useEffect } from 'react'
import { chatWithTherapist } from '../utils/api.js'

const css = `
.chat-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 16px;
}
.status-banner {
  padding: 13px 18px;
  border-radius: 12px;
  border: 1px solid;
  font-size: 13.5px;
  line-height: 1.6;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  animation: fadeIn 0.4s ease;
}
.status-banner.hidden { display: none; }
@keyframes fadeIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:none; } }
.chat-messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: rgba(139,111,71,0.25) transparent;
}
.msg {
  display: flex;
  gap: 13px;
  animation: msgIn 0.35s ease;
}
@keyframes msgIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
.msg.user { flex-direction: row-reverse; }
.msg-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 17px; flex-shrink: 0;
}
.msg.ai .msg-avatar { background: linear-gradient(135deg,#8b6f47,#6b7c5c); }
.msg.user .msg-avatar {
  background: rgba(196,113,79,0.25);
  border: 1px solid rgba(196,113,79,0.35);
}
.msg-bubble {
  max-width: 68%;
  padding: 13px 17px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.75;
}
.msg.ai .msg-bubble {
  background: rgba(139,111,71,0.13);
  border: 1px solid rgba(212,184,150,0.11);
  color: #f5efe6;
  border-radius: 4px 16px 16px 16px;
}
.msg.user .msg-bubble {
  background: rgba(196,113,79,0.18);
  border: 1px solid rgba(196,113,79,0.22);
  color: #f5efe6;
  border-radius: 16px 4px 16px 16px;
}
.typing { display:flex; gap:5px; padding:4px 0; }
.typing span {
  width:7px; height:7px; border-radius:50%;
  background:#8b6f47;
  animation: blink 1.1s ease-in-out infinite;
}
.typing span:nth-child(2) { animation-delay:0.18s; }
.typing span:nth-child(3) { animation-delay:0.36s; }
@keyframes blink {
  0%,80%,100% { transform:translateY(0); opacity:0.7; }
  40% { transform:translateY(-7px); opacity:1; }
}
.chat-input-row {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  background: rgba(22,13,5,0.6);
  border: 1px solid rgba(212,184,150,0.13);
  border-radius: 14px;
  padding: 14px;
  backdrop-filter: blur(12px);
  transition: border-color 0.2s;
}
.chat-input-row:focus-within { border-color: rgba(212,184,150,0.28); }
.chat-ta {
  flex:1; background:transparent; border:none; outline:none;
  color:#f5efe6; font-size:14px; resize:none;
  line-height:1.6; max-height:110px; min-height:22px;
}
.chat-ta::placeholder { color:rgba(212,184,150,0.3); }
.send-btn {
  width:40px; height:40px; border-radius:9px; border:none;
  background: linear-gradient(135deg,#8b6f47,#6b7c5c);
  color:#f5efe6; font-size:18px;
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; flex-shrink:0; transition:all 0.18s;
}
.send-btn:hover:not(:disabled) { transform:scale(1.06); }
.send-btn:disabled { opacity:0.35; cursor:not-allowed; }
`

const STATUS_STYLES = {
  OVERTHINKING: { bg:'rgba(196,113,79,0.12)', border:'rgba(232,160,122,0.28)', color:'#e8a07a', icon:'🌀', text:'Thought loops detected. Your mind is spinning, but this moment is safe. Let\'s slow it down together.' },
  ANXIOUS:      { bg:'rgba(180,90,70,0.12)',  border:'rgba(224,128,112,0.28)', color:'#e08070', icon:'🫀', text:'Some anxiety signals are present. Take a slow breath — you\'re in a safe space.' },
  STRESSED:     { bg:'rgba(160,100,60,0.12)', border:'rgba(210,150,100,0.28)', color:'#d4a070', icon:'⚡', text:'You seem under pressure right now. Let\'s find some stillness together.' },
  CALM:         { bg:'rgba(107,124,92,0.13)', border:'rgba(154,171,138,0.28)', color:'#9aab8a', icon:'🌿', text:'You seem grounded and present. This is a beautiful state to nurture.' },
  SAD:          { bg:'rgba(80,80,120,0.12)',  border:'rgba(130,130,180,0.25)', color:'#a0a0d4', icon:'🌧', text:'I sense a heaviness in your heart. You\'re not alone in this — let\'s sit with it together.' },
}

function parseStatus(text) {
  const m = text.match(/\[STATUS:(OVERTHINKING|CALM|ANXIOUS|STRESSED|SAD)\]/)
  return m ? m[1] : null
}

function stripStatus(text) {
  return text.replace(/\[STATUS:[^\]]+\]/g, '').trim()
}

export default function ChatPanel() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [history, setHistory] = useState([])
  const messagesEndRef = useRef(null)
  const taRef = useRef(null)

  useEffect(() => {
    setMessages([{
      role: 'ai',
      text: "Hello, I'm **Serene** 🌿 — your personal AI therapist.\n\nThis is your safe space. No judgment, only understanding and warmth. What's been weighing on your heart today?"
    }])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [messages, loading])

  const formatText = (t) =>
    t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')

  async function send() {
    const txt = input.trim()
    if (!txt || loading) return
    setInput('')
    if (taRef.current) taRef.current.style.height = 'auto'

    const newMsg = { role:'user', text: txt }
    setMessages(prev => [...prev, newMsg])
    const newHistory = [...history, { role:'user', content: txt }]
    setHistory(newHistory)
    setLoading(true)

    try {
      const reply = await chatWithTherapist(newHistory)
      const detected = parseStatus(reply)
      const clean = stripStatus(reply)
      if (detected) setStatus(detected)
      const assistantMsg = { role:'ai', text: clean }
      setMessages(prev => [...prev, assistantMsg])
      setHistory(prev => [...prev, { role:'assistant', content: clean }])
    } catch(e) {
      setMessages(prev => [...prev, {
        role:'ai',
        text:`I'm having a moment of quiet... (${e.message}). Please check your API key in the .env file.`
      }])
    }
    setLoading(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const autoResize = (e) => {
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 110) + 'px'
  }

  const st = status ? STATUS_STYLES[status] : null

  return (
    <>
      <style>{css}</style>
      <div className="chat-panel">
        {st && (
          <div className="status-banner" style={{ background: st.bg, borderColor: st.border, color: st.color }}>
            <span style={{fontSize:'18px'}}>{st.icon}</span>
            <span>{st.text}</span>
          </div>
        )}
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              <div className="msg-avatar">{m.role === 'ai' ? '🌿' : '👤'}</div>
              <div
                className="msg-bubble"
                dangerouslySetInnerHTML={{ __html: formatText(m.text) }}
              />
            </div>
          ))}
          {loading && (
            <div className="msg ai">
              <div className="msg-avatar">🌿</div>
              <div className="msg-bubble">
                <div className="typing">
                  <span/><span/><span/>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-row">
          <textarea
            ref={taRef}
            className="chat-ta"
            placeholder="Share what's on your mind..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            onInput={autoResize}
            rows={1}
          />
          <button className="send-btn" onClick={send} disabled={loading || !input.trim()}>↑</button>
        </div>
      </div>
    </>
  )
}
