import { Suspense } from 'react'
import { StudioLoginForm } from '@/components/studio/login-form'

export default function StudioLoginPage() {
  return (
    <Suspense>
      <StudioLoginForm />
    </Suspense>
  )
}
