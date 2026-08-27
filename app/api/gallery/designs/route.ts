import { join } from 'path'
import { readGalleryMediaFilesInFolder } from '@/app/api/gallery/mediaFiles'

export async function GET() {
  try {
    const designsDir = join(process.cwd(), 'public', 'gallery', 'designs')
    const files = await readGalleryMediaFilesInFolder(designsDir)

    return Response.json({ files })
  } catch (error) {
    console.error('Failed to read designs gallery:', error)
    return Response.json({ files: [] }, { status: 200 })
  }
}
