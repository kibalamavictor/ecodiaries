import Link from 'next/link'
import { SocialIcons } from '@/components/icons'
import { BrandMark } from '@/components/brand/BrandMark'
import { ContributorsApplyLink } from '@/components/contributors/ContributorsApplyLink'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-blurb">
            <Link href="/" className="brand">
              <BrandMark /> EcoDiaries
            </Link>
            <p>
              Help document climate challenges, amplify local solutions, and share stories that inspire
              action across Africa.
            </p>
            <div className="social-row footer-blurb__social">
              <SocialIcons />
            </div>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h4>Explore</h4>
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/solutions">Solutions</Link></li>
                <li><Link href="/stories">Stories</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Topics</h4>
              <ul>
                <li><Link href="/stories?category=climate-change">Climate Change</Link></li>
                <li><Link href="/stories?category=water">Water</Link></li>
                <li><Link href="/stories?category=agriculture">Agriculture</Link></li>
                <li><Link href="/stories?category=biodiversity">Biodiversity</Link></li>
                <li><Link href="/stories?category=renewable-energy">Renewable Energy</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Community</h4>
              <ul>
                <li><Link href="/community">Community</Link></li>
                <li><Link href="/contributors">Contributors</Link></li>
                <li><Link href="/opportunities">Opportunities</Link></li>
                <li><ContributorsApplyLink>Become a Contributor</ContributorsApplyLink></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>About</h4>
              <ul>
                <li><Link href="/about">About EcoDiaries</Link></li>
                <li><Link href="/about#mission">Our Mission</Link></li>
                <li><Link href="/contact">Contact Us</Link></li>
              </ul>
            </div>
            <div className="footer-col join">
              <h4>Join the Movement</h4>
              <ul>
                <li>Stories inspire action. Ideas create change.</li>
                <li><ContributorsApplyLink>Become a Contributor →</ContributorsApplyLink></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 EcoDiaries, a project by the Climate Cardinals Chapter of KIU. All Rights Reserved.</span>
          <span>
            <Link href="/privacy">Privacy Policy</Link>
            &nbsp;•&nbsp;
            <Link href="/terms">Terms of Use</Link>
            &nbsp;•&nbsp;
            <Link href="/cookies">Cookie Policy</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
