import Link from 'next/link'
import { CheckCircle2, Handshake, MapPin } from 'lucide-react'
import type { Solution } from '@/lib/solutions/types'

type CredibilityStripProps = {
  solutions: Solution[]
}

export function CredibilityStrip({ solutions }: CredibilityStripProps) {
  const partners = [...new Set(solutions.flatMap((s) => s.partnerOrgs || []))].slice(0, 3)
  const fieldReported = solutions.filter((s) => s.verifiedBy === 'field-reporter').length
  const communityValidated = solutions.filter((s) => s.verifiedBy === 'community-validated').length

  return (
    <section className="border-y border-[#E4E6DD] bg-[#F6F7F1]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00AB45] text-white">
                <CheckCircle2 className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="font-display text-2xl font-extrabold leading-none text-[#0B3E1F]">
                  {fieldReported || solutions.length}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#5C6457]">Field-reported projects</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00AB45] text-white">
                <MapPin className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="font-display text-2xl font-extrabold leading-none text-[#0B3E1F]">{communityValidated}</p>
                <p className="mt-1 text-sm font-semibold text-[#5C6457]">Community-validated</p>
              </div>
            </div>
            {partners.length ? (
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B3E1F] text-[#B6F101]">
                  <Handshake className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-bold text-[#0B3E1F]">Partners</p>
                  <p className="mt-0.5 text-sm font-medium text-[#5C6457]">{partners.join(' · ')}</p>
                </div>
              </div>
            ) : null}
          </div>
          <Link
            href="/contact"
            className="inline-flex w-fit items-center rounded-full border-2 border-[#0B3E1F] px-5 py-2.5 text-sm font-bold text-[#0B3E1F] transition hover:bg-[#0B3E1F] hover:text-white"
          >
            Verification methodology →
          </Link>
        </div>
      </div>
    </section>
  )
}
