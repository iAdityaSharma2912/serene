export const questions = [
  {
    id: 'q1',
    text: 'How often do you replay past conversations or events in your mind?',
    options: ['Rarely or never', 'Sometimes', 'Quite often', 'Almost constantly'],
  },
  {
    id: 'q2',
    text: 'When you make a decision, how long do you spend second-guessing it?',
    options: ['Minutes, then I move on', 'A few hours', 'Several days', 'I rarely stop questioning it'],
  },
  {
    id: 'q3',
    text: 'How frequently do you lie awake with racing or spiraling thoughts?',
    options: ['Almost never', 'Occasionally', 'Several times a week', 'Nearly every night'],
  },
  {
    id: 'q4',
    text: 'How often do you imagine worst-case scenarios before they happen?',
    options: ['Rarely', 'Sometimes', 'Frequently', 'It feels like my default setting'],
  },
  {
    id: 'q5',
    text: 'How much mental energy goes toward things outside your control?',
    options: ['Very little', 'Some', 'Quite a bit', 'Most of my energy'],
  },
  {
    id: 'q6',
    text: 'When something goes wrong, how quickly can you release it?',
    options: ['Within minutes', 'Same day', 'Several days', 'It stays with me long-term'],
  },
  {
    id: 'q7',
    text: 'How difficult is it to stay present without your mind wandering?',
    options: ["I'm usually present", 'Occasionally challenging', 'Often challenging', 'Very difficult'],
  },
  {
    id: 'q8',
    text: 'How often do you feel mentally exhausted from your own thoughts?',
    options: ['Rarely', 'Sometimes', 'Often', 'Daily'],
  },
  {
    id: 'q9',
    text: 'Do you tend to over-analyze what other people think of you?',
    options: ['Not really', 'Sometimes', 'Frequently', 'Constantly'],
  },
  {
    id: 'q10',
    text: 'How often do you feel like you cannot "switch off" your mind?',
    options: ['Almost never', 'Occasionally', 'Often', 'I don\'t remember the last time I did'],
  },
]

export const severityConfig = {
  low: {
    label: 'Grounded & Clear',
    color: '#9aab8a',
    bg: 'rgba(107,124,92,0.15)',
    border: 'rgba(154,171,138,0.3)',
    icon: '🌿',
    description: 'Your mind is largely at peace. You show strong emotional regulation and present-moment awareness.',
  },
  moderate: {
    label: 'Mild Overthinking',
    color: '#d4b896',
    bg: 'rgba(139,111,71,0.15)',
    border: 'rgba(212,184,150,0.3)',
    icon: '🍂',
    description: 'Some thought patterns are getting in the way, but you have good awareness and capacity to shift them.',
  },
  high: {
    label: 'Active Overthinking',
    color: '#e8a07a',
    bg: 'rgba(196,113,79,0.15)',
    border: 'rgba(232,160,122,0.3)',
    icon: '🌀',
    description: 'Recurring thought loops are affecting your clarity and rest. Intentional practice will help considerably.',
  },
  critical: {
    label: 'Intensive Rumination',
    color: '#e08070',
    bg: 'rgba(180,90,70,0.15)',
    border: 'rgba(224,128,112,0.3)',
    icon: '🫀',
    description: 'Your mind is working very hard. Please be gentle with yourself — support and strategies can make a real difference.',
  },
}
