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
}

export default function SpotifyNowPlaying() {
  const [data, setData] = useState<SpotifyData>({ isPlaying: false })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/spotify')
        const spotifyData = await response.json()
        setData(spotifyData)
      } catch (error) {
        console.error('Spotify data fetch error:', error)
        setData({
          isPlaying: false,
          title: 'Spotify connection failed',
          artist: 'Please check your API credentials',
        })
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
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
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-lg bg-[color:var(--accent-soft)] flex items-center justify-center">
            <Music className="text-[color:var(--accent-strong)]" size={24} />
          </div>
          <div className="flex-1">
            <p className="text-[color:var(--muted)] text-sm">Nothing is currently playing on Spotify</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}
