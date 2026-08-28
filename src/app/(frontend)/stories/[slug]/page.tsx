import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MagPageShell } from '@/components/magazine/MagPageShell'
import { MagSinglePost } from '@/components/magazine/MagSinglePost'
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
import { byline, formatMagDate, uniquifyMagCards } from '@/lib/magazine'

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

  const author = resolveAuthor(doc.author as never)
  const category = resolveCategoryName(doc.category as never)

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
  const related = uniquifyMagCards(
    uniquifyEditorialImages(
      relatedResult.docs.map((d) => mapStoryCard(d)),
      (item) => item.slug,
      (item) => item.image,
      (item, image) => ({ ...item, image }),
    ).map((s) => ({
      href: `/stories/${s.slug}`,
      image: s.image,
      category: s.category,
      title: s.title,
      excerpt: s.excerpt,
      byline: byline(s.author?.name, formatMagDate(s.publishedAt)),
    })),
  )

  const heroUrl = resolveEditorialUrl(doc.heroImage as never, `story:${slug}`)
  const heroCaption = resolveMediaAlt(doc.heroImage as never)
  const publishedDate = formatMagDate(doc.publishedAt as string | undefined)

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
          <MagSinglePost
            category={category}
            title={doc.title}
            image={heroUrl || related[0]?.image || environmentImageForKey(`story:${slug}`)}
            imageAlt={heroCaption || doc.title}
            byline={byline(author?.name, publishedDate)}
            avatar={author?.avatar}
            sidebarTitle="Latest Post"
            sidebarItems={related}
          >
            {heroCaption ? <p className="mag-meta" style={{ marginBottom: 24 }}>{heroCaption}</p> : null}
            <div className="story-article-meta" style={{ marginBottom: 28 }}>
              <span className="mag-chip">{category}</span>
              <StoryShareBar title={doc.title} text={doc.excerpt ?? undefined} />
            </div>
            <AnimatedArticle>
              {doc.body ? <RichText data={doc.body} /> : <p>{doc.excerpt}</p>}
            </AnimatedArticle>
          </MagSinglePost>
        </MagPageShell>
      </PageWrapper>
    </>
  )
}
