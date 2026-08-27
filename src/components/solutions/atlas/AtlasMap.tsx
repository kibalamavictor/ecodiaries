'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import Map, { Layer, Source, type MapLayerMouseEvent, type MapRef } from 'react-map-gl/maplibre'
import type { GeoJSONSource, Map as MapLibreMap } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { AtlasProject } from '@/lib/solutions/types'
import { SECTOR_COLORS, projectsToGeoJSON } from '@/lib/solutions/types'

const MAP_STYLE = process.env.NEXT_PUBLIC_MAP_STYLE_URL || 'https://tiles.openfreemap.org/styles/liberty'

const BRAND_FOREST = '#0B3E1F'
const BRAND_LIME = '#B6F101'
const WARM_WATER = '#1a4d3a'
const WARM_LAND = '#e8e4d8'

function applyEcoMapTint(map: MapLibreMap) {
  const style = map.getStyle()
  if (!style?.layers) return

  for (const layer of style.layers) {
    const id = layer.id.toLowerCase()
    try {
      if (id.includes('water') && layer.type === 'fill') {
        map.setPaintProperty(layer.id, 'fill-color', WARM_WATER)
        map.setPaintProperty(layer.id, 'fill-opacity', 0.85)
      }
      if ((id.includes('land') || id.includes('landcover') || id.includes('park')) && layer.type === 'fill') {
        map.setPaintProperty(layer.id, 'fill-color', WARM_LAND)
      }
      if (id === 'background' && layer.type === 'background') {
        map.setPaintProperty(layer.id, 'background-color', '#f0ede4')
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
    'circle-opacity': 0.92,
    'circle-stroke-width': 2,
    'circle-stroke-color': BRAND_LIME,
  },
}

const clusterCountLayer = {
  id: 'cluster-count',
  type: 'symbol' as const,
  source: 'projects',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
    'text-size': 13,
  },
  paint: { 'text-color': BRAND_LIME },
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
      'circle-stroke-color': BRAND_FOREST,
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
  )
}
