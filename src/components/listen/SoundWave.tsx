'use client'

import type { CSSProperties } from 'react'

export function SoundWave({
  isPlaying,
  barCount = 28,
  className = '',
}: {
  isPlaying: boolean
  barCount?: number
  className?: string
}) {
  return (
    <div className={`sound-wave ${className}`.trim()} aria-hidden="true" data-playing={isPlaying}>
      {Array.from({ length: barCount }).map((_, i) => (
        <span key={i} className="sound-wave__bar" style={{ '--i': i } as CSSProperties} />
      ))}
    </div>
  )
}

export function SoundWaveMini({ isPlaying }: { isPlaying: boolean }) {
  return <SoundWave isPlaying={isPlaying} barCount={3} className="sound-wave--mini" />
}
