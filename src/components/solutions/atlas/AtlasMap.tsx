'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Map, { Layer, NavigationControl, Source, type MapLayerMouseEvent, type MapRef } from 'react-map-gl/maplibre'
import type { GeoJSONSource, Map as MapLibreMap, StyleSpecification } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { AtlasProject } from '@/lib/solutions/types'
import { SECTOR_COLORS, SECTOR_LABELS, projectsToGeoJSON } from '@/lib/solutions/types'
import { distanceKm, nearestProjects } from '@/lib/solutions/coordinates'
import {
  ECO_MAP,
  ECO_MAP_STYLE_URL,
  loadEcoMapStyle,
  tintEcoMapStyle,
} from '@/lib/solutions/eco-map-style'

const AFRICA_BOUNDS: [[number, number], [number, number]] = [
  [-17.8, -35.2],
  [51.8, 37.8],
]

function applyEcoMapTint(map: MapLibreMap) {
  const style = map.getStyle()
  if (!style?.layers) return
  const tinted = tintEcoMapStyle(style as StyleSpecification)
  for (const layer of tinted.layers) {
    if (!('paint' in layer) || !layer.paint) continue
    for (const [key, value] of Object.entries(layer.paint)) {
      try {
        map.setPaintProperty(layer.id, key, value)
      } catch {
        // Layer may not support this paint property
      }
    }
  }
}

const clusterLayer = {
  id: 'clusters',
  type: 'circle' as const,
  source: 'projects',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': ECO_MAP.forest,
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
  onReady?: () => void
  onError?: () => void
  className?: string
  cluster?: boolean
  autoFit?: boolean
  continentView?: boolean
  showLegend?: boolean
  maxZoom?: number
}

