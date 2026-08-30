import { absoluteUrl } from '@/lib/seo'

type ArticleJsonLdProps = {
  title: string
  description?: string | null
  slug: string
  publishedAt?: string | null
  authorName?: string
  imageUrl?: string
}

export function ArticleJsonLd({ title, description, slug, publishedAt, authorName, imageUrl }: ArticleJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description || undefined,
    url: absoluteUrl(`/stories/${slug}`),
    datePublished: publishedAt || undefined,
    author: authorName ? { '@type': 'Person', name: authorName } : undefined,
    publisher: { '@type': 'Organization', name: 'EcoDiaries' },
    image: imageUrl || undefined,
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}
