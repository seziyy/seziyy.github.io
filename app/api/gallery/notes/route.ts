import { createHash } from 'crypto'
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const notesDir = join(process.cwd(), 'public', 'gallery', 'notes')
    const entries = await readdir(notesDir, { withFileTypes: true })

    const files = await Promise.all(
      entries
        .filter((entry) => entry.isFile())
        .map(async (entry) => {
          const name = entry.name
          if (!/\.(jpe?g|png|webp|gif|jfif)$/i.test(name)) {
            return null
          }

          const filePath = join(notesDir, name)
          const buffer = await readFile(filePath)
          const hash = createHash('sha1').update(buffer).digest('hex')

          return { name, hash }
        })
    )

    const normalizedFiles = files.filter((file): file is { name: string; hash: string } => Boolean(file))

    return Response.json({ files: normalizedFiles })
  } catch (error) {
    console.error('Failed to read notes gallery:', error)
    return Response.json({ files: [] }, { status: 200 })
  }
}