'use client'

import { useCallback, useState } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import { getCroppedImageDataUrl } from '@/lib/contributors/crop-image'
import type { ContributorApplicationPhoto } from '@/lib/contributors/types'

type PhotoSquareCropProps = {
  value: ContributorApplicationPhoto
  onChange: (photo: ContributorApplicationPhoto) => void
  error?: string
}

export function PhotoSquareCrop({ value, onChange, error }: PhotoSquareCropProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null)

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedArea(croppedPixels)
  }, [])

  async function applyCrop() {
    if (!imageSrc || !croppedArea || !sourceFile) return
    const dataUrl = await getCroppedImageDataUrl(imageSrc, croppedArea)
    const blob = await fetch(dataUrl).then((r) => r.blob())
    const file = new File([blob], sourceFile.name.replace(/\.\w+$/, '') + '-cropped.jpg', {
      type: 'image/jpeg',
    })
    onChange({ file, croppedPreviewUrl: dataUrl })
    setImageSrc(null)
    setSourceFile(null)
    setCroppedArea(null)
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setSourceFile(file)
    const reader = new FileReader()
    reader.onload = () => setImageSrc(String(reader.result))
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function clearPhoto() {
    onChange({ file: null, croppedPreviewUrl: null })
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-brand-green/5 p-4">
      <div>
        <label className="block text-sm font-medium text-brand-forest">Profile photo</label>
        <p className="mt-1 text-xs text-muted-foreground">
          Upload a photo and crop it to a square before submitting.
        </p>
      </div>

      {!imageSrc && !value.croppedPreviewUrl ? (
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="block w-full text-sm text-brand-forest file:mr-3 file:rounded-full file:border-0 file:bg-brand-lime file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-forest"
          data-testid="contributor-photo-input"
        />
      ) : null}

      {imageSrc ? (
        <div className="space-y-3">
          <div className="relative h-64 w-full overflow-hidden rounded-lg bg-muted">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-brand-lime"
            aria-label="Zoom"
          />
          <button
            type="button"
            onClick={applyCrop}
            disabled={!croppedArea}
            className="rounded-full bg-brand-lime px-4 py-2 text-sm font-semibold text-brand-forest disabled:opacity-50"
            data-testid="contributor-photo-apply-crop"
          >
            Apply square crop
          </button>
        </div>
      ) : null}

      {value.croppedPreviewUrl ? (
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-brand-lime ring-2 ring-brand-lime/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value.croppedPreviewUrl} alt="Cropped preview" className="h-full w-full object-cover" />
          </div>
          <div className="text-sm text-brand-forest">
            <p className="font-semibold">Square crop ready</p>
            {value.file ? <p className="text-xs text-muted-foreground">{value.file.name}</p> : null}
            <button type="button" onClick={clearPhoto} className="mt-2 text-xs font-semibold text-brand-green underline">
              Replace photo
            </button>
          </div>
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
