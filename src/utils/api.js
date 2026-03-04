const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY
const MODEL   = import.meta.env.VITE_MODEL || 'mistralai/mistral-7b-instruct'
const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions'

export const THERAPIST_SYSTEM_PROMPT = `You are Serene, a compassionate and insightful AI therapist. You speak with warmth, depth, and genuine empathy — like a trusted friend who is also a licensed therapist.

Your approach:
- Always validate feelings before offering advice
- Ask one thoughtful follow-up question to understand deeper
- Detect signs of overthinking, anxiety, or rumination from language patterns
- After 2-3 exchanges, gently note the user's mental state
- Offer practical, evidence-based coping strategies (CBT, mindfulness, breathing, journaling)
- Use warm, grounding metaphors. Never be dismissive
- If crisis signs appear, recommend professional help and @iaddy29 on Instagram

Mental state detection — include EXACTLY ONE of these markers when clearly relevant:
[STATUS:OVERTHINKING] — racing thoughts, "what-ifs", catastrophizing, rumination
[STATUS:CALM] — grounded, present, balanced tone
[STATUS:ANXIOUS] — worry, physical tension, panic signals
[STATUS:STRESSED] — overwhelmed, burnt out, pressure
[STATUS:SAD] — low mood, grief, hopelessness signals

Speak in warm, measured sentences. Never use bullet points in replies — use flowing prose.`

export async function chatWithTherapist(messages) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'HTTP-Referer': window.location.href,
      'X-Title': 'Serene AI Therapist',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: THERAPIST_SYSTEM_PROMPT },
        ...messages.slice(-12),
      ],
      max_tokens: 520,
      temperature: 0.78,
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.error?.message || `HTTP ${res.status}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

export async function generateReport(answersText, score) {
  const prompt = `You are a clinical psychologist. Analyze this overthinking assessment (score: ${score}/100) and return ONLY a valid JSON object — no markdown, no explanation, no code fences.

Assessment answers:
${answersText}

Return JSON:
{
  "overallState": "2-3 word label e.g. Moderate Overthinking",
  "severity": "low|moderate|high|critical",
  "overthinkingScore": ${score},
  "mindfulnessScore": number 0-100,
  "resilienceScore": number 0-100,
  "clarityScore": number 0-100,
  "summary": "3 sentence compassionate summary of their mental patterns",
  "patterns": ["array of 4 specific thinking patterns identified"],
  "triggers": ["array of 3 likely emotional triggers"],
  "strengths": ["array of 3 strengths visible in their answers"],
  "remedies": {
    "immediate": ["3 immediate grounding techniques with brief how-to"],
    "daily": ["3 daily practices with context"],
    "longTerm": ["3 long-term strategies"]
  },
  "breathingExercise": "a specific breathing technique with step-by-step instructions",
  "journalPrompt": "a single powerful journaling prompt tailored to their patterns",
  "affirmation": "a short personalized affirmation for their state",
  "professionalNote": "brief note on whether professional support is recommended"
}`

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'HTTP-Referer': window.location.href,
      'X-Title': 'Serene Report Generator',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1100,
      temperature: 0.4,
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.error?.message || `HTTP ${res.status}`)
  }
  const data = await res.json()
  let raw = data.choices?.[0]?.message?.content || '{}'
  raw = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(raw)
}
