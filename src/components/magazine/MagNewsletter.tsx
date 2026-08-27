import Image from 'next/image'
import { NewsletterForm } from '@/components/forms/NewsletterForm'

type MagNewsletterProps = {
  image: string
}

export function MagNewsletter({ image }: MagNewsletterProps) {
  return (
    <section className="mag-section" id="subscribe">
      <div className="mag-wrap mag-news">
        <div>
          <p className="mag-news__eyebrow">Make your inbox happier</p>
          <h2>Get the latest climate solutions and stories</h2>
          <NewsletterForm variant="magazine" />
        </div>
        <div className="mag-news__media">
          <Image src={image} alt="" fill sizes="(max-width: 980px) 100vw, 50vw" />
        </div>
      </div>
    </section>
  )
}
