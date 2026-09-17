import { useNavigate } from 'react-router-dom'
import type { CSSProperties, ReactNode } from 'react'
import { FONT_DISPLAY, ink, YEL } from '../styles/tokens'
import { ChevronLeft } from './icons'
import { Tap } from './Tap'

/**
 * The round back button and title that opens most inner screens.
 * `to` sets where back goes; without it the browser history is used.
 */
export function BackBar({
  title,
  to,
  dark = false,
  trailing,
  style,
}: {
  title: ReactNode
  to?: string
  dark?: boolean
  trailing?: ReactNode
  style?: CSSProperties
}) {
  const navigate = useNavigate()
  const border = dark ? 'rgba(231,220,82,.45)' : ink(0.3)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, ...style }}>
      <Tap
        aria-label="Назад"
        onClick={() => (to ? navigate(to) : navigate(-1))}
        style={{
          width: 34,
          height: 34,
          flex: 'none',
          borderRadius: '50%',
          border: `1.2px solid ${border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: dark ? YEL : undefined,
        }}
      >
        <ChevronLeft size={14} />
      </Tap>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, color: dark ? YEL : undefined }}>
        {title}
      </div>
      {trailing}
    </div>
  )
}
