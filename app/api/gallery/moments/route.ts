import { join } from 'path'
import { readGalleryMediaFilesInFolder } from '@/app/api/gallery/mediaFiles'

export async function GET() {
  try {
    const momentsDir = join(process.cwd(), 'public', 'gallery', 'moments')
    const files = await readGalleryMediaFilesInFolder(momentsDir)

    return Response.json({ files })
  } catch (error) {
    console.error('Failed to read moments gallery:', error)
    return Response.json({ files: [] }, { status: 200 })
  }
}
