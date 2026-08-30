/** First complete sentence only — for compact mobile cards (no mid-phrase CSS ellipsis). */
export function firstSentence(text: string): string {
  return condenseToSentences(text, 1)
}

/** First N complete sentences — for mobile cards when no short CMS field exists. */
export function condenseToSentences(text: string, maxSentences = 2): string {
  const trimmed = text.trim()
  if (!trimmed) return ''

  const sentences = trimmed.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g)
  if (!sentences?.length) return trimmed

  return sentences
    .slice(0, maxSentences)
    .map((sentence) => sentence.trim())
    .join(' ')
}