export function AtlasMap({
  projects,
  focusKey,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  onBoundsChange,
  onReady,
  onError,
  className,
  cluster = true,
  autoFit = true,
  continentView = false,
  showLegend = true,
  maxZoom = 11,
}: AtlasMapProps) {
  const mapRef = useRef<MapRef>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const [mapStyle, setMapStyle] = useState<StyleSpecification | string | null>(null)
  const geojson = useMemo(() => projectsToGeoJSON(projects), [projects])

  useEffect(() => {
    let cancelled = false
    loadEcoMapStyle()
      .then((style) => {
        if (!cancelled) setMapStyle(style)
      })
      .catch(() => {
        if (!cancelled) setMapStyle(ECO_MAP_STYLE_URL)
      })
    return () => {
      cancelled = true
    }
  }, [])

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
      'circle-radius': [
        'case',
        ['==', ['get', 'id'], hoveredId || ''],
        14,
        ['==', ['get', 'id'], selectedId || ''],
        15,
        11,
      ],
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
    }),
    [hoveredId, selectedId],
  )

  const fitCamera = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map) return

    try {
      if (continentView) {
        map.fitBounds(AFRICA_BOUNDS, {
          padding: { top: 18, bottom: 28, left: 16, right: 16 },
          duration: 0,
          maxZoom: 4.35,
        })
        return
      }

      if (!autoFit) return

      if (projects.length === 0) {
        map.jumpTo({ center: [22, 3], zoom: 3.1 })
        return
      }

      if (projects.length === 1) {
        const p = projects[0]
        map.jumpTo({ center: [p.coordinates.lng, p.coordinates.lat], zoom: 6 })
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
        { padding: 80, maxZoom: 5.2, duration: 0 },
      )
    } catch {
      // Software WebGL in some environments cannot animate the camera.
    }
  }, [autoFit, continentView, projects])

  const handleLoad = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map) return
    applyEcoMapTint(map)
    map.resize()
    fitCamera()
    onReady?.()

    resizeObserverRef.current?.disconnect()
    const shell = map.getContainer().parentElement
    if (!shell) return
    resizeObserverRef.current = new ResizeObserver(() => map.resize())
    resizeObserverRef.current.observe(shell)
  }, [fitCamera, onReady])

  useEffect(() => () => resizeObserverRef.current?.disconnect(), [])

  useEffect(() => {
    fitCamera()
  }, [fitCamera, focusKey, mapStyle])

  const handleClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const map = mapRef.current?.getMap()
      const click = { lat: event.lngLat.lat, lng: event.lngLat.lng }

      if (map) {
        try {
          const box: [[number, number], [number, number]] = [
            [event.point.x - 18, event.point.y - 18],
            [event.point.x + 18, event.point.y + 18],
          ]
          const layers = cluster ? ['clusters', 'cluster-count', 'unclustered-point'] : ['unclustered-point']
          const features = map.queryRenderedFeatures(box, { layers })
          const feature = features[0]
          if (feature) {
            const layerId = feature.layer?.id
            if (cluster && (feature.properties?.cluster || layerId === 'clusters' || layerId === 'cluster-count')) {
              const clusterId = feature.properties?.cluster_id as number
              const source = map.getSource('projects') as GeoJSONSource
              const coords = (feature.geometry as GeoJSON.Point).coordinates
              const currentZoom = map.getZoom()
              void source
                .getClusterExpansionZoom(clusterId)
                .then((zoom) => {
                  const nextZoom = Number.isFinite(zoom)
                    ? Math.min(Math.max(zoom, currentZoom + 1.5), 12)
                    : currentZoom + 2
                  try {
                    map.jumpTo({ center: [coords[0], coords[1]], zoom: nextZoom })
                  } catch {
                    /* software WebGL cannot always move the camera */
                  }
                })
                .catch(() => undefined)
              return
            }
            const id = feature.properties?.id as string
            const project = projects.find((p) => p.id === id)
            if (project) {
              onSelect(project)
              return
            }
          }
        } catch {
          /* queryRenderedFeatures can throw while the style is still loading */
        }
      }

      const nearest = nearestProjects(projects, click, 1)[0]
      if (nearest && distanceKm(click, nearest.coordinates) < 900) {
        onSelect(nearest)
        return
      }
      onSelect(null)
    },
    [cluster, onSelect, projects],
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
        {mapStyle ? (
        <Map
          ref={mapRef}
          initialViewState={{ longitude: 18.5, latitude: 2.2, zoom: 3.15 }}
          minZoom={2.2}
          maxZoom={maxZoom}
          doubleClickZoom
          dragRotate={false}
          touchPitch={false}
          scrollZoom={false}
          cooperativeGestures
          mapStyle={mapStyle}
          style={{ width: '100%', height: '100%' }}
          onLoad={handleLoad}
          onClick={handleClick}
          onError={(event) => {
            const message = event.error?.message || ''
            if (/webgl|failed to initialize/i.test(message)) onError?.()
          }}
          onMouseMove={(e) => {
            const map = mapRef.current?.getMap()
            if (!map) return
            try {
              if (!map.getLayer('unclustered-point')) return
              const features = map.queryRenderedFeatures(e.point, { layers: ['unclustered-point'] })
              onHover(features[0]?.properties?.id ?? null)
            } catch {
              onHover(null)
            }
          }}
          onMoveEnd={handleMoveEnd}
          cursor="pointer"
        >
          <NavigationControl position="top-right" showCompass={false} />
          <Source
            key={cluster ? 'clustered' : 'points'}
            id="projects"
            type="geojson"
            data={geojson}
            {...(cluster ? { cluster: true, clusterMaxZoom: 12, clusterRadius: 50 } : {})}
          >
            {cluster ? (
              <>
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
              </>
            ) : null}
            <Layer
              id="unclustered-point"
              type="circle"
              source="projects"
              filter={(cluster ? ['!', ['has', 'point_count']] : ['has', 'id']) as never}
              paint={unclusteredPaint as never}
            />
          </Source>
        </Map>
        ) : null}
      </div>
      {showLegend ? (
        <ul className="atlas-map-legend" aria-label="Sectors">
          {(Object.keys(SECTOR_LABELS) as Array<keyof typeof SECTOR_LABELS>).map((sector) => (
            <li key={sector}>
              <span style={{ background: SECTOR_COLORS[sector] }} />
              {SECTOR_LABELS[sector]}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
