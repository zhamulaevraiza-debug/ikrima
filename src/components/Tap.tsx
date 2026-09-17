import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'

interface TapProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  style?: CSSProperties
  children?: ReactNode
}

/**
 * A tappable area that looks exactly like the plain <div> in the design but
 * behaves like a button — focusable, operable with Enter and Space, announced
 * to screen readers. Every `onClick` in the prototype becomes one of these.
 */
export function Tap({ style, children, ...rest }: TapProps) {
  return (
    <button type="button" className="tap" style={style} {...rest}>
      {children}
    </button>
  )
}
