/**
 * Lexical JSON → plain text. Walks content nodes instead of stringifying raw JSON.
 */
export function lexicalToPlainText(body: unknown): string {
  if (!body || typeof body !== 'object') return ''
  const root = (body as { root?: { children?: unknown[] } }).root
  if (!root?.children?.length) return ''

  function walk(nodes: unknown[]): string {
    return nodes
      .map((node) => {
        if (!node || typeof node !== 'object') return ''
        const n = node as Record<string, unknown>
        if (n.type === 'text') return String(n.text ?? '')
        if (n.type === 'linebreak') return '\n'
        if (Array.isArray(n.children)) {
          const inner = walk(n.children)
          if (n.type === 'paragraph' || n.type === 'heading') return `${inner}\n`
          return inner
        }
        return ''
      })
      .join('')
  }

  return walk(root.children)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** Inline markdown fragments and newlines inside plain strings. */
export function renderInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\\n/g, '\n')
}

export function isLexicalDocument(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && 'root' in (value as object))
}
