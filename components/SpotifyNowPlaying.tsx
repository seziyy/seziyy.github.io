'use client'

import { useEffect, useState } from 'react'
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
}

export default function SpotifyNowPlaying() {
  const [data, setData] = useState<SpotifyData>({ isPlaying: false })
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null)

  useEffect(() => {
    let isMounted = true
    const apiBaseUrl = window.location.origin

    const fetchData = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/spotify/?t=${Date.now()}`, {
          cache: 'no-store',
        })
        const spotifyData = await response.json()
        if (isMounted) {
          setData(spotifyData)
          setLastUpdatedAt(Date.now())
        }
      } catch (error) {
        console.error('Spotify data fetch error:', error)
        if (isMounted) {
          setData({
            isPlaying: false,
            title: 'Spotify connection failed',
            artist: 'Please check your API credentials',
          })
          setLastUpdatedAt(Date.now())
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

      {(data.source || data.deviceName) && (
        <div className="mb-3 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[color:var(--muted)] uppercase tracking-[0.16em]">
          {data.source && <span>Source: {data.source}</span>}
          {data.deviceName && <span>Device: {data.deviceName}</span>}
          {data.deviceType && <span>Type: {data.deviceType}</span>}
        </div>
      )}

      {data.isPlaying ? (
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
            <p className="text-[color:var(--muted)] text-sm">{data.title || 'Nothing is currently playing on Spotify'}</p>
            {data.artist && <p className="text-[color:var(--muted)] text-xs mt-1 break-words">{data.artist}</p>}
            {data.warning && <p className="text-[color:var(--muted)] text-xs mt-1">{data.warning}</p>}
          </div>
        </div>
      )}
    </motion.div>
  )
}
