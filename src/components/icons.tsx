/** Icons traced from the prototype. `currentColor` unless a colour is given. */

export function NeedleAndThread({ size = 34, stroke = '#14120C' }: { size?: number; stroke?: string }) {
  return (
    <svg
      width={size}
      height={(size / 34) * 26}
      viewBox="0 0 34 26"
      fill="none"
      stroke={stroke}
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M17 2.4c2.4-.6 3.6.6 3.4 2.2-.2 1.4-1.6 1.9-3.4 2.9" />
      <path d="M17 7.5c-5 1.6-10 4.4-14.5 8.6-1.4 1.3-1 2.4 1 2.6 3.6.3 6.4 1.9 8.3 4.6" />
      <path d="M17 7.5c5 1.6 10 4.4 14.5 8.6 1.4 1.3 1 2.4-1 2.6-3.6.3-6.4 1.9-8.3 4.6" />
      <path d="M14.4 9.1 17 13.6l2.6-4.5" />
      <path d="M17 13.6v8.4" />
    </svg>
  )
}

export function SearchIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="6.4" cy="6.4" r="4.6" />
      <path d="m10 10 3.4 3.4" strokeLinecap="round" />
    </svg>
  )
}

export function ChevronLeft({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M9 3 4.5 7.5 9 12" />
    </svg>
  )
}

export function ArrowRight({ size = 20, stroke = 'currentColor' }: { size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <path d="M5 13h15M14 7l6 6-6 6" />
    </svg>
  )
}

export function CheckMark({ size = 26, stroke = '#E7DC52' }: { size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="m6 13.5 4.5 4.5L20 8" />
    </svg>
  )
}

export function GridIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="2.5" y="2.5" width="6" height="6" rx="1.2" />
      <rect x="11.5" y="2.5" width="6" height="6" rx="1.2" />
      <rect x="2.5" y="11.5" width="6" height="6" rx="1.2" />
      <rect x="11.5" y="11.5" width="6" height="6" rx="1.2" />
    </svg>
  )
}

export function RulerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3 6.5h14v7H3z" />
      <path d="M6.5 6.5v2.5M10 6.5v3.5M13.5 6.5v2.5" strokeLinecap="round" />
    </svg>
  )
}

export function TagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4.5 2.8h11v14.4l-2.7-1.7-2.8 1.7-2.8-1.7-2.7 1.7z" />
      <path d="M7.5 7h5M7.5 10.5h5" strokeLinecap="round" />
    </svg>
  )
}

export function PersonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="10" cy="7" r="3.2" />
      <path d="M4 17c1-3 3.2-4.4 6-4.4S15 14 16 17" strokeLinecap="round" />
    </svg>
  )
}
