import Link from 'next/link'
import { BrandMark } from '@/components/brand/BrandMark'
import { ContributorsApplyLink } from '@/components/contributors/ContributorsApplyLink'

export function SiteFooter() {
  return (
    <footer className="mag-footer">
      <div className="mag-wrap">
        <div className="mag-footer__top">
          <div className="mag-footer__brand">
            <Link href="/" className="mag-brand">
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
              <li><Link href="/">Home</Link></li>
              <li><Link href="/solutions">Solutions</Link></li>
              <li><Link href="/stories">Stories</Link></li>
              <li><Link href="/community">Community</Link></li>
              <li><Link href="/about">About</Link></li>
            </ul>
          </div>
          <div>
            <h4>Topics</h4>
            <ul>
              <li><Link href="/stories?category=climate-change">Climate Change</Link></li>
              <li><Link href="/stories?category=water">Water</Link></li>
              <li><Link href="/stories?category=agriculture">Agriculture</Link></li>
              <li><Link href="/stories?category=biodiversity">Biodiversity</Link></li>
              <li><Link href="/solutions">Solutions atlas</Link></li>
            </ul>
          </div>
          <div>
            <h4>Social media</h4>
            <ul>
              <li><a href="https://www.instagram.com/ecodiaries__/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://x.com/ecodiaries__" target="_blank" rel="noopener noreferrer">Twitter</a></li>
              <li><a href="https://www.linkedin.com/company/ecodiaries" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><ContributorsApplyLink>Become a contributor</ContributorsApplyLink></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="mag-footer__bottom">
          <span>© 2026 EcoDiaries, a project by the Climate Cardinals Chapter of KIU. All rights reserved.</span>
          <span>
            <Link href="/privacy">Privacy Policy</Link>
            {' · '}
            <Link href="/terms">Terms</Link>
            {' · '}
            <Link href="/cookies">Cookies</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
