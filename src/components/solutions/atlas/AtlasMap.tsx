'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import Map, { Layer, NavigationControl, Source, type MapLayerMouseEvent, type MapRef } from 'react-map-gl/maplibre'
import type { GeoJSONSource, Map as MapLibreMap } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { AtlasProject } from '@/lib/solutions/types'
import { SECTOR_COLORS, SECTOR_LABELS, projectsToGeoJSON } from '@/lib/solutions/types'

const MAP_STYLE = process.env.NEXT_PUBLIC_MAP_STYLE_URL || 'https://tiles.openfreemap.org/styles/liberty'

const BRAND_FOREST = '#0B3E1F'
const PAPER = '#f3f1ea'
const LAND = '#efece3'
const WATER = '#1e4a3d'
const PARK = '#d8e3cf'
const ROAD = '#d9d4c8'
const INK = '#3f3f3f'

function applyEcoMapTint(map: MapLibreMap) {
  const style = map.getStyle()
  if (!style?.layers) return

  for (const layer of style.layers) {
    const id = layer.id.toLowerCase()
    try {
      if (layer.type === 'background') {
        map.setPaintProperty(layer.id, 'background-color', PAPER)
      }
      if (layer.type === 'fill') {
        if (id.includes('water') || id.includes('ocean') || id.includes('river') || id.includes('lake')) {
          map.setPaintProperty(layer.id, 'fill-color', WATER)
          map.setPaintProperty(layer.id, 'fill-opacity', 0.92)
        } else if (id.includes('park') || id.includes('wood') || id.includes('forest') || id.includes('grass')) {
          map.setPaintProperty(layer.id, 'fill-color', PARK)
        } else if (id.includes('land') || id.includes('landcover') || id.includes('landuse')) {
          map.setPaintProperty(layer.id, 'fill-color', LAND)
        } else if (id.includes('building')) {
          map.setPaintProperty(layer.id, 'fill-color', '#e4dfd4')
        }
      }
      if (layer.type === 'line') {
        if (id.includes('water')) {
          map.setPaintProperty(layer.id, 'line-color', WATER)
        } else if (id.includes('boundary') || id.includes('admin') || id.includes('border')) {
          map.setPaintProperty(layer.id, 'line-color', BRAND_FOREST)
          map.setPaintProperty(layer.id, 'line-opacity', 0.28)
        } else if (id.includes('road') || id.includes('highway') || id.includes('street') || id.includes('path')) {
          map.setPaintProperty(layer.id, 'line-color', ROAD)
        }
      }
      if (layer.type === 'symbol') {
        if (id.includes('water')) {
          map.setPaintProperty(layer.id, 'text-color', '#f7f7f4')
          map.setPaintProperty(layer.id, 'text-halo-color', WATER)
        } else {
          map.setPaintProperty(layer.id, 'text-color', INK)
          map.setPaintProperty(layer.id, 'text-halo-color', PAPER)
        }
      }
    } catch {
      // Layer may not support this paint property
    }
  }
}

const clusterLayer = {
  id: 'clusters',
  type: 'circle' as const,
  source: 'projects',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': BRAND_FOREST,
    'circle-radius': ['step', ['get', 'point_count'], 18, 5, 24, 15, 30],
    'circle-opacity': 0.96,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#ffffff',
  },
}

const clusterCountLayer = {
  id: 'cluster-count',
  type: 'symbol' as const,
  source: 'projects',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['Noto Sans Bold'],
    'text-size': 13,
  },
  paint: { 'text-color': '#ffffff' },
}

type AtlasMapProps = {
  projects: AtlasProject[]
  focusKey?: string
  selectedId?: string | null
  hoveredId?: string | null
  onSelect: (project: AtlasProject | null) => void
  onHover: (projectId: string | null) => void
  onBoundsChange?: (bounds: { west: number; south: number; east: number; north: number }) => void
  className?: string
}

