import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { ArrowRightIcon } from '@/components/icons'
import { uniqueCountriesCount } from '@/lib/solutions/coordinates'

type MobileSolutionsAtlasSubmitCtaProps = {
  projectCount: number
  thumbnails: string[]
  regions: { region: string }[]
}

function proofLine(projectCount: number, regionCount: number): string {
  const regions = Math.max(regionCount, 6)
  return `${projectCount}+ projects already featured, reaching funders across ${regions} countries`
}

export function MobileSolutionsAtlasSubmitCta({
  projectCount,
  thumbnails,
  regions,
}: MobileSolutionsAtlasSubmitCtaProps) {
  const preview = thumbnails.filter(Boolean).slice(0, 4)
  const regionCount = uniqueCountriesCount(regions)

  return (
    <section className="mobile-atlas-cta" aria-labelledby="mobile-atlas-cta-title">
      <div className="mobile-atlas-cta__card">
        <div className="mobile-atlas-cta__globe-scene" aria-hidden>
          <div className="mobile-atlas-cta__globe-stage">
            <div className="mobile-atlas-cta__globe">
              <svg viewBox="0 0 80 80" className="mobile-atlas-cta__globe-svg" aria-hidden>
                <defs>
                  <radialGradient id="atlasGlobeOcean" cx="30%" cy="25%" r="70%">
                    <stop offset="0%" stopColor="#7fd3ff" />
                    <stop offset="45%" stopColor="#1d7bbf" />
                    <stop offset="100%" stopColor="#022335" />
                  </radialGradient>
                  <linearGradient id="atlasGlobeTerminator" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(0,0,0,0.65)" />
                    <stop offset="40%" stopColor="rgba(0,0,0,0.15)" />
                    <stop offset="65%" stopColor="rgba(0,0,0,0)" />
                  </linearGradient>
                  <linearGradient id="atlasGlobeLand" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d8f5b0" />
                    <stop offset="45%" stopColor="#88c86a" />
                    <stop offset="100%" stopColor="#2c7a3f" />
                  </linearGradient>
                  <clipPath id="atlasGlobeClip">
                    <circle cx="40" cy="40" r="34" />
                  </clipPath>
                  <filter id="atlasGlobeAtmosphere" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1.4" result="blur" />
                  </filter>
                </defs>

                {/* Ocean sphere */}
                <circle cx="40" cy="40" r="34" fill="url(#atlasGlobeOcean)" />

                {/* Continents simplified to read at 52px */}
                <g clipPath="url(#atlasGlobeClip)">
                  {/* Africa + Europe */}
                  <path
                    d="M44 17c-3 1-6 3-8 6-2 3-3 7-2 10 0 2 1 4 3 6-3 2-5 5-5 8 0 5 4 9 9 10 5 1 10-1 13-5 3-3 4-8 3-12 2-1 4-3 5-5 2-4 1-9-2-12-3-3-6-5-10-6-2 0-4-1-6 0z"
                    fill="url(#atlasGlobeLand)"
                  />
                  {/* West Africa / Brazil hint to feel global */}
                  <path
                    d="M34 32c-3 1-5 3-6 5-1 2-1 4 0 6 1 2 3 3 5 4 1-2 2-4 4-6 1-2 2-4 2-6-2-1-3-2-5-3z"
                    fill="url(#atlasGlobeLand)"
                    opacity="0.95"
                  />
                  {/* East Africa / Arabian peninsula hint */}
                  <path
                    d="M51 29c2 2 4 3 5 5 1 2 1 4 0 6-1 1-2 3-3 3-2-1-3-2-4-4-1-1-1-3-1-5 1-2 2-4 3-5z"
                    fill="url(#atlasGlobeLand)"
                    opacity="0.96"
                  />

                  {/* Cloud band */}
                  <path
                    d="M18 33c5-2 11-3 17-3 7 0 13 1 19 3 2 1 4 2 5 3-2 1-4 2-6 3-6 2-12 3-18 3-7 0-13-1-17-3-2-1-4-2-6-3 2-1 4-2 6-3z"
                    fill="rgba(255,255,255,0.18)"
                    filter="url(#atlasGlobeAtmosphere)"
                  />

                  {/* Subtle meridians/parallels */}
                  <g className="mobile-atlas-cta__globe-grid">
                    <ellipse
                      cx="40"
                      cy="40"
                      rx="34"
                      ry="10"
                      fill="none"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="0.8"
                    />
                    <ellipse
                      cx="40"
                      cy="40"
                      rx="34"
                      ry="20"
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="0.8"
                    />
                    <ellipse
                      cx="40"
                      cy="40"
                      rx="34"
                      ry="28"
                      fill="none"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="0.8"
                    />
                    <line x1="6" y1="40" x2="74" y2="40" stroke="rgba(255,255,255,0.1)" strokeWidth="0.7" />
                    <line x1="40" y1="6" x2="40" y2="74" stroke="rgba(255,255,255,0.1)" strokeWidth="0.7" />
                  </g>

                  {/* Night terminator for depth */}
                  <circle cx="40" cy="40" r="34" fill="url(#atlasGlobeTerminator)" />
                </g>

                {/* Atmosphere rim */}
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="rgba(160,210,255,0.85)"
                  strokeWidth="1.1"
                />
              </svg>
            </div>

            <div className="mobile-atlas-cta__zoom-ring" />

            {preview[0] ? (
              <div className="mobile-atlas-cta__found">
                <div className="mobile-atlas-cta__found-thumb">
                  <Image src={preview[0]} alt="" fill className="object-cover" sizes="72px" />
                </div>
                <span className="mobile-atlas-cta__found-pin">
                  <MapPin className="h-3 w-3" strokeWidth={2.5} />
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mobile-atlas-cta__body">
          <div className="mobile-atlas-cta__head">
            <div className="mobile-atlas-cta__icon" aria-hidden>
              <MapPin className="h-4 w-4" strokeWidth={2} />
            </div>
            <div className="mobile-atlas-cta__intro">
              <p className="mobile-atlas-cta__eyebrow">Solutions Atlas</p>
              <h2 id="mobile-atlas-cta-title" className="mobile-atlas-cta__title">
                Feature your climate project
              </h2>
            </div>
          </div>

          <p className="mobile-atlas-cta__lede">
            List your initiative where journalists, funders, and partners discover verified African
            climate solutions.
          </p>
          <p className="mobile-atlas-cta__proof">{proofLine(projectCount, regionCount)}</p>

          <div className="mobile-atlas-cta__actions">
            <Link href="/contact?reason=partnership&topic=atlas" className="mobile-atlas-cta__primary">
              Submit your project
              <ArrowRightIcon />
            </Link>
            <Link href="/solutions" className="mobile-atlas-cta__secondary">
              Browse the atlas
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
