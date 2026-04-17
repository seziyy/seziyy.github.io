const https = require('https')
const readline = require('readline')
const fs = require('fs')
const path = require('path')

function loadLocalEnvFile() {
  const envPath = path.resolve(process.cwd(), '.env.local')

  if (!fs.existsSync(envPath)) {
    return
  }

  const content = fs.readFileSync(envPath, 'utf8')
  const lines = content.split(/\r?\n/)

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    const separatorIndex = trimmed.indexOf('=')

    if (separatorIndex <= 0) {
      continue
    }

    const key = trimmed.slice(0, separatorIndex).trim()
    const rawValue = trimmed.slice(separatorIndex + 1).trim()

    if (!key || process.env[key]) {
      continue
    }

    const cleanedValue = rawValue.replace(/^['"]|['"]$/g, '')
    process.env[key] = cleanedValue
  }
}

loadLocalEnvFile()

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:3000/callback'

if (!clientId || !clientSecret) {
  console.error('SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set in .env.local')
  process.exit(1)
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

rl.question('Paste the Spotify authorization code here: ', (code) => {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code.trim(),
    redirect_uri: redirectUri,
  }).toString()

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const req = https.request(
    'https://accounts.spotify.com/api/token',
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
      },
    },
    (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          if (!res.statusCode || res.statusCode >= 400) {
            console.error('Spotify token exchange failed:')
            console.error(parsed)
            process.exit(1)
          }

          console.log('\nRefresh token:')
          console.log(parsed.refresh_token)
          console.log('\nAdd this to .env.local:')
          console.log(`SPOTIFY_REFRESH_TOKEN=${parsed.refresh_token}`)
          rl.close()
        } catch (error) {
          console.error('Could not parse Spotify response:')
          console.error(data)
          process.exit(1)
        }
      })
    },
  )

  req.on('error', (error) => {
    console.error('Request failed:', error.message)
    process.exit(1)
  })

  req.write(body)
  req.end()
})
