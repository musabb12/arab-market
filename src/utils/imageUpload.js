import { getStoredToken } from '../api/client.js'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

/** Compress an image file to a JPEG data URL for upload or offline fallback. */
export function fileToCompressedDataUrl(file, { maxWidth = 1600, quality = 0.84 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type?.startsWith('image/')) {
      reject(new Error('Invalid image file'))
      return
    }
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxWidth / img.width)
      const w = Math.max(1, Math.round(img.width * scale))
      const h = Math.max(1, Math.round(img.height * scale))
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, w, h)
      ctx.drawImage(img, 0, 0, w, h)
      try {
        resolve(canvas.toDataURL('image/jpeg', quality))
      } catch (err) {
        reject(err)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to read image'))
    }
    img.src = url
  })
}

/** Upload image to API; falls back to compressed data URL when offline. */
export async function uploadImageFile(file, options) {
  const dataUrl = await fileToCompressedDataUrl(file, options)
  try {
    const headers = { 'Content-Type': 'application/json' }
    const token = getStoredToken()
    if (token) headers.Authorization = `Bearer ${token}`
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ dataUrl, name: file.name || 'image.jpg' })
    })
    if (res.ok) {
      const data = await res.json()
      if (data?.url) return data.url
    }
  } catch {
    /* offline / API down — keep local data URL */
  }
  return dataUrl
}

export async function uploadImageFiles(files, options) {
  const list = Array.from(files || [])
  const urls = []
  for (const file of list) {
    urls.push(await uploadImageFile(file, options))
  }
  return urls
}
