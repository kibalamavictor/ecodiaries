import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MagCard } from '@/components/magazine/MagCard'
import { MagNewsletter } from '@/components/magazine/MagNewsletter'
import { MagPageShell } from '@/components/magazine/MagPageShell'
import { StorySidebar } from '@/components/story/StorySidebar'
import { StoryShareBar } from '@/components/story/StoryShareBar'
import { StoryReadTracker } from '@/components/analytics/StoryReadTracker'
import { ArticleJsonLd } from '@/components/seo/ArticleJsonLd'
import { AnimatedArticle } from '@/components/motion/AnimatedArticle'
import { PageWrapper } from '@/components/motion/PageWrapper'
import { getPayloadClient } from '@/lib/payload'
import { mapStoryCard, resolveAuthor, resolveCategoryName, resolveEditorialUrl, resolveMediaAlt } from '@/lib/cms/mappers'
import { uniquifyEditorialImages, environmentImageForKey } from '@/lib/unsplash-environment'
import { getStoryBySlug } from '@/lib/cms/stories'
import { buildPageMetadata, resolveOgImage } from '@/lib/seo'
import { byline, formatMagDate } from '@/lib/magazine'

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
  const related = uniquifyEditorialImages(
    relatedResult.docs.map((d) => mapStoryCard(d)),
    (item) => item.slug,
    (item) => item.image,
    (item, image) => ({ ...item, image }),
  )

  const heroUrl = resolveEditorialUrl(doc.heroImage as never, `story:${slug}`)
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
      <MagPageShell>
        <section className="mag-article-hero">
          <Image
            src={heroUrl}
            alt={heroCaption || doc.title}
            fill
            priority
            sizes="100vw"
          />
          <div className="mag-spread__shade" />
          <div className="mag-wrap mag-article-hero__copy">
            <p className="mag-breadcrumb">Home · Stories · {category}</p>
            <h1>{doc.title}</h1>
            <div className="mag-hero__by">
              {author?.avatar ? <Image src={author.avatar} alt="" width={32} height={32} /> : null}
              <span>{byline(author?.name, publishedDate || undefined)}</span>
            </div>
          </div>
        </section>

        <section className="mag-article-body">
          <div className="mag-wrap">
            {heroCaption ? <p className="mag-meta" style={{ marginBottom: 24 }}>{heroCaption}</p> : null}
            <div className="story-article-meta" style={{ marginBottom: 28 }}>
              <span className="mag-chip">{category}</span>
              <StoryShareBar title={doc.title} text={doc.excerpt ?? undefined} />
            </div>
            <div className="mag-article-layout">
              <StorySidebar sections={sections} />
              <AnimatedArticle className="story-body story-detail-body">
                {doc.body ? <RichText data={doc.body} /> : <p className="mt-16">{doc.excerpt}</p>}
              </AnimatedArticle>
            </div>
          </div>
        </section>

        <section className="mag-section">
          <div className="mag-wrap">
            <div className="mag-section-head">
              <h2>Related stories</h2>
            </div>
            <div className="mag-latest__grid">
              {related.map((s) => (
                <MagCard
                  key={s.slug}
                  item={{
                    href: `/stories/${s.slug}`,
                    image: s.image,
                    category: s.category,
                    title: s.title,
                    excerpt: s.excerpt,
                    byline: byline(s.author?.name, formatMagDate(s.publishedAt)),
                  }}
                />
              ))}
            </div>
          </div>
        </section>
        <MagNewsletter image={heroUrl || related[0]?.image || environmentImageForKey('story-newsletter')} />
      </MagPageShell>
      </PageWrapper>
    </>
  )
}
