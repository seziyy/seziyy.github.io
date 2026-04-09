import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

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

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = join(process.cwd(), 'public', 'gallery', category)
    
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    const filename = `${Date.now()}-${file.name}`
    const filepath = join(uploadsDir, filename)

    await writeFile(filepath, buffer)

    return Response.json({
      success: true,
      path: `/gallery/${category}/${filename}`,
      filename: filename,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }
}
