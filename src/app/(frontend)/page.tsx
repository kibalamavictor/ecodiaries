import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { NewsletterBanner } from '@/components/layout/NewsletterBanner'
import { StoryCard } from '@/components/cards/StoryCard'
import { HeroSearch } from '@/components/forms/HeroSearch'
import { FilterPills } from '@/components/ui/FilterPills'
import { ArrowRightIcon, ClockIcon, PlayIcon } from '@/components/icons'
import { getHomepagePageData } from '@/lib/cms/homepage'
import { MobileHome } from '@/components/mobile/MobileHome'
import { SolutionsAtlasSubmitCta } from '@/components/solutions/SolutionsAtlasSubmitCta'
import { isMobileUserAgent } from '@/lib/device'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Climate stories, ideas, and solutions from across Africa and beyond — EcoDiaries documents what is changing and who is responding.',
}

export const revalidate = 300

const homeFilters = [
  { label: 'All', slug: 'all' },
  { label: 'Climate Change', slug: 'climate-change' },
  { label: 'Water', slug: 'water' },
  { label: 'Agriculture', slug: 'agriculture' },
  { label: 'Biodiversity', slug: 'biodiversity' },
  { label: 'Energy', slug: 'renewable-energy' },
  { label: 'Opinion', slug: 'opinion' },
]

export default async function HomePage() {
  const data = await getHomepagePageData()
  const mobileView = isMobileUserAgent((await headers()).get('user-agent'))

  if (mobileView) {
    return <MobileHome data={data} />
  }

  const { featured, latestDesktop: latest, episodesDesktop: episodes, moreNews } = data

  return (
    <>
      <div className="hero-horizon">
        <SiteNav variant="light" />
        <div className="wrap hero-inner">
          <h1>Climate Stories, Ideas, and Solutions from Across The World</h1>
          <Suspense fallback={null}>
            <HeroSearch />
          </Suspense>
        </div>
      </div>

      {featured && (
        <section className="section" style={{ paddingTop: 48 }}>
          <div className="wrap">
            <div className="two-col" style={{ gridTemplateColumns: '1.3fr 1fr', alignItems: 'stretch' }}>
              <div className="feature-media" style={{ aspectRatio: '16/11' }}>
                <Image
                  src={featured.image}
                  alt={featured.title}
                  width={900}
                  height={650}
                  priority
                  fetchPriority="high"
                  quality={72}
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
                <span className="tag" style={{ position: 'absolute', top: 16, left: 16 }}>
                  {featured.category}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
                <span className="meta-strip">
                  <ClockIcon /> {featured.readTime} · FEATURED
                </span>
                <h2 style={{ fontSize: 'clamp(22px,2.6vw,32px)' }}>{featured.title}</h2>
                {featured.author && (
                  <div className="byline">
                    <Image
                      src={featured.author.avatar}
                      alt=""
                      width={64}
                      height={64}
                      quality={70}
                      sizes="64px"
                      loading="lazy"
                      decoding="async"
                    />
                    <div>
                      <div className="name">{featured.author.name}</div>
                      <div className="role">{featured.author.role}</div>
                    </div>
                  </div>
                )}
                <Link href={`/stories/${featured.slug}`} className="btn btn-outline" style={{ width: 'fit-content' }}>
                  Read story <ArrowRightIcon />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section on-paper" style={{ paddingTop: 32, paddingBottom: 32 }}>
        <div className="wrap">
          <SolutionsAtlasSubmitCta />
        </div>
      </section>

      <section className="section on-paper">
        <div className="wrap">
          <div className="section-head">
            <h2>Latest Stories &amp; Insights</h2>
            <Link href="/stories" className="btn btn-outline btn-sm">
              See all stories
            </Link>
          </div>
          <Suspense fallback={null}>
            <FilterPills filters={homeFilters} basePath="/stories" />
          </Suspense>
          <div className="card-grid post-grid">
            {latest.map((story) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>
        </div>
      </section>

      <section className="section on-dark">
        <div className="wrap">
          <div className="two-col">
            <div>
              <span className="eyebrow">Voices From The Ground</span>
              <h2 className="mt-16" style={{ fontSize: 'clamp(24px,3vw,36px)', maxWidth: 440 }}>
                EcoDiaries amplifies young storytellers, community reporters, and environmental advocates.
              </h2>
              <div className="tag-row mt-24">
                <span className="tag-ghost tag">Youth reporters</span>
                <span className="tag-ghost tag">Field journalists</span>
                <span className="tag-ghost tag">Climate advocates</span>
              </div>
              <Link href="/contributors" className="btn btn-lime mt-32" style={{ width: 'fit-content' }}>
                Meet the contributors <ArrowRightIcon />
              </Link>
            </div>
            <div className="feature-media" style={{ aspectRatio: '4/3' }}>
              <Image
                src="https://picsum.photos/seed/storyteller-mic/700/560"
                alt="A field journalist recording an interview"
                width={700}
                height={560}
                quality={70}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <button className="play-btn" aria-label="Play" type="button">
                <PlayIcon />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Field Notes from the Climate Frontline</span>
              <h2 className="mt-16">Youth Climate Dispatch</h2>
            </div>
            <Link href="/listen" className="btn btn-outline btn-sm">
              Listen to more
            </Link>
          </div>
          <div className="card-grid post-grid">
            {episodes.map((tile) => (
              <Link key={tile.slug} href={`/listen#${tile.slug}`} className={`audio-tile ${tile.bgClass}`}>
                <div>
                  <span className="audio-meta">{tile.meta}</span>
                  <h4 className="mt-8">{tile.title}</h4>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="waveform" />
                  <span className="play-btn" style={{ position: 'static', width: 42, height: 42, display: 'grid', placeItems: 'center' }}>
                    <PlayIcon />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section on-paper">
        <div className="wrap">
          <div className="section-head">
            <h2>More News</h2>
            <Link href="/stories" className="btn btn-outline btn-sm">
              Read more
            </Link>
          </div>
          <div className="card-grid post-grid">
            {moreNews.map((story) => (
              <StoryCard key={story.slug} story={story} compact />
            ))}
          </div>
        </div>
      </section>

      <NewsletterBanner />
      <SiteFooter />
    </>
  )
}
