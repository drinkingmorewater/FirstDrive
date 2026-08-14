export function speak(text: string, onEnd?: () => void) {
  if (!window.speechSynthesis) {
    globalThis.setTimeout(() => onEnd?.(), 1400)
    return
  }
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  utterance.rate = .95
  utterance.onend = () => onEnd?.()
  window.speechSynthesis.speak(utterance)
}
