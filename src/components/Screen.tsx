import type { CSSProperties, ReactNode } from 'react'
import { ink, safeBottom } from '../styles/tokens'

/**
 * A screen is a full-height column: a header that stays put, a body that
 * scrolls, and an optional action bar pinned under it.
 *
 * The prototype floated its action bars over the content with `position:
 * absolute`, which left them hidden behind the tab bar. Laying the screen out
 * as a flex column puts every bar where the design intends without any
 * overlap or z-index bookkeeping.
 */
export function Screen({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  // flex:1 rather than height:100% — the screen is a flex child of the phone
  // frame, alongside the tab bar, and must take whatever room is left.
  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', ...style }}>
      {children}
    </div>
  )
}

/** The fixed strip at the top of a screen. */
export function ScreenHeader({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ flex: 'none', ...style }}>{children}</div>
}

/** The scrolling middle of a screen. */
export function ScreenBody({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto', ...style }}>
      {children}
    </div>
  )
}

/** The bar of primary actions under the body: "В корзину", "Отправить заявку". */
export function ActionBar({
  children,
  dark = false,
  safeArea = false,
  style,
}: {
  children: ReactNode
  dark?: boolean
  /** Set on screens with no tab bar below, so the bar clears the home indicator. */
  safeArea?: boolean
  style?: CSSProperties
}) {
  return (
    <div
      style={{
        flex: 'none',
        padding: `12px 18px ${safeArea ? safeBottom(12) : '12px'}`,
        background: dark ? 'rgba(20,18,12,.97)' : 'rgba(247,243,230,.97)',
        borderTop: `1px solid ${dark ? 'rgba(247,243,230,.12)' : ink(0.12)}`,
        display: 'flex',
        gap: 10,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
