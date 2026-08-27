import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'
import { isLexicalDocument, lexicalToPlainText, renderInlineMarkdown } from '@/lib/cms/richtext'
import { cn } from '@/lib/utils'

type RichTextContentProps = {
  data: unknown
  className?: string
  fallback?: string
}

/**
 * Shared renderer for every Lexical rich field on the public site.
 * Plain strings with markdown fragments are normalized; never dumps raw JSON.
 */
export function RichTextContent({ data, className, fallback }: RichTextContentProps) {
  if (!data) {
    return fallback ? <p className={cn('text-neutral-700', className)}>{renderInlineMarkdown(fallback)}</p> : null
  }

  if (isLexicalDocument(data)) {
    const plain = lexicalToPlainText(data)
    if (plain.includes('root type root') || plain.includes('format indent')) {
      return fallback ? <p className={cn('text-neutral-700', className)}>{fallback}</p> : null
    }
    return (
      <div className={cn('prose prose-neutral max-w-none prose-headings:text-brand-forest', className)}>
        <PayloadRichText data={data as never} />
      </div>
    )
  }

  if (typeof data === 'string') {
    return <p className={cn('text-neutral-700 whitespace-pre-line', className)}>{renderInlineMarkdown(data)}</p>
  }

  return fallback ? <p className={cn('text-neutral-700', className)}>{fallback}</p> : null
}
