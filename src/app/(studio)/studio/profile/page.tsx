import { getEditorProfile } from '@/app/(studio)/studio/auth-actions'
import { ProfilePasswordForm } from '@/components/studio/profile-password-form'
import { ProfileNameForm } from '@/components/studio/profile-name-form'
import { StudioPage } from '@/components/studio/layout/studio-page'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export const dynamic = 'force-dynamic'

export default async function StudioProfilePage() {
  const profile = await getEditorProfile()
  const initials = profile?.name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'ED'

  return (
    <StudioPage title="Profile" subtitle="Manage your studio account details and password.">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="studio-card flex flex-col items-center text-center lg:col-span-1">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="bg-green-100 text-2xl text-studio-primary">{initials}</AvatarFallback>
          </Avatar>
          <p className="mt-4 text-lg font-semibold capitalize text-gray-800">{profile?.name ?? 'Editor'}</p>
          <p className="text-sm text-gray-500">{profile?.role ?? 'Editor'}</p>
          <p className="mt-1 text-sm text-gray-500">{profile?.email ?? '—'}</p>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="studio-card space-y-4">
            <div>
              <h2 className="text-base font-semibold text-gray-700">Account details</h2>
              <p className="text-sm text-gray-500">Update how your name appears across the studio.</p>
            </div>
            <ProfileNameForm initialName={profile?.displayName || profile?.name || 'Editor'} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Email</p>
              <p className="mt-1 text-sm font-medium text-gray-800">{profile?.email ?? '—'}</p>
              <p className="mt-1 text-xs text-gray-500">Email is read-only and managed by your admin account.</p>
            </div>
          </div>

          <div className="studio-card space-y-4">
            <div>
              <h2 className="text-base font-semibold text-gray-700">Change password</h2>
              <p className="text-sm text-gray-500">Update your studio login password.</p>
            </div>
            <ProfilePasswordForm />
          </div>
        </div>
      </div>
    </StudioPage>
  )
}
