import { FONT_DISPLAY, ink } from '../styles/tokens'
import { NeedleAndThread } from './icons'

/** Wordmark with the needle-and-thread mark, as on the label. */
export function Logo({ tagline, size = 25 }: { tagline: string; size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <NeedleAndThread size={34} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: size, lineHeight: 1, letterSpacing: '.5px' }}>
          Ikrima
        </div>
        <div
          style={{
            fontSize: 9.5,
            letterSpacing: '1.6px',
            textTransform: 'uppercase',
            color: ink(0.62),
            fontWeight: 600,
          }}
        >
          {tagline}
        </div>
      </div>
    </div>
  )
}
