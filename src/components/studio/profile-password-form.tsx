'use client'

import { FormEvent, useState } from 'react'
import { toast } from 'sonner'
import { updateEditorPassword } from '@/app/(studio)/studio/auth-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ProfilePasswordForm() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const current = (form.elements.namedItem('current') as HTMLInputElement).value
    const next = (form.elements.namedItem('next') as HTMLInputElement).value
    const confirm = (form.elements.namedItem('confirm') as HTMLInputElement).value

    if (next !== confirm) {
      toast.error('New passwords do not match')
      setLoading(false)
      return
    }
    if (next.length < 8) {
      toast.error('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    try {
      await updateEditorPassword(current, next)
      toast.success('Password updated')
      form.reset()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div className="space-y-2">
        <label htmlFor="current" className="text-sm font-medium">
          Current password
        </label>
        <Input id="current" name="current" type="password" required autoComplete="current-password" />
      </div>
      <div className="space-y-2">
        <label htmlFor="next" className="text-sm font-medium">
          New password
        </label>
        <Input id="next" name="next" type="password" required autoComplete="new-password" minLength={8} />
      </div>
      <div className="space-y-2">
        <label htmlFor="confirm" className="text-sm font-medium">
          Confirm new password
        </label>
        <Input id="confirm" name="confirm" type="password" required autoComplete="new-password" minLength={8} />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Saving…' : 'Change password'}
      </Button>
    </form>
  )
}
