import Link from 'next/link'
import { BrandMark } from '@/components/brand/BrandMark'
import { ContributorsApplyLink } from '@/components/contributors/ContributorsApplyLink'

export function SiteFooter() {
  return (
    <footer className="mag-footer">
      <div className="mag-wrap">
        <div className="mag-footer__top">
          <div className="mag-footer__brand">
            <Link href="/" prefetch={false} className="mag-brand">
              <BrandMark /> EcoDiaries
            </Link>
            <p>
              Unveiling climate solutions and community stories that intrigue and inspire —
              a curated record of how Africa is responding.
            </p>
          </div>
          <div>
            <h4>Main pages</h4>
            <ul>
              <li><Link href="/" prefetch={false}>Home</Link></li>
              <li><Link href="/solutions" prefetch={false}>Solutions</Link></li>
              <li><Link href="/stories" prefetch={false}>Stories</Link></li>
              <li><Link href="/community" prefetch={false}>Community</Link></li>
              <li><Link href="/about" prefetch={false}>About</Link></li>
            </ul>
          </div>
          <div>
            <h4>Topics</h4>
            <ul>
              <li><Link href="/stories?category=climate-change" prefetch={false}>Climate Change</Link></li>
              <li><Link href="/stories?category=water" prefetch={false}>Water</Link></li>
              <li><Link href="/stories?category=agriculture" prefetch={false}>Agriculture</Link></li>
              <li><Link href="/stories?category=biodiversity" prefetch={false}>Biodiversity</Link></li>
              <li><Link href="/solutions" prefetch={false}>Solutions atlas</Link></li>
            </ul>
          </div>
          <div>
            <h4>Social media</h4>
            <ul>
              <li><a href="https://www.instagram.com/ecodiaries__/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://x.com/ecodiaries__" target="_blank" rel="noopener noreferrer">Twitter</a></li>
              <li><a href="https://www.linkedin.com/company/ecodiaries" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><ContributorsApplyLink>Become a contributor</ContributorsApplyLink></li>
              <li><Link href="/contact" prefetch={false}>Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="mag-footer__bottom">
          <span>© 2026 EcoDiaries, a project by the Climate Cardinals Chapter of KIU. All rights reserved.</span>
          <span>
            <Link href="/privacy" prefetch={false}>Privacy Policy</Link>
            {' · '}
            <Link href="/terms" prefetch={false}>Terms</Link>
            {' · '}
            <Link href="/cookies" prefetch={false}>Cookies</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
