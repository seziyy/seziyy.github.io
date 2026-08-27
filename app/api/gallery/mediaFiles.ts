import { createHash } from 'crypto'
import { readdir, readFile, stat } from 'fs/promises'
import { join } from 'path'

export type GalleryMediaType = 'image' | 'video' | 'pdf'

export type GalleryMediaFileEntry = {
  name: string
  hash: string
  modifiedAt: number
  mediaType: GalleryMediaType
}

export type GalleryMediaPathEntry = GalleryMediaFileEntry & {
  path: string
}

const mediaExtensions: Record<GalleryMediaType, RegExp> = {
  image: /\.(jpe?g|png|webp|gif|jfif)$/i,
  video: /\.(mp4|mov|webm)$/i,
  pdf: /\.pdf$/i,
}

export const getGalleryMediaType = (fileName: string): GalleryMediaType | null => {
  if (mediaExtensions.image.test(fileName)) return 'image'
  if (mediaExtensions.video.test(fileName)) return 'video'
  if (mediaExtensions.pdf.test(fileName)) return 'pdf'

  return null
}

const sortNewestFirst = <T extends { modifiedAt: number; name: string }>(items: T[]) => {
  return [...items].sort((a, b) => {
    const modifiedDifference = b.modifiedAt - a.modifiedAt
    if (modifiedDifference !== 0) return modifiedDifference

    return b.name.localeCompare(a.name, 'tr')
  })
}

export const readGalleryMediaFiles = async (
  absoluteDir: string,
  relativeDir = '',
): Promise<GalleryMediaPathEntry[]> => {
  const entries = await readdir(absoluteDir, { withFileTypes: true })

  const nested = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = join(absoluteDir, entry.name)
      const relativePath = relativeDir ? `${relativeDir}/${entry.name}` : entry.name

      if (entry.isDirectory()) {
        return readGalleryMediaFiles(absolutePath, relativePath)
      }

      const mediaType = getGalleryMediaType(entry.name)
      if (!entry.isFile() || !mediaType) {
        return []
      }

      const [buffer, fileStats] = await Promise.all([readFile(absolutePath), stat(absolutePath)])
      const hash = createHash('sha1').update(buffer).digest('hex')

      return [
        {
          path: relativePath.replace(/\\/g, '/'),
          name: entry.name,
          hash,
          modifiedAt: fileStats.mtimeMs,
          mediaType,
        },
      ]
    }),
  )

  return sortNewestFirst(nested.flat())
}

export const readGalleryMediaFilesInFolder = async (
  absoluteDir: string,
): Promise<GalleryMediaFileEntry[]> => {
  const files = await readGalleryMediaFiles(absoluteDir)

  return files.map((file) => ({
    name: file.name,
    hash: file.hash,
    modifiedAt: file.modifiedAt,
    mediaType: file.mediaType,
  }))
}
