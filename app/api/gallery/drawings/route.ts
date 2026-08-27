import { join } from 'path'
import { readGalleryMediaFilesInFolder } from '@/app/api/gallery/mediaFiles'

export async function GET() {
  try {
    const drawingsDir = join(process.cwd(), 'public', 'gallery', 'drawings')
    const files = await readGalleryMediaFilesInFolder(drawingsDir)

    return Response.json({ files })
  } catch (error) {
    console.error('Failed to read drawings gallery:', error)
    return Response.json({ files: [] }, { status: 200 })
  }
}
