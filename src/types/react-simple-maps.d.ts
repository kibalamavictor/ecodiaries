declare module 'react-simple-maps' {
  import type { ReactNode, SVGProps } from 'react'

  export interface Geography {
    rsmKey: string
    properties: Record<string, unknown>
  }

  export interface ComposableMapProps extends SVGProps<SVGSVGElement> {
    projection?: string
    projectionConfig?: { scale?: number; center?: [number, number] }
    children?: ReactNode
  }

  export interface GeographiesProps {
    geography: string | object
    children: (args: { geographies: Geography[] }) => ReactNode
  }

  export interface MarkerProps extends SVGProps<SVGGElement> {
    coordinates: [number, number]
    children?: ReactNode
  }

  export const ComposableMap: (props: ComposableMapProps) => JSX.Element
  export const Geographies: (props: GeographiesProps) => JSX.Element
  export const Geography: (props: SVGProps<SVGPathElement> & { geography: Geography }) => JSX.Element
  export const Marker: (props: MarkerProps) => JSX.Element
}
