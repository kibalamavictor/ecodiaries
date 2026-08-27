import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ContactWizard } from '@/components/forms/ContactWizard'
import { ContactWizardFromSearchParams } from '@/components/forms/ContactWizardFromSearchParams'
import { MagNewsletter } from '@/components/magazine/MagNewsletter'
import { MagPageIntro } from '@/components/magazine/MagPageIntro'
import { MagPageShell } from '@/components/magazine/MagPageShell'

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
    <MagPageShell>
      <div className="mag-section" style={{ paddingTop: 12 }}>
        <MagPageIntro
          eyebrow="Contact"
          title="Let’s talk — story tips, partnerships, or programmes"
          lede="Whether you have a story to share, a solution to document, or a question about contributing — reach out."
        />
      </div>

      <section className="mag-section" style={{ paddingTop: 0 }}>
        <div className="mag-wrap mag-two">
          <div className="eco-forms-tailwind">
            <Suspense fallback={<ContactWizard />}>
              <ContactWizardFromSearchParams />
            </Suspense>
          </div>
          <aside className="mag-contact-card">
            <p className="mag-news__eyebrow">Reach us directly</p>
            <h2>Studio notes</h2>
            <dl>
              <dt>Email</dt>
              <dd>hello@ecodiaries.org</dd>
              <dt>Phone / WhatsApp</dt>
              <dd>+256 700 000 000</dd>
              <dt>Studio</dt>
              <dd>Kampala, Uganda</dd>
              <dt>Response time</dt>
              <dd>Within 2 business days</dd>
            </dl>
          </aside>
        </div>
      </section>

      <section className="mag-section">
        <div className="mag-wrap mag-two">
          <div>
            <p className="mag-news__eyebrow">FAQ</p>
            <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 40px)', maxWidth: '12ch' }}>
              Frequently asked questions
            </h2>
          </div>
          <div className="mag-faq">
            {faqs.map((faq) => (
              <div key={faq.q} className="mag-faq__item">
                <h3>{faq.q}</h3>
                <p className="mag-excerpt mag-excerpt--full">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MagNewsletter image="https://picsum.photos/seed/eco-contact/900/700" />
    </MagPageShell>
  )
}
