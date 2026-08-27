import type { AtlasProject } from '@/lib/solutions/types'

/** Unique gallery assets; falls back to cover when gallery is empty. */
export function getGalleryAssets(project: Pick<AtlasProject, 'coverImageUrl' | 'gallery'>): { url: string }[] {
  const fromGallery = project.gallery.map((item) => item.url).filter(Boolean)
  const unique = [...new Set(fromGallery)]
  if (unique.length > 0) {
    return unique.map((url) => ({ url }))
  }
  if (project.coverImageUrl?.trim()) {
    return [{ url: project.coverImageUrl }]
  }
  return []
}

export function getMediaCount(project: Pick<AtlasProject, 'coverImageUrl' | 'gallery'>): number {
  return getGalleryAssets(project).length
}

export function hasStackedGallery(project: Pick<AtlasProject, 'coverImageUrl' | 'gallery'>): boolean {
  return getMediaCount(project) > 1
}
