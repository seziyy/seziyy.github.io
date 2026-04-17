import { NextResponse } from 'next/server'

const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const SPOTIFY_NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing'
const SPOTIFY_RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1'

const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')

function hasPlaceholder(value?: string) {
  return !value || value.startsWith('your_')
}

function noStoreHeaders() {
  return {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  }
}

async function getAccessToken() {
  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token!,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(JSON.stringify(data))
  }

  if (!data.access_token) {
    throw new Error('Missing access token from Spotify token endpoint')
  }

  return data.access_token as string
}

async function getNowPlaying(accessToken: string) {
  return fetch(SPOTIFY_NOW_PLAYING_ENDPOINT, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

async function getRecentlyPlayed(accessToken: string) {
  return fetch(SPOTIFY_RECENTLY_PLAYED_ENDPOINT, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

function mapTrack(track: any, isPlaying = false) {
  return {
    isPlaying,
    title: track?.name,
    artist: Array.isArray(track?.artists) ? track.artists.map((artist: any) => artist.name).join(', ') : undefined,
    album: track?.album?.name,
    albumImageUrl: track?.album?.images?.[0]?.url,
    songUrl: track?.external_urls?.spotify,
    trackId: track?.id,
    deviceName: undefined,
  }
}

async function getTrackResponse(accessToken: string) {
  const currentResponse = await getNowPlaying(accessToken)

  if (currentResponse.status !== 204 && currentResponse.status <= 400) {
    const currentData = await currentResponse.json()

    if (currentData?.item) {
      return {
        ...mapTrack(currentData.item, currentData.is_playing),
        source: 'currently_playing',
        deviceName: currentData?.device?.name,
        progressMs: currentData?.progress_ms,
        deviceType: currentData?.device?.type,
        deviceIsActive: currentData?.device?.is_active,
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
      }
    }
  } else if (fallbackResponse.status === 403) {
    return {
      isPlaying: false,
      title: 'Spotify scope missing',
      artist: 'Add user-read-recently-played when generating a new refresh token',
      source: 'scope_warning',
    }
  }

  return null
}

export async function GET() {
  try {
    if (hasPlaceholder(client_id) || hasPlaceholder(client_secret) || hasPlaceholder(refresh_token)) {
      return NextResponse.json({
        isPlaying: false,
        title: 'Spotify is not configured',
        artist: 'Set real SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN in .env.local',
      }, { headers: noStoreHeaders() })
    }

    const accessToken = await getAccessToken()
    const trackResponse = await getTrackResponse(accessToken)

    if (!trackResponse) {
      return NextResponse.json({ isPlaying: false }, { headers: noStoreHeaders() })
    }

    if (trackResponse.source === 'currently_playing' && trackResponse.isPlaying === false) {
      const response = await getNowPlaying(accessToken)

      if (response.status === 401) {
        const retryAccessToken = await getAccessToken()
        const retryTrackResponse = await getTrackResponse(retryAccessToken)

        if (retryTrackResponse) {
          return NextResponse.json(retryTrackResponse, { headers: noStoreHeaders() })
        }
      }
    }

    return NextResponse.json(trackResponse, {
      headers: noStoreHeaders(),
    })
  } catch (error) {
    console.error('Error fetching Spotify data:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown Spotify authentication error'

    return NextResponse.json({
      isPlaying: false,
      title: 'Spotify authorization failed',
      artist: errorMessage,
    }, {
      status: 500,
      headers: noStoreHeaders(),
    })
  }
}
