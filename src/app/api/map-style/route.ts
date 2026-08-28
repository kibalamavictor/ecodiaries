import { NextResponse } from 'next/server'
import { ECO_MAP_STYLE_URL, rewriteOpenFreeMapUrls, tintEcoMapStyle } from '@/lib/solutions/eco-map-style'
import type { StyleSpecification, VectorSourceSpecification } from 'maplibre-gl'

export const revalidate = 86400

export async function GET() {
  try {
    const [styleRes, planetRes] = await Promise.all([
      fetch(ECO_MAP_STYLE_URL, { next: { revalidate: 86400 } }),
      fetch('https://tiles.openfreemap.org/planet', { next: { revalidate: 86400 } }),
    ])
    if (!styleRes.ok) {
      return NextResponse.json({ error: 'Failed to load map style' }, { status: 502 })
    }
    const style = rewriteOpenFreeMapUrls(tintEcoMapStyle((await styleRes.json()) as StyleSpecification))
    if (planetRes.ok) {
      const planet = (await planetRes.json()) as { tiles?: string[]; minzoom?: number; maxzoom?: number }
      const tiles = (planet.tiles || []).map((tile) => tile.replace('https://tiles.openfreemap.org', '/openfreemap'))
      if (tiles.length > 0) {
        style.sources = {
          ...style.sources,
          openmaptiles: {
            type: 'vector',
            tiles,
            ...(planet.minzoom != null ? { minzoom: planet.minzoom } : {}),
            ...(planet.maxzoom != null ? { maxzoom: planet.maxzoom } : {}),
          } satisfies VectorSourceSpecification,
        }
      }
    }
    return NextResponse.json(style)
  } catch {
    return NextResponse.json({ error: 'Failed to load map style' }, { status: 502 })
  }
}
