'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, FileText, PlayCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Category = 'All' | 'Drawings' | 'Designs' | 'Notes' | 'Moments'
type MediaType = 'image' | 'video' | 'pdf'
type GalleryItem = {
  id: number
  title: string
  category: string
  image: string
  hash?: string
  modifiedAt?: number
  mediaType?: MediaType
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
  modifiedAt?: number
  mediaType?: MediaType
}

const getFileTitle = (fileName: string) => {
  return fileName.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim()
}

const getMediaTypeFromPath = (path?: string): MediaType => {
  const normalized = normalizeImagePath(path ?? '').toLowerCase()

  if (/\.(mp4|mov|webm)$/.test(normalized)) return 'video'
  if (/\.pdf$/.test(normalized)) return 'pdf'

  return 'image'
}

const getTimestampFromPath = (path: string) => {
  const fileName = normalizeImagePath(path).split('/').pop() ?? ''
  const timestamp = fileName.match(/^(\d{10,})-/)?.[1]

  return timestamp ? Number(timestamp) : null
}

const getGallerySortValue = (item: GalleryItem) => {
  return item.modifiedAt ?? getTimestampFromPath(item.image) ?? item.id
}

const sortGalleryItemsNewestFirst = (items: GalleryItem[]) => {
  return [...items].sort((a, b) => {
    const sortDifference = getGallerySortValue(b) - getGallerySortValue(a)
    if (sortDifference !== 0) return sortDifference

    return normalizeImagePath(b.image).localeCompare(normalizeImagePath(a.image), 'tr')
  })
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
    modifiedAt: fileEntry.modifiedAt,
    mediaType: fileEntry.mediaType ?? getMediaTypeFromPath(fileEntry.name),
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
  const imageKeys = new Map<string, string>()
  const hashKeys = new Map<string, string>()

  const addItem = (item: GalleryItem) => {
    const image = normalizeImagePath(remapGalleryImagePath(item.image))
    if (!image) return

    if (removedGalleryImages.has(image)) {
      return
    }

    const existingKey = imageKeys.get(image) ?? (item.hash ? hashKeys.get(item.hash) : undefined)
    const category = resolveCategory(item, image)
    const mediaType = item.mediaType ?? getMediaTypeFromPath(image)

    if (existingKey) {
      const currentItem = merged.get(existingKey)
      if (!currentItem) return

      const newestModifiedAt = Math.max(currentItem.modifiedAt ?? 0, item.modifiedAt ?? 0)

      merged.set(existingKey, {
        ...currentItem,
        hash: currentItem.hash ?? item.hash,
        modifiedAt: newestModifiedAt > 0 ? newestModifiedAt : currentItem.modifiedAt ?? item.modifiedAt,
        mediaType: currentItem.mediaType ?? mediaType,
      })
      imageKeys.set(image, existingKey)
      if (item.hash) {
        hashKeys.set(item.hash, existingKey)
      }
      return
    }

    const key = item.hash ?? image

    merged.set(key, {
      ...item,
      image,
      category,
      title: category === 'Moments' ? 'memories last forever' : item.title,
      mediaType,
    })
    imageKeys.set(image, key)
    if (item.hash) {
      hashKeys.set(item.hash, key)
    }
  }

  baseItems.forEach(addItem)
  storedItems.forEach(addItem)

  return sortGalleryItemsNewestFirst(Array.from(merged.values()))
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

  const selectedItem = selectedImage !== null ? filteredItems[selectedImage] : null
  const selectedMediaType = selectedItem ? selectedItem.mediaType ?? getMediaTypeFromPath(selectedItem.image) : 'image'

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
                <p className="text-xl font-semibold mb-2">No media yet</p>
                <p className="text-[color:var(--muted)]">
                  {activeFolder
                    ? `Add media to public/gallery/${activeFolder} and it will appear here.`
                    : 'Add media in gallery categories and it will appear here.'}
                </p>
              </motion.div>
            ) : (
              filteredItems.map((item, index) => (
                (() => {
                  const isRotated = shouldRotateImage(item.image)
                  const mediaType = item.mediaType ?? getMediaTypeFromPath(item.image)
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
                    {mediaType === 'video' ? (
                      <>
                        <video
                          src={toImageSrc(item.image)}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          muted
                          playsInline
                          preload="metadata"
                        />
                        <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm">
                          <PlayCircle size={18} />
                        </div>
                      </>
                    ) : mediaType === 'pdf' ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-white/75 p-6 text-[color:var(--ink)]">
                        <FileText size={44} />
                        <p className="text-center text-sm font-semibold break-words">{item.title}</p>
                      </div>
                    ) : (
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
                    )}
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
          {selectedItem && (
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
                  {selectedMediaType === 'video' ? (
                    <video
                      src={toImageSrc(selectedItem.image)}
                      className="h-full w-full rounded-2xl object-contain"
                      controls
                      autoPlay
                      playsInline
                    />
                  ) : selectedMediaType === 'pdf' ? (
                    <iframe
                      src={toImageSrc(selectedItem.image)}
                      title={selectedItem.title}
                      className="h-full w-full rounded-2xl bg-white"
                    />
                  ) : (
                    <img
                      src={toImageSrc(selectedItem.image)}
                      alt={selectedItem.title}
                      className={shouldRotateImage(selectedItem.image)
                        ? 'h-full w-full object-contain -rotate-90 scale-[0.9] rounded-2xl'
                        : 'h-full w-full object-contain rounded-2xl'}
                      onError={(event) => {
                        event.currentTarget.style.display = 'none'
                      }}
                    />
                  )}

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
                  {selectedItem.title}
                </p>
                <p className="text-gray-400 text-center mt-2">
                  {resolveCategory(selectedItem, selectedItem.image)}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
