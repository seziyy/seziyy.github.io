import { NextResponse } from 'next/server'

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'seziyy'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

async function getGitHubData() {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`
  }

  const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
    headers,
  })

  return response.json()
}

export async function GET() {
  try {
    const data = await getGitHubData()

    if (!data) {
      return NextResponse.json(
        { error: 'Failed to fetch GitHub data' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      username: data.login,
      contributions: 234, // Bu veri GitHub GraphQL API ile alınabilir
      publicRepos: data.public_repos,
      followers: data.followers,
    })
  } catch (error) {
    console.error('Error fetching GitHub data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500 }
    )
  }
}
