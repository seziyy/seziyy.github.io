'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Category = 'All' | 'Drawings' | 'Designs' | 'Notes' | 'Moments'
type GalleryItem = {
  id: number
  title: string
  category: string
  image: string
  hash?: string
}

const categories: Category[] = ['All', 'Drawings', 'Designs', 'Notes', 'Moments']

const normalizeCategory = (rawCategory: string): Exclude<Category, 'All'> => {
  const normalized = rawCategory.trim().toLowerCase()

  if (normalized === 'drawing' || normalized === 'drawings') return 'Drawings'
  if (normalized === 'design' || normalized === 'designs' || normalized === 'my designs') return 'Designs'
  if (normalized === 'note' || normalized === 'notes') return 'Notes'
  return 'Moments'
}

const categoryFolders = {
  Drawings: 'drawings',
  Designs: 'designs',
  Notes: 'notes',
  Moments: 'moments',
} as const

type GalleryFolderCategory = keyof typeof categoryFolders

const toImageSrc = (src?: string) => {
  return src ? encodeURI(src) : ''
}

const normalizeImagePath = (image: string) => {
  const trimmed = image.trim().replace(/\\/g, '/')
  if (!trimmed) return ''

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`

  try {
    return decodeURI(withLeadingSlash)
  } catch {
    return withLeadingSlash
  }
}

const remapGalleryImagePath = (image: string) => {
  const normalized = normalizeImagePath(image).toLowerCase()

  if (
    normalized === '/gallery/uiux-1.jpg' ||
    normalized === '/gallery/designs/kriptooloji.png' ||
    normalized === '/gallery/designs/kriptoloji.png'
  ) {
    return '/gallery/designs/kripto.png'
  }

  return image
}

const getCategoryFromImagePath = (imagePath: string): Exclude<Category, 'All'> | null => {
  const normalized = normalizeImagePath(imagePath).toLowerCase()

  if (normalized.startsWith('/gallery/drawings/')) return 'Drawings'
  if (normalized.startsWith('/gallery/designs/')) return 'Designs'
  if (normalized.startsWith('/gallery/notes/')) return 'Notes'
  if (normalized.startsWith('/gallery/moments/')) return 'Moments'

  return null
}

const resolveCategory = (item: GalleryItem, imagePath: string): Exclude<Category, 'All'> => {
  return getCategoryFromImagePath(imagePath) ?? normalizeCategory(item.category)
}

type FolderFileEntry = {
  name: string
  hash?: string
}

const getFileTitle = (fileName: string) => {
  return fileName.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim()
}

const buildFolderGalleryItems = (
  folder: 'drawings' | 'designs' | 'notes' | 'moments',
  fileEntries: FolderFileEntry[],
  title: string,
): GalleryItem[] => {
  const baseId =
    folder === 'drawings'
      ? 2000
      : folder === 'designs'
        ? 2250
        : folder === 'notes'
          ? 2500
          : 3000

  return fileEntries.map((fileEntry, index) => ({
    id: baseId + index,
    title: folder === 'moments' ? title : getFileTitle(fileEntry.name) || title,
    category:
      folder === 'drawings'
        ? 'Drawings'
        : folder === 'designs'
          ? 'Designs'
          : folder === 'notes'
            ? 'Notes'
            : 'Moments',
    image: `/gallery/${folder}/${fileEntry.name}`,
    hash: fileEntry.hash,
  }))
}

const designGalleryItems: GalleryItem[] = [
  { id: 21, title: 'Untitled Design', category: 'Designs', image: '/gallery/designs/Untitled.png' },
  { id: 22, title: 'Untitled Design 2', category: 'Designs', image: '/gallery/designs/Untitled (6).png' },
  { id: 23, title: '8 Mart', category: 'Designs', image: '/gallery/designs/8 Mart.png' },
  { id: 24, title: 'Adsiz Tasarim 1', category: 'Designs', image: '/gallery/designs/Adsız tasarım (1).png' },
  { id: 25, title: 'As Design', category: 'Designs', image: '/gallery/designs/as.png' },
  { id: 26, title: 'Bs Design', category: 'Designs', image: '/gallery/designs/bs.png' },
  { id: 27, title: 'Glitter and Grit', category: 'Designs', image: '/gallery/designs/Glitter & Grit..png' },
]

const removedGalleryImages = new Set([
  '/gallery/designs/kripto.png',
  '/gallery/designs/kriptooloji.png',
  '/gallery/designs/kriptoloji.png',
  '/gallery/uiux-1.jpg',
])

const rotatedImagePaths = new Set([
  '/gallery/drawings/sezin3.jpg',
  '/gallery/drawings/sezin6.jpg',
  '/gallery/notes/sezin2.jpg',
])

const defaultGalleryItems: GalleryItem[] = [
  { id: 11, title: 'My father drew me.', category: 'Drawing', image: '/gallery/drawings/sezin.jpg' },
  { id: 12, title: 'I drew this when I was 6.', category: 'Drawing', image: '/gallery/drawings/sezin3.jpg' },
  { id: 13, title: 'I drew this when I was 3.', category: 'Drawing', image: '/gallery/drawings/sezin6.jpg' },
  { id: 14, title: 'Drawing 4', category: 'Drawing', image: '/gallery/drawings/sezin7.jpg' },
  { id: 15, title: 'Lived in lojman,werent allowed draw on the walls.So i left a memory: Little Prince', category: 'Drawing', image: '/gallery/drawings/sezin8.jpg' },
  { id: 16, title: 'ME?', category: 'Drawing', image: '/gallery/drawings/sezin9.jpg' },
  { id: 17, title: 'Joker', category: 'Drawing', image: '/gallery/drawings/sezin10.jpg' },
  { id: 18, title: 'Drawing 8', category: 'Drawing', image: '/gallery/drawings/sezin11.jpg' },
  { id: 19, title: 'Note 1', category: 'Notes', image: '/gallery/notes/sezin2.jpg' },
  ...designGalleryItems,
]

const mergeGalleryItems = (baseItems: GalleryItem[], storedItems: GalleryItem[]) => {
  const merged = new Map<string, GalleryItem>()
  const seenImagePaths = new Set<string>()
  const seenHashes = new Set<string>()

  const getItemKey = (item: GalleryItem) => {
    const image = normalizeImagePath(remapGalleryImagePath(item.image))
    return item.hash ?? image
  }

  baseItems.forEach((item) => {
    const image = normalizeImagePath(remapGalleryImagePath(item.image))
    if (!image) return

    if (removedGalleryImages.has(image)) {
      return
    }

    const key = getItemKey(item)
    if (seenImagePaths.has(image) || (item.hash && seenHashes.has(item.hash))) {
      return
    }

    const category = resolveCategory(item, image)

    merged.set(key, {
      ...item,
      image,
      category,
      title: category === 'Moments' ? 'memories last forever' : item.title,
    })
    seenImagePaths.add(image)
    if (item.hash) {
      seenHashes.add(item.hash)
    }
  })

  storedItems.forEach((item) => {
    const image = normalizeImagePath(remapGalleryImagePath(item.image))
    if (!image) return

    if (removedGalleryImages.has(image)) {
      return
    }

    // Keep canonical defaults when the same image already exists.
    const key = item.hash ?? image

    if (merged.has(key) || seenImagePaths.has(image) || (item.hash && seenHashes.has(item.hash))) {
      return
    }

    const category = resolveCategory(item, image)

    merged.set(key, {
      ...item,
      image,
      title: category === 'Moments' ? 'memories last forever' : item.title,
      category,
    })
    seenImagePaths.add(image)
    if (item.hash) {
      seenHashes.add(item.hash)
    }
  })

  return Array.from(merged.values())
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(defaultGalleryItems)
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  useEffect(() => {
    const stored = window.localStorage.getItem('admin-gallery')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setGalleryItems(mergeGalleryItems(defaultGalleryItems, parsed))
        }
      } catch {
        setGalleryItems(defaultGalleryItems)
      }
    }
  }, [])

  useEffect(() => {
    const loadFolder = async (folder: 'drawings' | 'designs' | 'notes' | 'moments', title: string) => {
      try {
        const response = await fetch(`/api/gallery/${folder}`)
        if (!response.ok) return

        const data: { files?: FolderFileEntry[] } = await response.json()
        if (Array.isArray(data.files) && data.files.length > 0) {
          setGalleryItems((currentItems) =>
            mergeGalleryItems(currentItems, buildFolderGalleryItems(folder, data.files ?? [], title))
          )
        }
      } catch {
        return
      }
    }

    void loadFolder('drawings', 'Drawings')
    void loadFolder('designs', 'Designs')
    void loadFolder('notes', 'Notes')
    void loadFolder('moments', 'memories last forever')
  }, [])

  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter((item) => {
        const resolvedCategory = resolveCategory(item, item.image)
        return resolvedCategory === activeCategory
      })

  const activeFolder =
    activeCategory === 'All'
      ? null
      : categoryFolders[activeCategory as GalleryFolderCategory]

  const openImage = (index: number) => {
    setSelectedImage(index)
  }

  const closeImage = () => {
    setSelectedImage(null)
  }

  const showPreviousImage = () => {
    setSelectedImage((current) => {
      if (current === null) return current
      return (current - 1 + filteredItems.length) % filteredItems.length
    })
  }

  const showNextImage = () => {
    setSelectedImage((current) => {
      if (current === null) return current
      return (current + 1) % filteredItems.length
    })
  }

  const shouldRotateImage = (imagePath?: string) => {
    return imagePath ? rotatedImagePaths.has(normalizeImagePath(imagePath)) : false
  }

  return (
    <div className="min-h-screen pt-28 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="uppercase tracking-[0.2em] text-xs text-[color:var(--muted)]">Gallery</p>
          <h1 className="text-5xl font-display mt-4 mb-4">
            Gallery
          </h1>
          <p className="text-[color:var(--muted)] text-lg mb-8">
          Photos I've taken and the people I love 
          </p>
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-[color:var(--accent)] text-white shadow-lg'
                    : 'bg-white text-[color:var(--muted)] hover:text-[color:var(--ink)] border border-[color:var(--stroke)]'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.length === 0 ? (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full rounded-3xl border border-dashed border-[color:var(--stroke)] bg-white/70 p-10 text-center"
              >
                <p className="text-xl font-semibold mb-2">No photos yet</p>
                <p className="text-[color:var(--muted)]">
                  {activeFolder
                    ? `Add images to public/gallery/${activeFolder} and they will appear here.`
                    : 'Add images in gallery categories and they will appear here.'}
                </p>
              </motion.div>
            ) : (
              filteredItems.map((item, index) => (
                (() => {
                  const isRotated = shouldRotateImage(item.image)
                  return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  onClick={() => openImage(index)}
                  className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-white border border-[color:var(--stroke)]"
                >
                  <div className="absolute inset-0 bg-[color:var(--accent-soft)]">
                    <img
                      src={toImageSrc(item.image)}
                      alt={item.title}
                      className={isRotated
                        ? 'h-full w-full object-contain -rotate-90 scale-[0.82]'
                        : 'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'}
                      onError={(event) => {
                        event.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <div>
                      <p className="text-white font-semibold text-lg mb-1">{item.title}</p>
                      <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-full border border-white/30">
                        {resolveCategory(item, item.image)}
                      </span>
                    </div>
                  </div>
                </motion.div>
                  )
                })()
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Simple Lightbox */}
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeImage}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative max-w-5xl w-full"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="relative h-[78vh] max-h-[820px] bg-[color:var(--accent-soft)] rounded-2xl flex items-center justify-center overflow-hidden">
                  <img
                    src={toImageSrc(filteredItems[selectedImage]?.image)}
                    alt={filteredItems[selectedImage]?.title ?? 'Gallery image'}
                    className={shouldRotateImage(filteredItems[selectedImage]?.image)
                      ? 'h-full w-full object-contain -rotate-90 scale-[0.9] rounded-2xl'
                      : 'h-full w-full object-contain rounded-2xl'}
                    onError={(event) => {
                      event.currentTarget.style.display = 'none'
                    }}
                  />

                  <button
                    type="button"
                    onClick={showPreviousImage}
                    aria-label="Previous photo"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm border border-white/20 transition-transform hover:scale-105"
                  >
                    <ChevronLeft size={22} />
                  </button>

                  <button
                    type="button"
                    onClick={showNextImage}
                    aria-label="Next photo"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm border border-white/20 transition-transform hover:scale-105"
                  >
                    <ChevronRight size={22} />
                  </button>

                  <button
                    type="button"
                    onClick={closeImage}
                    aria-label="Close viewer"
                    className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm border border-white/20 transition-transform hover:scale-105"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-white text-center mt-4 text-xl font-semibold">
                  {filteredItems[selectedImage]?.title}
                </p>
                <p className="text-gray-400 text-center mt-2">
                  {filteredItems[selectedImage]?.image
                    ? resolveCategory(filteredItems[selectedImage], filteredItems[selectedImage].image)
                    : ''}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
