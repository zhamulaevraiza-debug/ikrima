import { useId, useState } from 'react'
import type { Photo, PhotoSlot } from '../types'
import { hatch, ink } from '../styles/tokens'
import { toPreview } from '../lib/photos'
import { useApp } from '../store/AppContext'

/**
 * A dashed slot that takes a photo from the camera or gallery.
 *
 * The picked file is downscaled before it is stored, so the tailor sees the
 * customer's garment in her cabinet without filling up the browser's storage.
 */
export function PhotoPicker({
  label,
  slot,
  photo,
  onChange,
}: {
  label: string
  slot: PhotoSlot
  photo: Photo | null
  onChange: (photo: Photo | null) => void
}) {
  const inputId = useId()
  const [busy, setBusy] = useState(false)
  const { showToast } = useApp()

  async function pick(file: File | undefined) {
    if (!file) return
    setBusy(true)
    try {
      onChange(await toPreview(file, slot))
    } catch {
      showToast('Не удалось открыть это фото')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={(e) => {
          void pick(e.target.files?.[0])
          e.target.value = ''
        }}
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
      <label
        htmlFor={inputId}
        style={{
          display: 'flex',
          height: 104,
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 6,
          boxSizing: 'border-box',
          border: `1.3px dashed ${ink(0.4)}`,
          borderRadius: 10,
          background: photo ? `center / cover no-repeat url(${photo.dataUrl})` : hatch(0.05),
          fontSize: 10.5,
          color: ink(0.62),
          cursor: 'pointer',
          overflow: 'hidden',
        }}
      >
        {photo ? '' : busy ? 'загружаем…' : label}
      </label>
      {photo ? (
        <button
          type="button"
          className="tap"
          onClick={() => onChange(null)}
          aria-label={`Убрать: ${label}`}
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: 'rgba(20,18,12,.72)',
            color: '#F7F3E6',
            fontSize: 14,
            lineHeight: '24px',
            textAlign: 'center',
          }}
        >
          ×
        </button>
      ) : null}
    </div>
  )
}
