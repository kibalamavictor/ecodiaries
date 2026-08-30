'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { AdminStory, ContentStatus } from '@/lib/studio/types'
import { storyStatuses } from '@/lib/studio/status'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { StudioUploadField } from '@/components/studio/shared/studio-upload-field'
import { cn } from '@/lib/utils'

type StoryEditSheetProps = {
  story: AdminStory | null
  categories: string[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (story: AdminStory) => void
}

export function StoryEditSheet({ story, categories, open, onOpenChange, onSave }: StoryEditSheetProps) {
  const [draft, setDraft] = useState<AdminStory | null>(story)

  useEffect(() => {
    setDraft(story)
  }, [story])

  if (!draft) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={draft.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <SheetHeader>
              <SheetTitle>Edit story</SheetTitle>
              <SheetDescription>Quick edits without leaving the table.</SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="edit-title" className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Title
                </label>
                <Input
                  id="edit-title"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="edit-slug" className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Slug
                </label>
                <Input
                  id="edit-slug"
                  value={draft.slug}
                  onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>
              <div>
                <label htmlFor="edit-excerpt" className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Excerpt
                </label>
                <textarea
                  id="edit-excerpt"
                  rows={3}
                  value={draft.excerpt}
                  onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
                  className="flex w-full rounded-lg border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <StudioUploadField
                label="Hero image"
                accept="image/*"
                value={
                  draft.heroImageId
                    ? { id: draft.heroImageId, url: draft.imageUrl ?? null }
                    : null
                }
                onChange={(id, previewUrl) =>
                  setDraft({
                    ...draft,
                    heroImageId: id,
                    imageUrl: previewUrl ?? undefined,
                  })
                }
              />
              <div>
                <label htmlFor="edit-category" className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Category
                </label>
                <select
                  id="edit-category"
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="edit-status" className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {storyStatuses.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setDraft({ ...draft, status: st as ContentStatus })}
                      className={cn(
                        'rounded-pill border px-3 py-1 text-xs font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/50',
                        draft.status === st ? 'border-lime bg-lime/20 text-forest' : 'border-border bg-white text-muted-foreground',
                      )}
                    >
                      {st.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-2">
              <Button className="flex-1" onClick={() => onSave({ ...draft, updatedAt: new Date().toISOString() })}>
                Save changes
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  )
}
