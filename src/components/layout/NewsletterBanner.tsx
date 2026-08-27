import { NewsletterForm } from '@/components/forms/NewsletterForm'

type NewsletterBannerProps = {
  className?: string
}

export function NewsletterBanner({ className }: NewsletterBannerProps = {}) {
  return (
    <section className={className ? `newsletter-band ${className}` : 'newsletter-band'}>
      <div className="wrap newsletter-band__inner">
        <div>
          <h2>Never miss a story</h2>
          <p>
            Join readers, storytellers, and climate enthusiasts receiving our latest features,
            solutions, and perspectives every week.
          </p>
        </div>
        <NewsletterForm />
      </div>
    </section>
  )
}
