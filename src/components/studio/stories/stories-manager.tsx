'use client'

import { useMemo, useState } from 'react'
import { Eye, MoreHorizontal, Pencil, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { AdminStory, ContentStatus } from '@/lib/studio/types'
import { formatRelativeTime } from '@/lib/studio/format'
import { statusConfig, storyStatuses } from '@/lib/studio/status'
import { updateStoryFromStudio, deleteStoryFromStudio } from '@/app/(studio)/studio/actions'
import { mapStoryToAdmin } from '@/lib/studio/story-mapper'
import { CategoryTag, StatusBadge, StatusDot } from '@/components/studio/shared/badges'
import { StoryEditSheet } from '@/components/studio/stories/story-edit-sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

export function StoriesManager({
  initialStories,
  categories,
  loading = false,
}: {
  initialStories: AdminStory[]
  categories: { id: number; name: string }[]
  loading?: boolean
}) {
  const storyCategories = ['All', ...categories.map((c) => c.name)]
  const [stories, setStories] = useState(initialStories)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<AdminStory | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const pageSize = 10

  const filtered = useMemo(() => {
    let list = [...stories]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.author.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q),
      )
    }
    if (categoryFilter !== 'All') list = list.filter((s) => s.category === categoryFilter)
    if (statusFilter !== 'all') list = list.filter((s) => s.status === statusFilter)

    list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    return list
  }, [stories, search, categoryFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)
  const allOnPageSelected = paginated.length > 0 && paginated.every((s) => selected.has(s.id))

  function toggleRow(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function toggleAllOnPage(checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev)
      for (const story of paginated) {
        if (checked) next.add(story.id)
        else next.delete(story.id)
      }
      return next
    })
  }

  async function handleSave(updated: AdminStory) {
    try {
      const categoryId = categories.find((c) => c.name === updated.category)?.id ?? null
      const payloadStatus = updated.status === 'archived' ? 'draft' : updated.status
      const doc = await updateStoryFromStudio(updated.id, {
        title: updated.title,
        slug: updated.slug,
        excerpt: updated.excerpt,
        status: payloadStatus,
        categoryId,
        heroImageId: updated.heroImageId ?? null,
      })
      setStories((prev) => prev.map((s) => (s.id === updated.id ? mapStoryToAdmin(doc as never) : s)))
      toast.success('Story saved')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    }
  }

  async function handleArchive(id: string) {
    try {
      await deleteStoryFromStudio(id)
      setStories((prev) => prev.filter((s) => s.id !== id))
      toast.success('Story deleted')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    )
  }

  if (!stories.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white py-16 text-center">
        <p className="font-heading text-lg font-semibold">No stories yet</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">Published and draft stories will appear here once contributors start submitting.</p>
        <Button className="mt-6 studio-btn">Create story</Button>
      </div>
    )
  }

  return (
    <>
      <div className="studio-card !p-4">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search stories…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-9"
            />
          </div>
          <div className="filters-row flex-1">
            <button
              type="button"
              onClick={() => {
                setStatusFilter('all')
                setPage(1)
              }}
              className={cn(
                'studio-filter-pill',
                statusFilter === 'all' ? 'studio-filter-pill-active' : 'studio-filter-pill-inactive',
              )}
            >
              All
            </button>
            {storyStatuses.filter((s) => s !== 'archived').map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setStatusFilter(st)
                  setPage(1)
                }}
                className={cn(
                  'studio-filter-pill',
                  statusFilter === st ? 'studio-filter-pill-active' : 'studio-filter-pill-inactive',
                )}
              >
                <StatusDot status={st} />
                {statusConfig[st].label}
              </button>
            ))}
          </div>
        </div>

        <div className="filters-row mb-4">
          {storyCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategoryFilter(cat)
                setPage(1)
              }}
              className={cn(
                'studio-filter-pill',
                categoryFilter === cat ? 'studio-filter-pill-active' : 'studio-filter-pill-inactive',
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {selected.size > 0 ? (
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-green-50 px-4 py-2 text-sm">
            <span className="font-medium text-studio-primary">{selected.size} selected</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStories((prev) => prev.filter((s) => !selected.has(s.id)))
                setSelected(new Set())
                toast.success('Selected stories removed from view')
              }}
            >
              Delete selected
            </Button>
          </div>
        ) : null}

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  aria-label="Select all on page"
                  checked={allOnPageSelected}
                  onChange={(e) => toggleAllOnPage(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-28" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                  No stories match your filters.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((story) => (
                <TableRow key={story.id} className="group">
                  <TableCell>
                    <input
                      type="checkbox"
                      aria-label={`Select ${story.title}`}
                      checked={selected.has(story.id)}
                      onChange={(e) => toggleRow(story.id, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <button
                      type="button"
                      onClick={() => setEditing(story)}
                      title={story.title}
                      className="line-clamp-1 text-left text-sm font-medium text-gray-800 hover:text-studio-accent"
                    >
                      {story.title}
                    </button>
                  </TableCell>
                  <TableCell>
                    <CategoryTag category={story.category} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-green-100 text-[10px] text-studio-primary">
                          {story.author
                            .split(' ')
                            .map((part) => part[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-700">{story.author}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={story.status} />
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{formatRelativeTime(story.updatedAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(story)} aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="More">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleArchive(story.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <p>
          Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </div>

      <StoryEditSheet story={editing} categories={categories.map((c) => c.name)} open={!!editing} onOpenChange={(o) => !o && setEditing(null)} onSave={handleSave} />
    </>
  )
}
