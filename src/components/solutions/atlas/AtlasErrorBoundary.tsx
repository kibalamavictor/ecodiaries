'use client'

import { Component, type ReactNode } from 'react'

type AtlasErrorBoundaryProps = {
  children: ReactNode
  fallback: ReactNode
}

type AtlasErrorBoundaryState = {
  failed: boolean
}

export class AtlasErrorBoundary extends Component<AtlasErrorBoundaryProps, AtlasErrorBoundaryState> {
  state: AtlasErrorBoundaryState = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
