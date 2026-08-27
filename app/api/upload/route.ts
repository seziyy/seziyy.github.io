import { writeFile, mkdir, unlink, stat } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { getGalleryMediaType } from '@/app/api/gallery/mediaFiles'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!['drawings', 'designs', 'notes', 'moments'].includes(category)) {
      return Response.json({ error: 'Invalid category' }, { status: 400 })
    }

    const mediaType = getGalleryMediaType(file.name)
    if (!mediaType) {
      return Response.json({ error: 'Unsupported file type' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = join(process.cwd(), 'public', 'gallery', category)
    
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    const filename = `${Date.now()}-${file.name}`
    const filepath = join(uploadsDir, filename)

    await writeFile(filepath, buffer)
    const fileStats = await stat(filepath)

    return Response.json({
      success: true,
      path: `/gallery/${category}/${filename}`,
      filename: filename,
      modifiedAt: fileStats.mtimeMs,
      mediaType,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { imagePath } = await request.json()

    if (typeof imagePath !== 'string' || !imagePath.trim()) {
      return Response.json({ error: 'Invalid image path' }, { status: 400 })
    }

    const normalizedPath = imagePath.trim().replace(/\\/g, '/')

    if (!normalizedPath.startsWith('/gallery/')) {
      return Response.json({ error: 'Invalid image path' }, { status: 400 })
    }

    const safeRelativePath = normalizedPath.replace(/^\/gallery\//, '')

    if (safeRelativePath.includes('..')) {
      return Response.json({ error: 'Invalid image path' }, { status: 400 })
    }

    const filePath = join(process.cwd(), 'public', 'gallery', safeRelativePath)

    if (!existsSync(filePath)) {
      return Response.json({ success: true, removed: false })
    }

    await unlink(filePath)
    return Response.json({ success: true, removed: true })
  } catch (error) {
    console.error('Delete image error:', error)
    return Response.json({ error: 'Delete failed' }, { status: 500 })
  }
}
