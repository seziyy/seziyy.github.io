import { readdir } from 'fs/promises'
import { join } from 'path'

type GalleryFileEntry = {
  path: string
  name: string
}

const imagePattern = /\.(jpe?g|png|webp|gif|jfif)$/i

const readGalleryFiles = async (absoluteDir: string, relativeDir = ''): Promise<GalleryFileEntry[]> => {
  const entries = await readdir(absoluteDir, { withFileTypes: true })

  const nested = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = join(absoluteDir, entry.name)
      const relativePath = relativeDir ? `${relativeDir}/${entry.name}` : entry.name

      if (entry.isDirectory()) {
        return readGalleryFiles(absolutePath, relativePath)
      }

      if (!entry.isFile() || !imagePattern.test(entry.name)) {
        return []
      }

      return [{ path: relativePath.replace(/\\/g, '/'), name: entry.name }]
    })
  )

  return nested.flat()
}

export async function GET() {
  try {
    const galleryRoot = join(process.cwd(), 'public', 'gallery')
    const files = await readGalleryFiles(galleryRoot)

    files.sort((a, b) => a.path.localeCompare(b.path, 'tr'))

    return Response.json({ files })
  } catch (error) {
    console.error('Failed to read full gallery:', error)
    return Response.json({ files: [] }, { status: 200 })
  }
}
