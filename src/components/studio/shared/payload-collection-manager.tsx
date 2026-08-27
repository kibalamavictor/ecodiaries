'use client'

import { useMemo, useState } from 'react'
import { MoreHorizontal, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  createDocument,
  deleteDocument,
  updateDocument,
} from '@/app/(studio)/studio/actions'
import type { FieldDef, StudioCollectionConfig } from '@/lib/studio/collection-configs'
import { cellValue } from '@/lib/studio/collection-configs'
import { StudioUploadField } from '@/components/studio/shared/studio-upload-field'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { CollectionSlug } from 'payload'

type RelOption = { id: string | number; label: string }

type Props = {
  config: StudioCollectionConfig
  initialDocs: Record<string, unknown>[]
  relationshipOptions?: Record<string, RelOption[]>
}

function emptyDoc(config: StudioCollectionConfig): Record<string, unknown> {
  const doc: Record<string, unknown> = {}
  for (const f of config.fields) {
    if (f.type === 'checkbox') doc[f.name] = false
    else if (f.type === 'number') doc[f.name] = undefined
    else if (f.type === 'upload') doc[f.name] = null
    else doc[f.name] = ''
  }
  return doc
}

function normalizeDocForSave(doc: Record<string, unknown>, fields: FieldDef[]) {
  const payload = { ...doc }
  for (const field of fields) {
    if (field.type === 'upload') {
      const value = payload[field.name]
      if (value && typeof value === 'object' && value !== null && 'id' in value) {
        payload[field.name] = (value as { id: number }).id
      }
      if (value === '' || value === undefined) {
        payload[field.name] = null
      }
    }
    if (field.type === 'relationship') {
      const value = payload[field.name]
      if (value && typeof value === 'object' && value !== null && 'id' in value) {
        payload[field.name] = (value as { id: number }).id
      }
    }
  }
  return payload
}

