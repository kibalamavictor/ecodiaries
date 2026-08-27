'use client'

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'

type AudioPlayerContextValue = {
  currentEpisodeId: string | null
  isPlaying: boolean
  registerPlayer: (episodeId: string, pause: () => void) => void
  unregisterPlayer: (episodeId: string) => void
  playEpisode: (episodeId: string) => void
  pauseEpisode: (episodeId: string) => void
  setPlaying: (episodeId: string, playing: boolean) => void
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null)

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [currentEpisodeId, setCurrentEpisodeId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const playersRef = useRef<Map<string, () => void>>(new Map())

  const registerPlayer = useCallback((episodeId: string, pause: () => void) => {
    playersRef.current.set(episodeId, pause)
  }, [])

  const unregisterPlayer = useCallback((episodeId: string) => {
    playersRef.current.delete(episodeId)
    setCurrentEpisodeId((id) => (id === episodeId ? null : id))
    setIsPlaying(false)
  }, [])

  const playEpisode = useCallback((episodeId: string) => {
    playersRef.current.forEach((pause, id) => {
      if (id !== episodeId) pause()
    })
    setCurrentEpisodeId(episodeId)
    setIsPlaying(true)
  }, [])

  const pauseEpisode = useCallback((episodeId: string) => {
    setCurrentEpisodeId((id) => (id === episodeId ? episodeId : id))
    setIsPlaying(false)
  }, [])

  const setPlaying = useCallback((episodeId: string, playing: boolean) => {
    if (playing) {
      playersRef.current.forEach((pause, id) => {
        if (id !== episodeId) pause()
      })
      setCurrentEpisodeId(episodeId)
      setIsPlaying(true)
    } else {
      setCurrentEpisodeId((id) => {
        if (id === episodeId) setIsPlaying(false)
        return id
      })
    }
  }, [])

  const value = useMemo(
    () => ({
      currentEpisodeId,
      isPlaying,
      registerPlayer,
      unregisterPlayer,
      playEpisode,
      pauseEpisode,
      setPlaying,
    }),
    [currentEpisodeId, isPlaying, registerPlayer, unregisterPlayer, playEpisode, pauseEpisode, setPlaying],
  )

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext)
  if (!ctx) throw new Error('useAudioPlayer must be used within AudioPlayerProvider')
  return ctx
}

export function useAudioPlayerOptional() {
  return useContext(AudioPlayerContext)
}
