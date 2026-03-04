import jsPDF from 'jspdf'

export function downloadReport(report) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentW = W - margin * 2
  let y = 0

  // Helpers
  const serif = () => doc.setFont('times', 'italic')
  const sans  = () => doc.setFont('helvetica', 'normal')
  const bold  = () => doc.setFont('helvetica', 'bold')
  const addPage = () => { doc.addPage(); y = 24 }
  const checkY = (needed = 20) => { if (y + needed > 270) addPage() }

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1,3),16)
    const g = parseInt(hex.slice(3,5),16)
    const b = parseInt(hex.slice(5,7),16)
    return [r,g,b]
  }

  // ── COVER ──
  doc.setFillColor(26, 16, 8)
  doc.rect(0, 0, W, 297, 'F')

  // decorative accent bar
  doc.setFillColor(139, 111, 71)
  doc.rect(0, 0, W, 3, 'F')

  doc.setFillColor(107, 124, 92)
  doc.rect(margin, 50, 4, 60, 'F')

  serif()
  doc.setFontSize(42)
  doc.setTextColor(212, 184, 150)
  doc.text('Serene', margin + 12, 75)

  sans()
  doc.setFontSize(11)
  doc.setTextColor(139, 111, 71)
  doc.text('AI THERAPY COMPANION', margin + 12, 85)
  doc.text('WELLNESS REPORT', margin + 12, 92)

  // Score circle (drawn manually)
  const cx = W - margin - 28, cy = 75, cr = 22
  doc.setDrawColor(139, 111, 71)
  doc.setLineWidth(0.4)
  doc.circle(cx, cy, cr)
  doc.setFontSize(24)
  serif()
  doc.setTextColor(212, 184, 150)
  doc.text(String(report.overthinkingScore), cx, cy - 2, { align: 'center' })
  sans()
  doc.setFontSize(7)
  doc.setTextColor(139, 111, 71)
  doc.text('SCORE', cx, cy + 6, { align: 'center' })
  doc.text('/100', cx, cy + 11, { align: 'center' })

  // State badge
  const severityColors = { low: [154,171,138], moderate: [212,184,150], high: [232,160,122], critical: [224,128,112] }
  const [sr,sg,sb] = severityColors[report.severity] || [212,184,150]
  doc.setFillColor(sr, sg, sb)
  doc.roundedRect(margin + 12, 105, 80, 10, 2, 2, 'F')
  bold()
  doc.setFontSize(9)
  doc.setTextColor(26,16,8)
  doc.text(report.overallState.toUpperCase(), margin + 52, 111.5, { align: 'center' })

  // Date
  sans()
  doc.setFontSize(9)
  doc.setTextColor(92, 64, 51)
  doc.text(new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'}), margin + 12, 125)

  // Summary on cover
  doc.setFontSize(10)
  doc.setTextColor(180, 155, 120)
  const summaryLines = doc.splitTextToSize(report.summary, contentW - 8)
  doc.text(summaryLines, margin + 12, 140)

  // ── PAGE 2: SCORES ──
  addPage()
  doc.setFillColor(26,16,8)
  doc.rect(0,0,W,297,'F')
  doc.setFillColor(139,111,71)
  doc.rect(0,0,W,1,'F')

  bold()
  doc.setFontSize(13)
  doc.setTextColor(212,184,150)
  doc.text('MENTAL WELLNESS SCORES', margin, y)
  y += 12

  const scores = [
    { label: 'Overthinking', value: report.overthinkingScore, color: [232,160,122], desc: 'Rumination & thought loops' },
    { label: 'Mindfulness', value: report.mindfulnessScore, color: [154,171,138], desc: 'Present-moment awareness' },
    { label: 'Resilience', value: report.resilienceScore, color: [139,111,71], desc: 'Emotional bounce-back' },
    { label: 'Mental Clarity', value: report.clarityScore, color: [212,184,150], desc: 'Focus & decision quality' },
  ]

  scores.forEach(s => {
    checkY(22)
    sans()
    doc.setFontSize(9)
    doc.setTextColor(...s.color)
    doc.text(s.label.toUpperCase(), margin, y)
    doc.setTextColor(92,64,51)
    doc.setFontSize(8)
    doc.text(s.desc, margin, y + 5)

    // bar background
    doc.setFillColor(40,28,16)
    doc.roundedRect(margin + 55, y - 4, contentW - 55 - 28, 8, 2, 2, 'F')
    // bar fill
    doc.setFillColor(...s.color)
    const barW = Math.max(4, ((s.value / 100) * (contentW - 55 - 28)))
    doc.roundedRect(margin + 55, y - 4, barW, 8, 2, 2, 'F')
    // value
    bold()
    doc.setFontSize(11)
    doc.setTextColor(...s.color)
    doc.text(String(s.value), W - margin - 2, y + 2, { align: 'right' })
    y += 18
  })

  // ── PATTERNS & TRIGGERS ──
  y += 6
  checkY(50)

  const sectionTitle = (title, icon='') => {
    checkY(18)
    doc.setFillColor(40,28,16)
    doc.rect(margin, y, contentW, 9, 'F')
    bold()
    doc.setFontSize(10)
    doc.setTextColor(212,184,150)
    doc.text(`${icon}  ${title}`, margin + 4, y + 6.5)
    y += 16
  }

  const bulletList = (items, color=[180,155,120]) => {
    items.forEach(item => {
      checkY(10)
      doc.setFillColor(...color)
      doc.circle(margin + 3, y - 1, 1.2, 'F')
      sans()
      doc.setFontSize(9.5)
      doc.setTextColor(180,155,120)
      const lines = doc.splitTextToSize(item, contentW - 10)
      doc.text(lines, margin + 8, y)
      y += lines.length * 5.5 + 2
    })
  }

  sectionTitle('THINKING PATTERNS IDENTIFIED', '◈')
  bulletList(report.patterns || [], [212,184,150])
  y += 4

  sectionTitle('EMOTIONAL TRIGGERS', '◉')
  bulletList(report.triggers || [], [196,113,79])
  y += 4

  sectionTitle('YOUR STRENGTHS', '✦')
  bulletList(report.strengths || [], [154,171,138])
  y += 4

  // ── PAGE 3: REMEDIES ──
  addPage()
  doc.setFillColor(26,16,8)
  doc.rect(0,0,W,297,'F')
  doc.setFillColor(139,111,71)
  doc.rect(0,0,W,1,'F')

  bold()
  doc.setFontSize(13)
  doc.setTextColor(212,184,150)
  doc.text('PERSONALISED REMEDIES', margin, y)
  y += 12

  sectionTitle('IMMEDIATE RELIEF TECHNIQUES', '⚡')
  bulletList(report.remedies?.immediate || [])
  y += 4

  sectionTitle('DAILY PRACTICES', '☀')
  bulletList(report.remedies?.daily || [])
  y += 4

  sectionTitle('LONG-TERM STRATEGIES', '🌱')
  bulletList(report.remedies?.longTerm || [])
  y += 4

  // Breathing exercise box
  checkY(40)
  doc.setFillColor(30,50,30)
  doc.setDrawColor(107,124,92)
  doc.setLineWidth(0.5)
  doc.roundedRect(margin, y, contentW, 36, 3, 3, 'FD')
  bold()
  doc.setFontSize(9)
  doc.setTextColor(154,171,138)
  doc.text('BREATHING EXERCISE', margin + 5, y + 8)
  sans()
  doc.setFontSize(8.5)
  doc.setTextColor(180,200,165)
  const bLines = doc.splitTextToSize(report.breathingExercise || '', contentW - 10)
  doc.text(bLines, margin + 5, y + 15)
  y += 44

  // Journal prompt box
  checkY(30)
  doc.setFillColor(35,25,12)
  doc.setDrawColor(139,111,71)
  doc.roundedRect(margin, y, contentW, 28, 3, 3, 'FD')
  bold()
  doc.setFontSize(9)
  doc.setTextColor(212,184,150)
  doc.text('JOURNAL PROMPT', margin + 5, y + 8)
  serif()
  doc.setFontSize(9.5)
  doc.setTextColor(200,175,140)
  const jLines = doc.splitTextToSize(`"${report.journalPrompt}"`, contentW - 10)
  doc.text(jLines, margin + 5, y + 16)
  y += 36

  // Affirmation
  checkY(22)
  doc.setFillColor(50,35,18)
  doc.roundedRect(margin, y, contentW, 18, 3, 3, 'F')
  serif()
  doc.setFontSize(12)
  doc.setTextColor(212,184,150)
  doc.text(`"${report.affirmation}"`, W / 2, y + 12, { align: 'center' })
  y += 26

  // Professional note
  if (report.professionalNote) {
    checkY(20)
    sans()
    doc.setFontSize(8.5)
    doc.setTextColor(139,111,71)
    const pLines = doc.splitTextToSize(`Professional Note: ${report.professionalNote}`, contentW)
    doc.text(pLines, margin, y)
    y += pLines.length * 5 + 6
  }

  // Human support footer
  checkY(22)
  doc.setFillColor(30,45,30)
  doc.setDrawColor(107,124,92)
  doc.roundedRect(margin, y, contentW, 18, 3, 3, 'FD')
  bold()
  doc.setFontSize(9)
  doc.setTextColor(154,171,138)
  doc.text('🤝  HUMAN SUPPORT', margin + 5, y + 8)
  sans()
  doc.setFontSize(8.5)
  doc.setTextColor(154,171,138)
  doc.text('Reach out for a real human connection: @iaddy29 on Instagram', margin + 5, y + 14.5)
  y += 26

  // Page numbers
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    sans()
    doc.setFontSize(7)
    doc.setTextColor(60,42,25)
    doc.text(`Serene AI Therapy Companion  •  Page ${i} of ${pageCount}`, W / 2, 290, { align: 'center' })
  }

  doc.save(`Serene_Wellness_Report_${new Date().toISOString().split('T')[0]}.pdf`)
}
