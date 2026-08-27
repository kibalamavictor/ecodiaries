import { StudioPage } from '@/components/studio/layout/studio-page'
import { SettingsForm } from '@/components/studio/settings-form'
import { getSiteSettings } from '@/app/(studio)/studio/actions'

export default async function SettingsStudioPage() {
  const settings = await getSiteSettings()

  return (
    <StudioPage
      title="Settings"
      subtitle="Manage site-wide mission, vision, impact stats, and social links."
    >
      <SettingsForm initial={settings} />
    </StudioPage>
  )
}
