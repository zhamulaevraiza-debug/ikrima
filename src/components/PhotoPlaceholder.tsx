import type { CSSProperties, ReactNode } from 'react'
import { PLACEHOLDER, hatch, ink } from '../styles/tokens'

/**
 * Stands in for photography that has not been shot yet.
 *
 * Every product, portfolio piece and cart line in the design uses the same
 * hatched card with a caption, so that a real photo can drop straight in.
 */
export function PhotoPlaceholder({
  caption,
  style,
  captionStyle,
  radius = 12,
  step = 6,
  alpha = 0.045,
}: {
  caption?: ReactNode
  style?: CSSProperties
  captionStyle?: CSSProperties
  radius?: number
  step?: number
  alpha?: number
}) {
  return (
    <div
      style={{
        borderRadius: radius,
        border: `1px solid ${ink(0.18)}`,
        background: `${hatch(alpha, step)}, ${PLACEHOLDER}`,
        display: 'flex',
        alignItems: 'flex-end',
        padding: 8,
        fontSize: 9,
        color: ink(0.6),
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {caption ? <span style={captionStyle}>{caption}</span> : null}
    </div>
  )
}
