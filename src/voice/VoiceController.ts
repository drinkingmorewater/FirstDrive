import { scriptedAnswers } from './ScriptedVoiceProvider'

export const answerVoiceIntent = (utterance: string) => {
  const exact = scriptedAnswers[utterance]
  if (exact) return exact
  if (utterance.includes('高架')) return scriptedAnswers['前面是不是要上高架了？']
  if (utterance.includes('加油') || utterance.includes('油')) return scriptedAnswers['还有多久要加油？']
  if (utterance.includes('雨')) return scriptedAnswers['前面会下雨吗？']
  if (utterance.includes('路线') || utterance.includes('简单')) return scriptedAnswers['帮我换一条简单一点的路线。']
  return '我听到了。为了安全，我会把它转成一条简短提醒，并在合适的时机告诉你。'
}
