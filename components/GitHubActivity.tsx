'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, GitCommit, Star } from 'lucide-react'

interface GitHubData {
  contributions?: number
  publicRepos?: number
  followers?: number
  username: string
}

export default function GitHubActivity() {
  const [data, setData] = useState<GitHubData>({ username: 'seziyy' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch('/api/github')
        // const githubData = await response.json()
        // setData(githubData)
        
        // Demo data
        setData({
          username: 'seziyy',
          contributions: 234,
          publicRepos: 15,
          followers: 42,
        })
      } catch (error) {
        console.error('GitHub data fetch error:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="card p-6"
    >
      <div className="flex items-center space-x-3 mb-4">
        <Github className="text-[color:var(--accent-strong)]" size={24} />
        <h3 className="text-lg font-semibold">GitHub Activity</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GitCommit className="text-[color:var(--accent)]" size={18} />
            <span className="text-[color:var(--muted)] text-sm">Contributions</span>
          </div>
          <span className="font-semibold">{data.contributions || 0}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Github className="text-[color:var(--accent)]" size={18} />
            <span className="text-[color:var(--muted)] text-sm">Repositories</span>
          </div>
          <span className="font-semibold">{data.publicRepos || 0}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="text-[color:var(--accent)]" size={18} />
            <span className="text-[color:var(--muted)] text-sm">Followers</span>
          </div>
          <span className="font-semibold">{data.followers || 0}</span>
        </div>
      </div>

      <a
        href={`https://github.com/${data.username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block text-center text-sm font-semibold link"
      >
        View Profile →
      </a>
    </motion.div>
  )
}
