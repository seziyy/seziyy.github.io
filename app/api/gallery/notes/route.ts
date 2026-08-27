import { join } from 'path'
import { readGalleryMediaFilesInFolder } from '@/app/api/gallery/mediaFiles'

export async function GET() {
  try {
    const notesDir = join(process.cwd(), 'public', 'gallery', 'notes')
    const files = await readGalleryMediaFilesInFolder(notesDir)

    return Response.json({ files })
  } catch (error) {
    console.error('Failed to read notes gallery:', error)
    return Response.json({ files: [] }, { status: 200 })
  }
}
