import Link from 'next/link'
import { BrandMark } from '@/components/brand/BrandMark'
import { loginContributor } from '@/app/(frontend)/dashboard/actions'

export default function DashboardLoginPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-soft)', padding: '48px 28px' }}>
      <div className="wrap" style={{ maxWidth: 420 }}>
        <Link href="/" className="brand" style={{ marginBottom: 32, display: 'inline-flex' }}>
          <BrandMark /> EcoDiaries
        </Link>
        <h1>Contributor login</h1>
        <p className="mt-8" style={{ color: 'var(--ink-soft)' }}>
          Approved contributors only. Apply via the contributors page if you do not have an account.
        </p>
        <form action={loginContributor} className="mt-32">
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Log in
          </button>
        </form>
      </div>
    </div>
  )
}