export function AtlasMap({
  projects,
  focusKey,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  onBoundsChange,
  className,
}: AtlasMapProps) {
  const mapRef = useRef<MapRef>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const geojson = useMemo(() => projectsToGeoJSON(projects), [projects])

  const unclusteredPaint = useMemo(
    () => ({
      'circle-color': [
        'match',
        ['get', 'sector'],
        'agriculture',
        SECTOR_COLORS.agriculture,
        'energy',
        SECTOR_COLORS.energy,
        'water',
        SECTOR_COLORS.water,
        'biodiversity',
        SECTOR_COLORS.biodiversity,
        'pollution',
        SECTOR_COLORS.pollution,
        SECTOR_COLORS['climate-justice'],
      ],
      'circle-radius': ['case', ['==', ['get', 'id'], hoveredId || ''], 11, ['==', ['get', 'id'], selectedId || ''], 12, 7],
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
    }),
    [hoveredId, selectedId],
  )

  const handleLoad = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map) return
    applyEcoMapTint(map)
    map.resize()

    resizeObserverRef.current?.disconnect()
    const shell = map.getContainer().parentElement
    if (!shell) return
    resizeObserverRef.current = new ResizeObserver(() => map.resize())
    resizeObserverRef.current.observe(shell)
  }, [])

  useEffect(() => () => resizeObserverRef.current?.disconnect(), [])

  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map || focusKey === undefined) return

    if (projects.length === 0) {
      map.flyTo({ center: [20, 2], zoom: 2.8, duration: 800 })
      return
    }

    if (projects.length === 1) {
      const p = projects[0]
      map.flyTo({ center: [p.coordinates.lng, p.coordinates.lat], zoom: 7, duration: 800 })
      return
    }

    let minLng = Infinity
    let maxLng = -Infinity
    let minLat = Infinity
    let maxLat = -Infinity
    for (const p of projects) {
      minLng = Math.min(minLng, p.coordinates.lng)
      maxLng = Math.max(maxLng, p.coordinates.lng)
      minLat = Math.min(minLat, p.coordinates.lat)
      maxLat = Math.max(maxLat, p.coordinates.lat)
    }

    map.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: 48, maxZoom: 10, duration: 800 },
    )
  }, [focusKey, projects])

  const handleClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const map = mapRef.current?.getMap()
      if (!map) return
      const features = map.queryRenderedFeatures(event.point, {
        layers: ['clusters', 'unclustered-point'],
      })
      const feature = features[0]
      if (!feature) {
        onSelect(null)
        return
      }
      if (feature.properties?.cluster) {
        const clusterId = feature.properties.cluster_id as number
        const source = map.getSource('projects') as GeoJSONSource
        const zoom = Number(source.getClusterExpansionZoom(clusterId))
        const coords = (feature.geometry as GeoJSON.Point).coordinates
        map.easeTo({ center: [coords[0], coords[1]], zoom })
        return
      }
      const id = feature.properties?.id as string
      const project = projects.find((p) => p.id === id) ?? null
      onSelect(project)
    },
    [onSelect, projects],
  )

  const handleMoveEnd = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map || !onBoundsChange) return
    const b = map.getBounds()
    onBoundsChange({
      west: b.getWest(),
      south: b.getSouth(),
      east: b.getEast(),
      north: b.getNorth(),
    })
  }, [onBoundsChange])

  return (
    <div className="atlas-map-block">
      <div className={`atlas-map-shell ${className || ''}`}>
        <Map
          ref={mapRef}
          initialViewState={{ longitude: 20, latitude: 2, zoom: 2.8 }}
          mapStyle={MAP_STYLE}
          style={{ width: '100%', height: '100%' }}
          onLoad={handleLoad}
          onClick={handleClick}
          onMouseMove={(e) => {
            const map = mapRef.current?.getMap()
            if (!map) return
            const features = map.queryRenderedFeatures(e.point, { layers: ['unclustered-point'] })
            onHover(features[0]?.properties?.id ?? null)
          }}
          onMoveEnd={handleMoveEnd}
          interactiveLayerIds={['clusters', 'unclustered-point']}
        >
          <NavigationControl position="top-right" showCompass={false} />
          <Source id="projects" type="geojson" data={geojson} cluster clusterMaxZoom={12} clusterRadius={50}>
            <Layer
              id="clusters"
              type="circle"
              source="projects"
              filter={['has', 'point_count'] as never}
              paint={clusterLayer.paint as never}
            />
            <Layer
              id="cluster-count"
              type="symbol"
              source="projects"
              filter={['has', 'point_count'] as never}
              layout={clusterCountLayer.layout as never}
              paint={clusterCountLayer.paint as never}
            />
            <Layer
              id="unclustered-point"
              type="circle"
              source="projects"
              filter={['!', ['has', 'point_count']] as never}
              paint={unclusteredPaint as never}
            />
          </Source>
        </Map>
      </div>
      <ul className="atlas-map-legend" aria-label="Sectors">
        {(Object.keys(SECTOR_LABELS) as Array<keyof typeof SECTOR_LABELS>).map((sector) => (
          <li key={sector}>
            <span style={{ background: SECTOR_COLORS[sector] }} />
            {SECTOR_LABELS[sector]}
          </li>
        ))}
      </ul>
    </div>
  )
}
