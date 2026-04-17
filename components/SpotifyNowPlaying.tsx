'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Music, Play } from 'lucide-react'
import Image from 'next/image'

interface SpotifyData {
  isPlaying: boolean
  title?: string
  artist?: string
  album?: string
  albumImageUrl?: string
  songUrl?: string
  source?: string
  warning?: string
  deviceName?: string
  deviceType?: string
  deviceIsActive?: boolean
  trackId?: string
  progressMs?: number
  cachedAt?: number
}

const SPOTIFY_CACHE_KEY = 'spotify-now-playing-cache'
const SPOTIFY_API_URL = process.env.NEXT_PUBLIC_SPOTIFY_API_URL || '/api/spotify'

function isTrackPayload(payload: SpotifyData | null | undefined) {
  return Boolean(payload?.title || payload?.artist || payload?.albumImageUrl)
}

function isErrorPayload(payload: SpotifyData | null | undefined) {
  if (!payload?.title) return false

  return [
    'Spotify connection failed',
    'Spotify authorization failed',
    'Spotify is not configured',
    'Spotify scope missing',
  ].includes(payload.title)
}

export default function SpotifyNowPlaying() {
  const [data, setData] = useState<SpotifyData | null>(null)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const dataRef = useRef<SpotifyData | null>(null)

  useEffect(() => {
    dataRef.current = data
  }, [data])

  useEffect(() => {
    try {
      const cachedValue = window.localStorage.getItem(SPOTIFY_CACHE_KEY)

      if (cachedValue) {
        const cachedData = JSON.parse(cachedValue) as SpotifyData

        if (isTrackPayload(cachedData)) {
          setData(cachedData)
          dataRef.current = cachedData
          setStatusMessage(cachedData.isPlaying ? null : 'Showing your last listened track.')
        }
      }
    } catch (error) {
      console.error('Spotify cache read error:', error)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const storeTrack = (spotifyData: SpotifyData) => {
      const cachedTrack = {
        ...spotifyData,
        cachedAt: Date.now(),
      }

      setData(cachedTrack)
      setStatusMessage(null)
      dataRef.current = cachedTrack

      try {
        window.localStorage.setItem(SPOTIFY_CACHE_KEY, JSON.stringify(cachedTrack))
      } catch (error) {
        console.error('Spotify cache write error:', error)
      }
    }

    const keepLastTrack = (message: string) => {
      setStatusMessage(message)

      if (!dataRef.current) {
        const fallbackData = {
          isPlaying: false,
          title: 'Spotify is unavailable right now',
          artist: 'The last listened track will appear after a successful sync.',
        }

        setData(fallbackData)
        dataRef.current = fallbackData
      }
    }

    const buildSpotifyApiUrl = () => {
      const endpoint = new URL(SPOTIFY_API_URL, window.location.origin)
      endpoint.searchParams.set('t', Date.now().toString())
      return endpoint.toString()
    }

    const fetchData = async () => {
      try {
        const response = await fetch(buildSpotifyApiUrl(), {
          cache: 'no-store',
        })
        const spotifyData = await response.json()

        if (isMounted) {
          setLastUpdatedAt(Date.now())

          if (isTrackPayload(spotifyData) && !isErrorPayload(spotifyData)) {
            storeTrack(spotifyData)
          } else if (isErrorPayload(spotifyData)) {
            keepLastTrack(spotifyData.artist || spotifyData.title || 'Spotify connection failed')
          } else {
            setStatusMessage(dataRef.current ? 'Showing your last listened track while Spotify is unavailable.' : null)
          }
        }
      } catch (error) {
        console.error('Spotify data fetch error:', error)
        if (isMounted) {
          setLastUpdatedAt(Date.now())

          if (dataRef.current) {
            keepLastTrack('Showing your last listened track while Spotify is unavailable.')
          } else {
            const fallbackData = {
              isPlaying: false,
              title: 'Spotify is unavailable right now',
              artist: 'The last listened track will appear after a successful sync.',
            }

            setData(fallbackData)
            dataRef.current = fallbackData
          }
        }
      }
    }

    fetchData()

    const handleFocus = () => {
      fetchData()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData()
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const interval = setInterval(fetchData, 5000)

    return () => {
      isMounted = false
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="card p-6"
    >
      <div className="flex items-center space-x-3 mb-4">
        <Music className="text-[color:var(--accent)]" size={24} />
        <h3 className="text-lg font-semibold">Now Playing</h3>
      </div>

      {lastUpdatedAt && (
        <p className="mb-3 text-xs text-[color:var(--muted)]">
          Last updated {new Date(lastUpdatedAt).toLocaleTimeString()}
        </p>
      )}

      {data && (data.deviceName || data.deviceType) && (
        <div className="mb-3 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[color:var(--muted)] uppercase tracking-[0.16em]">
          {data.deviceName && <span>Device: {data.deviceName}</span>}
          {data.deviceType && <span>Type: {data.deviceType}</span>}
        </div>
      )}

      {data?.isPlaying ? (
        <div className="flex items-center space-x-4">
          {data.albumImageUrl && (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={data.albumImageUrl}
                alt={data.album || 'Album cover'}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Play className="text-white" size={20} />
              </div>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{data.title}</p>
            <p className="text-[color:var(--muted)] text-sm truncate">{data.artist}</p>
            {data.warning && <p className="text-[color:var(--muted)] text-xs mt-1">{data.warning}</p>}
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-lg bg-[color:var(--accent-soft)] flex items-center justify-center">
            <Music className="text-[color:var(--accent-strong)]" size={24} />
          </div>
          <div className="flex-1">
            {data?.source === 'recently_played' && (
              <p className="text-[10px] uppercase tracking-[0.16em] text-[color:var(--muted)] mb-1">
                Last listened
              </p>
            )}
            <p className="text-[color:var(--muted)] text-sm">{data?.title || 'Nothing is currently playing on Spotify'}</p>
            {data?.artist && <p className="text-[color:var(--muted)] text-xs mt-1 break-words">{data.artist}</p>}
            {(data?.warning || statusMessage) && (
              <p className="text-[color:var(--muted)] text-xs mt-1">{data?.warning || statusMessage}</p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}
