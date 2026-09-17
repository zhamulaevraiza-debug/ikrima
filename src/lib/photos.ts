import type { Photo, PhotoSlot } from '../types'
import { uid } from './id'

/** Longest side of a stored preview, in pixels. */
const MAX_SIDE = 720
const JPEG_QUALITY = 0.72

/**
 * Turns a picked file into a small JPEG preview.
 *
 * Phone cameras produce 3–8 MB images and browser storage holds about 5 MB in
 * total, so the original is never kept: the customer's photo is only a visual
 * reference for the tailor. Once the backend exists, upload the original file
 * and keep this preview for the offline view.
 */
export async function toPreview(file: File, slot: PhotoSlot): Promise<Photo> {
  const bitmap = await loadImage(file)
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas 2d context unavailable')
  ctx.drawImage(bitmap, 0, 0, width, height)
  if ('close' in bitmap) bitmap.close()

  return { id: uid('ph'), slot, name: file.name, dataUrl: canvas.toDataURL('image/jpeg', JPEG_QUALITY) }
}

async function loadImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file)
    } catch {
      // Safari refuses some HEIC/large files here; fall through to <img>.
    }
  }
  const url = URL.createObjectURL(file)
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('не удалось прочитать изображение'))
      img.src = url
    })
  } finally {
    URL.revokeObjectURL(url)
  }
}