function EntityForm({
  fields,
  doc,
  onChange,
  relationshipOptions,
  readOnlyFields = [],
  createOnlyFields = [],
  creating = false,
}: {
  fields: FieldDef[]
  doc: Record<string, unknown>
  onChange: (doc: Record<string, unknown>) => void
  relationshipOptions?: Record<string, RelOption[]>
  readOnlyFields?: string[]
  createOnlyFields?: string[]
  creating?: boolean
}) {
  const visibleFields = fields.filter((f) => creating || !createOnlyFields.includes(f.name))
  return (
    <div className="mt-6 space-y-4">
      {visibleFields.map((field) => {
        const readOnly = readOnlyFields.includes(field.name)
        const id = `field-${field.name}`
        const value = doc[field.name]

        if (field.type === 'textarea') {
          return (
            <div key={field.name}>
              <label htmlFor={id} className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {field.label}
              </label>
              <textarea
                id={id}
                rows={4}
                readOnly={readOnly}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={String(value ?? '')}
                onChange={(e) => onChange({ ...doc, [field.name]: e.target.value })}
              />
            </div>
          )
        }

        if (field.type === 'select') {
          return (
            <div key={field.name}>
              <label htmlFor={id} className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {field.label}
              </label>
              <select
                id={id}
                disabled={readOnly}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={String(value ?? '')}
                onChange={(e) => onChange({ ...doc, [field.name]: e.target.value })}
              >
                <option value="">—</option>
                {field.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          )
        }

        if (field.type === 'relationship') {
          const opts = relationshipOptions?.[field.name] || []
          const relId =
            typeof value === 'object' && value !== null && 'id' in value
              ? String((value as { id: string | number }).id)
              : value != null
                ? String(value)
                : ''
          return (
            <div key={field.name}>
              <label htmlFor={id} className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {field.label}
              </label>
              <select
                id={id}
                disabled={readOnly}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={relId}
                onChange={(e) =>
                  onChange({
                    ...doc,
                    [field.name]: e.target.value ? Number(e.target.value) || e.target.value : null,
                  })
                }
              >
                <option value="">—</option>
                {opts.map((o) => (
                  <option key={o.id} value={String(o.id)}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          )
        }

        if (field.type === 'upload') {
          return (
            <StudioUploadField
              key={field.name}
              label={field.label}
              accept={field.accept}
              value={value as never}
              onChange={(id, previewUrl) =>
                onChange({
                  ...doc,
                  [field.name]: id == null ? null : previewUrl ? { id, url: previewUrl } : id,
                })
              }
            />
          )
        }

        if (field.type === 'checkbox') {
          return (
            <label key={field.name} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                disabled={readOnly}
                checked={Boolean(value)}
                onChange={(e) => onChange({ ...doc, [field.name]: e.target.checked })}
              />
              {field.label}
            </label>
          )
        }

        return (
          <div key={field.name}>
            <label htmlFor={id} className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {field.label}
            </label>
            <Input
              id={id}
              type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'email' ? 'email' : 'text'}
              readOnly={readOnly}
              value={value == null ? '' : String(value)}
              onChange={(e) =>
                onChange({
                  ...doc,
                  [field.name]:
                    field.type === 'number' ? (e.target.value ? Number(e.target.value) : undefined) : e.target.value,
                })
              }
            />
          </div>
        )
      })}
    </div>
  )
}

export function PayloadCollectionManager({ config, initialDocs, relationshipOptions }: Props) {
  const [docs, setDocs] = useState(initialDocs)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() => {
    if (!search.trim()) return docs
    const q = search.toLowerCase()
    return docs.filter((d) =>
      config.columns.some((c) => cellValue(d, c).toLowerCase().includes(q)),
    )
  }, [docs, search, config.columns])

  const sheetOpen = creating || !!editing
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null)

  function openCreate() {
    setDraft(emptyDoc(config))
    setCreating(true)
    setEditing(null)
  }

  function openEdit(doc: Record<string, unknown>) {
    setDraft({ ...doc })
    setEditing(doc)
    setCreating(false)
  }

  function closeSheet() {
    setEditing(null)
    setCreating(false)
    setDraft(null)
  }

  async function handleSave() {
    if (!draft) return
    setSaving(true)
    try {
      const payload = normalizeDocForSave(draft, config.fields)
      delete payload.id
      delete payload.createdAt
      delete payload.updatedAt

      if (creating) {
        const created = await createDocument(config.slug as CollectionSlug, payload)
        setDocs((prev) => [created as unknown as Record<string, unknown>, ...prev])
        toast.success('Created')
      } else if (editing?.id != null) {
        const updated = await updateDocument(config.slug as CollectionSlug, editing.id as string | number, payload)
        setDocs((prev) => prev.map((d) => (d.id === editing.id ? (updated as unknown as Record<string, unknown>) : d)))
        toast.success('Saved')
      }
      closeSheet()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string | number) {
    if (!confirm('Delete this item? This cannot be undone.')) return
    try {
      await deleteDocument(config.slug as CollectionSlug, id)
      setDocs((prev) => prev.filter((d) => d.id !== id))
      toast.success('Deleted')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <div className="studio-card !p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder={`Search ${config.title.toLowerCase()}…`} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        {!config.disableCreate && (
          <Button onClick={openCreate} className="studio-btn">
            <Plus className="mr-2 h-4 w-4" /> New
          </Button>
        )}
      </div>

      <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {config.columns.map((col) => (
                <TableHead key={col.key} className={col.key === config.titleField ? 'w-[32%]' : undefined}>
                  {col.label}
                </TableHead>
              ))}
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={config.columns.length + 1} className="h-32 text-center text-muted-foreground">
                  No items yet.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((doc) => (
                <TableRow
                  key={String(doc.id)}
                  className={cn(
                    'group',
                    config.slug === 'contact-submissions' && doc.status === 'new' && 'border-l-4 border-l-studio-accent font-medium',
                  )}
                >
                  {config.columns.map((col, i) => (
                    <TableCell
                      key={col.key}
                      className={cn(i === 0 && 'title-cell max-w-0')}
                      title={i === 0 ? cellValue(doc, col) : undefined}
                    >
                      {i === 0 ? (
                        <button
                          type="button"
                          onClick={() => openEdit(doc)}
                          className="block w-full truncate text-left font-medium hover:text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/50 rounded-sm"
                        >
                          {cellValue(doc, col)}
                        </button>
                      ) : (
                        <span className="block truncate">{cellValue(doc, col)}</span>
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 focus-visible:opacity-100" aria-label="Row actions">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(doc)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        {!config.disableDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-maroon focus:text-maroon" onClick={() => handleDelete(doc.id as string | number)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

      {sheetOpen && draft && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={closeSheet} role="presentation">
          <div
            className="h-full w-full max-w-xl overflow-y-auto bg-background p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h2 className="font-heading text-xl font-semibold">{creating ? `New ${config.title.slice(0, -1)}` : `Edit ${String(draft[config.titleField] ?? '')}`}</h2>
            <EntityForm
              fields={config.fields}
              doc={draft}
              onChange={setDraft}
              relationshipOptions={relationshipOptions}
              readOnlyFields={config.readOnlyFields}
              createOnlyFields={config.createOnlyFields}
              creating={creating}
            />
            <div className="mt-6 flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </Button>
              <Button variant="outline" onClick={closeSheet}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
