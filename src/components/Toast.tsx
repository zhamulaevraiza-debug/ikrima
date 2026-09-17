import { INK, PAPER } from '../styles/tokens'
import { useApp } from '../store/AppContext'

/** The short confirmation that slides up over the content. */
export function Toast() {
  const { toast } = useApp()
  if (!toast) return null

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'absolute',
        left: 18,
        right: 18,
        bottom: 96,
        padding: '13px 16px',
        borderRadius: 11,
        background: INK,
        color: PAPER,
        fontSize: 12.5,
        fontWeight: 600,
        zIndex: 60,
        boxShadow: '0 12px 28px rgba(0,0,0,.28)',
        animation: 'ikrima-toast-in .18s ease-out',
      }}
    >
      {toast}
    </div>
  )
}
