import { readdir } from 'fs/promises'
import { readFile } from 'fs/promises'
import { createHash } from 'crypto'
import { join } from 'path'

export async function GET() {
  try {
    const momentsDir = join(process.cwd(), 'public', 'gallery', 'moments')
    const entries = await readdir(momentsDir, { withFileTypes: true })

    const files = await Promise.all(entries
      .filter((entry) => entry.isFile())
      .map(async (entry) => {
        const name = entry.name
        if (!/\.(jpe?g|png|webp|gif|jfif)$/i.test(name)) {
          return null
        }

        const filePath = join(momentsDir, name)
        const buffer = await readFile(filePath)
        const hash = createHash('sha1').update(buffer).digest('hex')

        return { name, hash }
      })
    )

    const normalizedFiles = files.filter((file): file is { name: string; hash: string } => Boolean(file))

    return Response.json({ files: normalizedFiles })
  } catch (error) {
    console.error('Failed to read moments gallery:', error)
    return Response.json({ files: [] }, { status: 200 })
  }
}