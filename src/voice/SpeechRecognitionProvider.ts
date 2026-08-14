type RecognitionInstance = {
  lang: string
  interimResults: boolean
  onresult: (event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void
  onerror: () => void
  start: () => void
}

export type RecognitionResult = {
  supported: boolean
  listen: (onText: (text: string) => void, onError: () => void) => void
}

export function createRecognition(): RecognitionResult {
  const SpeechRecognition = (window as typeof window & { webkitSpeechRecognition?: new () => RecognitionInstance }).webkitSpeechRecognition
  if (!SpeechRecognition) return { supported: false, listen: (_onText, onError) => onError() }
  return {
    supported: true,
    listen(onText, onError) {
      const recognition = new SpeechRecognition()
      recognition.lang = 'zh-CN'
      recognition.interimResults = false
      recognition.onresult = event => onText(event.results[0][0].transcript)
      recognition.onerror = onError
      recognition.start()
    },
  }
}
