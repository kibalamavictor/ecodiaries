'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { updateSiteSettings, purgePlaceholderContentAction } from '@/app/(studio)/studio/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type SettingsData = {
  missionCopy?: string | null
  visionCopy?: string | null
  impactStats?: { value?: string | null; label?: string | null; id?: string | null }[] | null
  socialLinks?: { platform?: string | null; url?: string | null; id?: string | null }[] | null
}

const tabs = [
  { id: 'general', label: 'General' },
  { id: 'social', label: 'Social Links' },
  { id: 'impact', label: 'Impact Stats' },
  { id: 'danger', label: 'Danger zone' },
] as const

export function SettingsForm({ initial }: { initial: SettingsData }) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('general')
  const [missionCopy, setMissionCopy] = useState(initial.missionCopy || '')
  const [visionCopy, setVisionCopy] = useState(initial.visionCopy || '')
  const [stats, setStats] = useState(
    initial.impactStats?.length
      ? initial.impactStats.map((s) => ({ value: s.value || '', label: s.label || '' }))
      : [{ value: '', label: '' }],
  )
  const [socialLinks, setSocialLinks] = useState(
    initial.socialLinks?.length
      ? initial.socialLinks.map((s) => ({ platform: s.platform || '', url: s.url || '' }))
      : [{ platform: '', url: '' }],
  )
  const [saving, setSaving] = useState(false)
  const [purging, setPurging] = useState(false)

  async function handlePurge() {
    const confirmed = window.confirm(
      'Delete ALL placeholder content (stories, solutions, contributors, media, etc.)? Admin logins are kept. This cannot be undone.',
    )
    if (!confirmed) return

    setPurging(true)
    try {
      const summary = await purgePlaceholderContentAction()
      const total = Object.values(summary).reduce((sum, count) => sum + count, 0)
      toast.success(`Removed ${total} placeholder records`)
      setStats([{ value: '', label: '' }])
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Purge failed')
    } finally {
      setPurging(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      await updateSiteSettings({
        missionCopy,
        visionCopy,
        impactStats: stats.filter((s) => s.value || s.label),
        socialLinks: socialLinks.filter((s) => s.platform || s.url),
      })
      toast.success('Settings saved')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              activeTab === tab.id ? 'bg-lime text-forest-dark' : 'text-gray-600 hover:bg-lime/10',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="studio-card space-y-4">
        {activeTab === 'general' ? (
          <>
            <div>
              <label htmlFor="mission" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                Mission copy
              </label>
              <textarea
                id="mission"
                rows={4}
                className="flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                value={missionCopy}
                onChange={(e) => setMissionCopy(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="vision" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
                Vision copy
              </label>
              <textarea
                id="vision"
                rows={4}
                className="flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                value={visionCopy}
                onChange={(e) => setVisionCopy(e.target.value)}
              />
            </div>
          </>
        ) : null}

        {activeTab === 'social' ? (
          <div className="space-y-3">
            {socialLinks.map((link, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-2">
                <Input
                  placeholder="Platform"
                  value={link.platform}
                  onChange={(e) =>
                    setSocialLinks(socialLinks.map((s, j) => (j === i ? { ...s, platform: e.target.value } : s)))
                  }
                />
                <Input
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => setSocialLinks(socialLinks.map((s, j) => (j === i ? { ...s, url: e.target.value } : s)))}
                />
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setSocialLinks([...socialLinks, { platform: '', url: '' }])}>
              Add social link
            </Button>
          </div>
        ) : null}

        {activeTab === 'impact' ? (
          <div className="space-y-3">
            {stats.map((stat, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-2">
                <Input
                  placeholder="Value"
                  value={stat.value}
                  onChange={(e) => setStats(stats.map((s, j) => (j === i ? { ...s, value: e.target.value } : s)))}
                />
                <Input
                  placeholder="Label"
                  value={stat.label}
                  onChange={(e) => setStats(stats.map((s, j) => (j === i ? { ...s, label: e.target.value } : s)))}
                />
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setStats([...stats, { value: '', label: '' }])}>
              Add stat
            </Button>
          </div>
        ) : activeTab === 'danger' ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Remove all seed and placeholder CMS records so you can publish authentic content. Admin
              accounts and mission/vision copy are kept.
            </p>
            <Button
              type="button"
              variant="destructive"
              disabled={purging}
              onClick={handlePurge}
            >
              {purging ? 'Removing placeholder content…' : 'Remove all placeholder content'}
            </Button>
          </div>
        ) : null}

        {activeTab !== 'danger' ? (
          <Button onClick={handleSave} disabled={saving} className="studio-btn">
            {saving ? 'Saving…' : 'Save settings'}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
