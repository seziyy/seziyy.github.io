const fs = require('fs')
const path = require('path')

const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const SPOTIFY_NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing'
const SPOTIFY_RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1'

function hasPlaceholder(value) {
  return !value || value.startsWith('your_')
}

function requiredEnv(name) {
  const value = process.env[name]

  if (hasPlaceholder(value)) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function mapTrack(track, isPlaying = false) {
  return {
    isPlaying,
    title: track?.name,
    artist: Array.isArray(track?.artists) ? track.artists.map((artist) => artist.name).join(', ') : undefined,
    album: track?.album?.name,
    albumImageUrl: track?.album?.images?.[0]?.url,
    songUrl: track?.external_urls?.spotify,
    trackId: track?.id,
  }
}

async function getAccessToken(clientId, clientSecret, refreshToken) {
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })

  const data = await response.json()

  if (!response.ok || !data.access_token) {
    throw new Error(`Spotify token request failed: ${JSON.stringify(data)}`)
  }

  return data.access_token
}

async function getNowPlaying(accessToken) {
  return fetch(SPOTIFY_NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

async function getRecentlyPlayed(accessToken) {
  return fetch(SPOTIFY_RECENTLY_PLAYED_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

async function buildSpotifyPayload() {
  const clientId = requiredEnv('SPOTIFY_CLIENT_ID')
  const clientSecret = requiredEnv('SPOTIFY_CLIENT_SECRET')
  const refreshToken = requiredEnv('SPOTIFY_REFRESH_TOKEN')

  const accessToken = await getAccessToken(clientId, clientSecret, refreshToken)
  const currentResponse = await getNowPlaying(accessToken)

  if (currentResponse.status !== 204 && currentResponse.status <= 400) {
    const currentData = await currentResponse.json()

    if (currentData?.item) {
      return {
        ...mapTrack(currentData.item, currentData.is_playing),
        source: currentData.is_playing ? 'currently_playing' : 'recently_played',
        deviceName: currentData?.device?.name,
        progressMs: currentData?.progress_ms,
        deviceType: currentData?.device?.type,
        deviceIsActive: currentData?.device?.is_active,
        updatedAt: new Date().toISOString(),
      }
    }
  }

  const fallbackResponse = await getRecentlyPlayed(accessToken)

  if (fallbackResponse.ok) {
    const fallbackData = await fallbackResponse.json()
    const fallbackTrack = fallbackData?.items?.[0]?.track

    if (fallbackTrack) {
      return {
        ...mapTrack(fallbackTrack, false),
        source: 'recently_played',
        updatedAt: new Date().toISOString(),
      }
    }
  }

  throw new Error('Spotify returned no playable track data')
}

async function main() {
  const payload = await buildSpotifyPayload()
  const outputPath = path.join(process.cwd(), 'public', 'spotify-now-playing.json')

  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2) + '\n', 'utf8')
  console.log(`Updated ${outputPath}`)
}

main().catch((error) => {
  console.error('Failed to update spotify-now-playing.json')
  console.error(error)
  process.exit(1)
})
