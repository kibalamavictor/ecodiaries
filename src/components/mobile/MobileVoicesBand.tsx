import Image from 'next/image'
import Link from 'next/link'
import { ArrowRightIcon } from '@/components/icons'

const TAGS = ['Youth reporters', 'Field journalists', 'Climate advocates']

export function MobileVoicesBand() {
  return (
    <section className="mx-4 my-2 overflow-hidden rounded-2xl bg-brand-forest px-4 py-6 text-white">
      <span className="text-[10px] font-semibold uppercase tracking-[0.03em] text-brand-lime">
        Voices From The Ground
      </span>
      <h2 className="mt-2 font-heading text-lg font-bold leading-snug">
        Young storytellers, community reporters, and climate advocates across Africa.
      </h2>
      <div className="mobile-voices-scroll scrollbar-hide -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-0.5">
        {TAGS.map((tag) => (
          <span
            key={tag}
            className="shrink-0 rounded-full bg-brand-lime/15 px-2.5 py-1 text-[10px] font-semibold text-brand-lime"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-xl">
        <Image
          src="https://picsum.photos/seed/storyteller-mic/700/560"
          alt="A field journalist recording an interview"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
      <Link
        href="/contributors"
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-lime px-4 py-2 text-xs font-bold text-brand-forest"
      >
        Meet the contributors
        <ArrowRightIcon />
      </Link>
    </section>
  )
}
