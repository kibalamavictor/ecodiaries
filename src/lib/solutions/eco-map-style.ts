import type { StyleSpecification } from 'maplibre-gl'

export const ECO_MAP_STYLE_URL =
  process.env.NEXT_PUBLIC_MAP_STYLE_URL || 'https://tiles.openfreemap.org/styles/liberty'

export const ECO_MAP = {
  forest: '#0B3E1F',
  water: '#1e4a3d',
  river: '#3f6f5a',
  land: '#e4ead8',
  wood: '#b7c9a4',
  grass: '#c5d4b4',
  park: '#c3d4b0',
  sand: '#e1d6b6',
  ice: '#e7eee8',
  wetland: '#c5d0c0',
  building: '#d6d1c4',
  road: '#d2cdc0',
  roadCasing: '#c3beb2',
  ink: '#1a1a1a',
  muted: '#4f4f4f',
  halo: '#f7f6f2',
} as const

let cached: StyleSpecification | null = null

type StyleLayer = StyleSpecification['layers'][number]

function layerId(layer: StyleLayer) {
  return layer.id.toLowerCase()
}

function setPaint(layer: StyleLayer, key: string, value: unknown) {
  const next = layer as StyleLayer & { paint?: Record<string, unknown> }
  next.paint = { ...(next.paint || {}), [key]: value }
}

export function tintEcoMapStyle(style: StyleSpecification): StyleSpecification {
  const layers = (style.layers || []).map((layer) => {
    const next = {
      ...layer,
      paint: 'paint' in layer && layer.paint ? { ...layer.paint } : {},
    } as StyleLayer
    const id = layerId(next)

    if (next.type === 'background') {
      setPaint(next, 'background-color', ECO_MAP.land)
    }

    if (next.type === 'raster' && (id.includes('natural') || id.includes('shaded') || id.includes('terrain'))) {
      setPaint(next, 'raster-saturation', -0.45)
      setPaint(next, 'raster-contrast', 0.08)
      setPaint(next, 'raster-opacity', ['interpolate', ['exponential', 1.5], ['zoom'], 0, 0.42, 6, 0.1])
    }

    if (next.type === 'fill') {
      if (id.includes('water') || id.includes('ocean') || id.includes('lake')) {
        setPaint(next, 'fill-color', ECO_MAP.water)
        setPaint(next, 'fill-opacity', 1)
      } else if (id.includes('park') || id.includes('wood') || id.includes('forest')) {
        setPaint(next, 'fill-color', id.includes('park') ? ECO_MAP.park : ECO_MAP.wood)
        if (id.includes('park')) setPaint(next, 'fill-outline-color', ECO_MAP.forest)
      } else if (id.includes('grass')) {
        setPaint(next, 'fill-color', ECO_MAP.grass)
      } else if (id.includes('sand')) {
        setPaint(next, 'fill-color', ECO_MAP.sand)
      } else if (id.includes('ice')) {
        setPaint(next, 'fill-color', ECO_MAP.ice)
      } else if (id.includes('wetland')) {
        setPaint(next, 'fill-color', ECO_MAP.wetland)
      } else if (id.includes('residential') || id.includes('landuse') || id.includes('landcover')) {
        setPaint(next, 'fill-color', ECO_MAP.land)
      } else if (id.includes('building')) {
        setPaint(next, 'fill-color', ECO_MAP.building)
      }
    }

    if (next.type === 'fill-extrusion' && id.includes('building')) {
      setPaint(next, 'fill-extrusion-color', ECO_MAP.building)
    }

    if (next.type === 'line') {
      if (id.includes('water')) {
        setPaint(next, 'line-color', ECO_MAP.river)
        if (id.includes('river') || id.includes('waterway')) {
          setPaint(next, 'line-width', ['interpolate', ['exponential', 1.2], ['zoom'], 4, 0.7, 8, 1.1, 14, 3, 20, 6])
        }
      } else if (id.includes('boundary') || id.includes('admin') || id.includes('border')) {
        setPaint(next, 'line-color', ECO_MAP.forest)
        setPaint(next, 'line-opacity', 0.35)
      } else if (id.includes('casing')) {
        setPaint(next, 'line-color', ECO_MAP.roadCasing)
      } else if (id.includes('road') || id.includes('highway') || id.includes('street') || id.includes('path') || id.includes('bridge') || id.includes('tunnel')) {
        setPaint(next, 'line-color', ECO_MAP.road)
      }
    }

    if (next.type === 'symbol') {
      if (id.includes('label_city') || id.includes('label_city_capital')) {
        next.minzoom = 2
      }
      if (id.includes('label_town')) {
        next.minzoom = 5
      }
      if (id.includes('water')) {
        setPaint(next, 'text-color', ECO_MAP.halo)
        setPaint(next, 'text-halo-color', ECO_MAP.water)
      } else {
        setPaint(next, 'text-color', id.includes('country') ? ECO_MAP.forest : ECO_MAP.ink)
        setPaint(next, 'text-halo-color', ECO_MAP.halo)
      }
    }

    return next
  })

  return { ...style, layers }
}

const OPENFREEMAP_ORIGIN = 'https://tiles.openfreemap.org'

export function rewriteOpenFreeMapUrls(style: StyleSpecification, origin = '/openfreemap'): StyleSpecification {
  const rewrite = (value: string) => value.split(OPENFREEMAP_ORIGIN).join(origin)
  const next = structuredClone(style) as StyleSpecification
  if (typeof next.glyphs === 'string') next.glyphs = rewrite(next.glyphs)
  if (typeof next.sprite === 'string') next.sprite = rewrite(next.sprite)
  const sources = next.sources || {}
  for (const source of Object.values(sources)) {
    if (!source || typeof source !== 'object') continue
    if ('url' in source && typeof source.url === 'string') source.url = rewrite(source.url)
    if ('tiles' in source && Array.isArray(source.tiles)) {
      source.tiles = source.tiles.map((tile) => (typeof tile === 'string' ? rewrite(tile) : tile))
    }
  }
  return next
}

export function rewriteOpenFreeMapRequest(url: string) {
  if (!url.startsWith(OPENFREEMAP_ORIGIN)) return url
  return `/openfreemap${url.slice(OPENFREEMAP_ORIGIN.length)}`
}

export async function loadEcoMapStyle(): Promise<StyleSpecification> {
  if (cached) return cached
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)
  try {
    const response = await fetch('/api/map-style', { signal: controller.signal, cache: 'no-store' })
    if (!response.ok) throw new Error(`Map style ${response.status}`)
    const style = (await response.json()) as StyleSpecification
    cached = style
    return cached
  } finally {
    clearTimeout(timer)
  }
}
