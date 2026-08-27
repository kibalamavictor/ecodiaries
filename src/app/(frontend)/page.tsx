import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { MagCard, type MagCardItem } from '@/components/magazine/MagCard'
import { MagHero } from '@/components/magazine/MagHero'
import { MagNewsletter } from '@/components/magazine/MagNewsletter'
import { MagSpread, MagTrending } from '@/components/magazine/MagTrending'
import { getHomepagePageData } from '@/lib/cms/homepage'
import { byline, formatMagDate, sectorLabel } from '@/lib/magazine'
import type { AtlasProject } from '@/lib/solutions/types'
import type { StoryPreview } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Climate stories, ideas, and solutions from across Africa and beyond — EcoDiaries documents what is changing and who is responding.',
}

export const revalidate = 300

function fromSolution(project: AtlasProject): MagCardItem {
  return {
    href: `/solutions/${project.slug}`,
    image: project.coverImageUrl,
    category: sectorLabel(project.sectors[0]),
    title: project.title,
    excerpt: project.summary,
    byline: [project.region, formatMagDate(project.publishedAt)].filter(Boolean).join(' · '),
  }
}

function fromStory(story: StoryPreview): MagCardItem {
  return {
    href: `/stories/${story.slug}`,
    image: story.image,
    category: story.category,
    title: story.title,
    excerpt: story.excerpt,
    byline: byline(story.author?.name, formatMagDate(story.publishedAt)),
  }
}

export default async function HomePage() {
  const data = await getHomepagePageData()
  const solutions = data.solutions
  const stories = data.latestStories.length ? data.latestStories : data.featuredStories

  const solutionCards = solutions.map(fromSolution)
  const storyCards = stories.map(fromStory)

  const heroSlides = (solutionCards.length ? solutionCards : storyCards).slice(0, 4)

  const strip = (solutionCards.length ? solutionCards : storyCards).slice(0, 6)
  const featuredStory = storyCards[0]
  const storyGrid = storyCards.slice(1, 4)
  const trending = (storyCards.length ? storyCards : solutionCards).slice(0, 4)
  const spread = storyCards[1] || storyCards[0] || solutionCards[0]
  const inspiration = solutionCards.slice(0, 5)
  const latest = storyCards.slice(0, 9)
  const newsletterImage = solutionCards[0]?.image || storyCards[0]?.image || 'https://picsum.photos/seed/eco-field/900/700'

  return (
    <>
      <SiteNav />
      <main className="magazine">
        <MagHero slides={heroSlides} />

        {strip.length > 0 ? (
          <section className="mag-strip" aria-label="Solutions">
            <div className="mag-wrap mag-strip__row">
              {strip.map((item) => (
                <MagCard key={item.href} item={item} size="sm" heading="h3" />
              ))}
            </div>
          </section>
        ) : null}

        <section className="mag-section">
          <div className="mag-wrap mag-split">
            <div>
              {featuredStory ? (
                <article className="mag-feature">
                  <div>
                    <span className="mag-chip">{featuredStory.category}</span>
                    <h2 className="mag-title">
                      <Link href={featuredStory.href}>{featuredStory.title}</Link>
                    </h2>
                    {featuredStory.excerpt ? <p className="mag-excerpt">{featuredStory.excerpt}</p> : null}
                    {featuredStory.byline ? <p className="mag-meta" style={{ marginTop: 16 }}>{featuredStory.byline}</p> : null}
                  </div>
                  <Link href={featuredStory.href} className="mag-card__media mag-card--feature">
                    <Image src={featuredStory.image} alt="" fill sizes="(max-width: 980px) 100vw, 40vw" />
                  </Link>
                </article>
              ) : null}
              {storyGrid.length > 0 ? (
                <div className="mag-grid-3">
                  {storyGrid.map((item) => (
                    <MagCard key={item.href} item={item} heading="h3" />
                  ))}
                </div>
              ) : null}
            </div>
            <MagTrending items={trending} />
          </div>
        </section>

        {spread ? <MagSpread item={spread} /> : null}

        <MagNewsletter image={newsletterImage} />

        {inspiration.length > 0 ? (
          <section className="mag-section">
            <div className="mag-wrap">
              <div className="mag-section-head">
                <h2>On the ground</h2>
                <Link href="/solutions" className="mag-link">View more →</Link>
              </div>
              <div className="mag-inspire__grid">
                {inspiration.map((item, index) => (
                  <MagCard key={item.href} item={item} size={index === 0 ? 'lg' : 'sm'} heading="h3" />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {latest.length > 0 ? (
          <section className="mag-section">
            <div className="mag-wrap">
              <div className="mag-section-head">
                <h2>Latest stories</h2>
              </div>
              <div className="mag-latest__grid">
                {latest.map((item) => (
                  <MagCard key={item.href} item={item} heading="h3" />
                ))}
              </div>
              <div className="mag-center">
                <Link href="/stories" className="mag-btn">View all</Link>
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  )
}
