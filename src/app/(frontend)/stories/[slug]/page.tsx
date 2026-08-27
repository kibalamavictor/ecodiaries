import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { NewsletterBanner } from '@/components/layout/NewsletterBanner'
import { StoryCard } from '@/components/cards/StoryCard'
import { StorySidebar } from '@/components/story/StorySidebar'
import { StoryShareBar } from '@/components/story/StoryShareBar'
import { StoryReadTracker } from '@/components/analytics/StoryReadTracker'
import { ArticleJsonLd } from '@/components/seo/ArticleJsonLd'
import { AnimatedArticle } from '@/components/motion/AnimatedArticle'
import { PageWrapper } from '@/components/motion/PageWrapper'
import { getPayloadClient } from '@/lib/payload'
import { mapStoryCard, resolveAuthor, resolveCategoryName, resolveMediaAlt, resolveMediaUrl } from '@/lib/cms/mappers'
import { getStoryBySlug } from '@/lib/cms/stories'
import { buildPageMetadata, resolveOgImage } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const story = await getStoryBySlug(slug)
  if (!story) return { title: 'Story' }

  const category = resolveCategoryName(story.category as never)
  const title = (story.seoTitle as string) || story.title
  const description = (story.seoDescription as string) || story.excerpt
  const imageUrl = resolveOgImage(story.ogImage, story.heroImage, story.title, category)

  return buildPageMetadata({
    title,
    description,
    path: `/stories/${slug}`,
    imageUrl,
    type: 'article',
    publishedTime: story.publishedAt as string | undefined,
    authors: resolveAuthor(story.author as never)?.name ? [resolveAuthor(story.author as never)!.name] : undefined,
  })
}

function extractSections(body: unknown): { id: string; label: string }[] {
  if (!body || typeof body !== 'object') return []
  const sections: { id: string; label: string }[] = []
  const root = body as { root?: { children?: { type?: string; tag?: string; children?: { text?: string }[] }[] } }
  root.root?.children?.forEach((node) => {
    if (node.type === 'heading' && node.tag?.startsWith('h')) {
      const text = node.children?.map((c) => c.text).join('') || ''
      if (text) sections.push({ id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-'), label: text })
    }
  })
  return sections.length ? sections : [
    { id: 'introduction', label: 'Introduction' },
    { id: 'communities-adapting', label: 'Communities Adapting' },
    { id: 'field-insights', label: 'Field Insights' },
    { id: 'conclusion', label: 'Conclusion' },
  ]
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params
  const raw = await getPayloadClient().then((p) =>
    p.find({
      collection: 'stories',
      where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
      limit: 1,
      depth: 2,
    }),
  )
  const doc = raw.docs[0]
  if (!doc) notFound()

  const story = mapStoryCard(doc)
  const author = resolveAuthor(doc.author as never)
  const category = resolveCategoryName(doc.category as never)
  const sections = extractSections(doc.body)

  const relatedResult = await getPayloadClient().then((p) =>
    p.find({
      collection: 'stories',
      where: {
        and: [{ status: { equals: 'published' } }, { id: { not_equals: doc.id } }],
      },
      sort: '-publishedAt',
      limit: 4,
      depth: 2,
    }),
  )
  const related = relatedResult.docs.map((d) => mapStoryCard(d))

  const heroUrl = resolveMediaUrl(doc.heroImage as never, story.image)
  const heroCaption = resolveMediaAlt(doc.heroImage as never)

  const publishedDate = doc.publishedAt
    ? new Date(doc.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <>
      <ArticleJsonLd
        title={doc.title}
        description={doc.excerpt}
        slug={slug}
        publishedAt={doc.publishedAt as string | undefined}
        authorName={author?.name}
        imageUrl={heroUrl}
      />
      <StoryReadTracker slug={slug} title={doc.title} />
      <PageWrapper>
      <div className="page-head" style={{ paddingBottom: 0 }}>
        <SiteNav variant="dark" activeLink="/stories" />
      </div>

      <section className="section" style={{ paddingTop: 42 }}>
        <div className="wrap">
          <header className="story-article-header">
            <h1 className="story-article-title">{doc.title}</h1>

            <div className="story-article-cover">
              <Image
                src={heroUrl}
                alt={heroCaption || doc.title}
                width={1100}
                height={619}
                priority
                sizes="100vw"
              />
            </div>

            {heroCaption && <p className="story-article-caption">{heroCaption}</p>}

            <div className="story-article-meta">
              <span className="story-article-meta__topic">{category}</span>
              {publishedDate && (
                <>
                  <span className="story-article-meta__sep" aria-hidden>
                    ·
                  </span>
                  <time dateTime={doc.publishedAt as string}>{publishedDate}</time>
                </>
              )}
              <StoryShareBar title={doc.title} text={doc.excerpt ?? undefined} />
            </div>
          </header>

          <div className="two-col story-detail-layout" style={{ gridTemplateColumns: '210px 1fr', alignItems: 'flex-start', gap: 48 }}>
            <StorySidebar sections={sections} />
            <AnimatedArticle className="story-body story-detail-body">
              {doc.body ? <RichText data={doc.body} /> : <p className="mt-16">{doc.excerpt}</p>}
            </AnimatedArticle>
          </div>
        </div>
      </section>

      <section className="section on-paper">
        <div className="wrap">
          <div className="section-head">
            <h2>Related Stories</h2>
          </div>
          <div className="card-grid post-grid story-related-grid scrollbar-hide">
            {related.map((s) => (
              <StoryCard key={s.slug} story={s} />
            ))}
          </div>
        </div>
      </section>

      <NewsletterBanner />
      <SiteFooter />
      </PageWrapper>
    </>
  )
}
