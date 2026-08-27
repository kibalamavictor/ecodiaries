'use client'

import { FormEvent, useState } from 'react'
import { toast } from 'sonner'
import { updateEditorDisplayName } from '@/app/(studio)/studio/auth-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ProfileNameForm({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      await updateEditorDisplayName(name)
      toast.success('Display name updated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not update display name')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex max-w-md flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1 space-y-2">
        <label htmlFor="displayName" className="text-sm font-medium">
          Display name
        </label>
        <Input
          id="displayName"
          name="displayName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={80}
          autoComplete="name"
        />
      </div>
      <Button type="submit" disabled={loading || !name.trim()}>
        {loading ? 'Saving…' : 'Save'}
      </Button>
    </form>
  )
}
