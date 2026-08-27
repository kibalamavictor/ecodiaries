'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { uploadStudioFile } from '@/lib/studio/upload-client'
import { Button } from '@/components/ui/button'

type MediaValue = number | { id?: number | string; url?: string | null; filename?: string | null } | null | undefined

function mediaId(value: MediaValue): number | null {
  if (value == null) return null
  if (typeof value === 'number') return value
  if (typeof value === 'object' && value.id != null) return Number(value.id)
  return null
}

function mediaPreviewUrl(value: MediaValue): string | null {
  if (!value || typeof value === 'number') return null
  if (typeof value === 'object' && value.url) return value.url
  return null
}

export function StudioUploadField({
  label,
  accept,
  value,
  onChange,
}: {
  label: string
  accept?: string
  value: MediaValue
  onChange: (next: number | null, previewUrl?: string | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const preview = localPreview || mediaPreviewUrl(value)
  const isImage = accept?.includes('image')

  async function handleFile(file: File) {
    setUploading(true)
    try {
      const result = await uploadStudioFile(file, file.name)
      setLocalPreview(result.url)
      onChange(result.id, result.url)
      toast.success(`${label} uploaded`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="flex flex-col gap-3 rounded-lg border border-dashed border-border p-4">
        {preview && isImage ? (
          <div className="relative h-32 w-full overflow-hidden rounded-md bg-muted">
            <Image src={preview} alt="" fill className="object-cover" unoptimized />
          </div>
        ) : null}
        {preview && !isImage ? (
          <p className="truncate text-sm text-muted-foreground">{preview}</p>
        ) : null}
        {mediaId(value) && !preview ? (
          <p className="text-sm text-muted-foreground">Media ID: {mediaId(value)}</p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void handleFile(file)
            }}
          />
          <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
            {uploading ? 'Uploading…' : preview || mediaId(value) ? 'Replace file' : 'Upload file'}
          </Button>
          {mediaId(value) ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setLocalPreview(null)
                onChange(null, null)
              }}
            >
              Remove
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
