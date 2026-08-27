import { join } from 'path'
import { readGalleryMediaFiles } from '@/app/api/gallery/mediaFiles'

export async function GET() {
  try {
    const galleryRoot = join(process.cwd(), 'public', 'gallery')
    const files = await readGalleryMediaFiles(galleryRoot)

    return Response.json({ files })
  } catch (error) {
    console.error('Failed to read full gallery:', error)
    return Response.json({ files: [] }, { status: 200 })
  }
}
