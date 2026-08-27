import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { NewsletterBanner } from '@/components/layout/NewsletterBanner'
import { ContactWizard } from '@/components/forms/ContactWizard'
import { ContactWizardFromSearchParams } from '@/components/forms/ContactWizardFromSearchParams'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with EcoDiaries — share a story tip, apply as a contributor, or explore a partnership.',
}

const faqs = [
  {
    q: 'How do I pitch a story?',
    a: 'Use the contact form and select "A story tip". Include a brief summary, location, and any links to supporting material.',
  },
  {
    q: 'Can I submit a solution to the Solutions Hub?',
    a: 'Solutions are field-verified by our reporters. Share a tip and our editorial team will investigate.',
  },
  {
    q: "I'm a student — can I still apply?",
    a: 'Yes. Programmes like Youth Reporters and Young Guardians are designed for students and early-career storytellers.',
  },
  {
    q: 'Do you accept partnerships with organisations?',
    a: 'We partner with NGOs, universities, and media organisations. Select "A partnership" in the form.',
  },
]

export default function ContactPage() {
  return (
    <>
      <header className="eco-forms-tailwind bg-brand-forest text-white">
        <SiteNav variant="light" activeLink="/contact" />
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 sm:pb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-lime">Contact</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            Let&apos;s talk — story tips, partnerships, or programmes
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Whether you have a story to share, a solution to document, or a question about contributing — reach out.
          </p>
        </div>
      </header>

      <section className="eco-forms-tailwind bg-neutral-50 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-start">
          <Suspense fallback={<ContactWizard />}>
            <ContactWizardFromSearchParams />
          </Suspense>
          <div className="rounded-2xl bg-brand-forest p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-lime">Reach us directly</p>
            <ul className="mt-6 space-y-5 text-sm">
              <li>
                <p className="text-white/60">Email</p>
                <p className="font-medium">hello@ecodiaries.org</p>
              </li>
              <li>
                <p className="text-white/60">Phone / WhatsApp</p>
                <p className="font-medium">+256 700 000 000</p>
              </li>
              <li>
                <p className="text-white/60">Studio</p>
                <p className="font-medium">Kampala, Uganda</p>
              </li>
              <li>
                <p className="text-white/60">Response time</p>
                <p className="font-medium">Within 2 business days</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="eco-forms-tailwind py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-brand-forest">Frequently asked questions</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-border bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-brand-forest">{faq.q}</h3>
                <p className="mt-2 text-sm text-neutral-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterBanner />
      <SiteFooter />
    </>
  )
}
