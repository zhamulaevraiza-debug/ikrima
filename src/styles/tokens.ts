/**
 * Design tokens taken verbatim from the Ikrima prototype
 * (design/Ikrima - прототип.dc.html).
 *
 * The prototype styles every element inline with literal hex/px values, and the
 * screens here mirror that so the build stays pixel-faithful to the approved
 * design. These constants are the single source of truth for the values that
 * repeat across screens — change a colour here, not in twelve files.
 */

/** Near-black used for text, borders and filled buttons. */
export const INK = '#14120C'
/** Brand yellow from the label — headers, active states, the tailor's accents. */
export const YEL = '#E7DC52'
/** Warm paper background inside the app. */
export const PAPER = '#F7F3E6'
/** Slightly darker paper behind the phone frame on desktop. */
export const PAGE = '#E8E4DA'
/** Placeholder fill for photos that have not been shot yet. */
export const PLACEHOLDER = '#EFEADA'

/** Ink at partial opacity — the prototype's secondary text and hairlines. */
export const ink = (alpha: number) => `rgba(20, 18, 12, ${alpha})`
/** Paper at partial opacity — used on the dark tailor's cabinet screens. */
export const paper = (alpha: number) => `rgba(247, 243, 230, ${alpha})`
/** Yellow at partial opacity — cabinet highlights. */
export const yel = (alpha: number) => `rgba(231, 220, 82, ${alpha})`

/** Warning/attention amber: "made to order", "under order". */
export const AMBER = '#8A7413'
/** Positive green: fabric in stock. */
export const GREEN = '#3F6B4A'

export const FONT_DISPLAY = 'Prata, Georgia, "Times New Roman", serif'
export const FONT_BODY = 'Manrope, system-ui, -apple-system, "Segoe UI", sans-serif'
export const FONT_MONO = 'ui-monospace, Menlo, Consolas, monospace'

/**
 * Safe-area aware spacing.
 *
 * The prototype was drawn inside a mock iOS bezel, so its screens reserved
 * ~58px at the top for the status bar and ~26px at the bottom for the home
 * indicator. A real browser draws those itself, so we reserve the device's own
 * safe area plus the design's visual padding instead of the hard-coded numbers.
 */
export const safeTop = (extra: number) =>
  `calc(env(safe-area-inset-top, 0px) + ${extra}px)`
export const safeBottom = (extra: number) =>
  `calc(env(safe-area-inset-bottom, 0px) + ${extra}px)`

/** Diagonal hatch the prototype uses wherever a photo will go. */
export const hatch = (alpha = 0.05, step = 6) =>
  `repeating-linear-gradient(45deg, rgba(20,18,12,${alpha}) 0 ${step}px, transparent ${step}px ${step * 2}px)`

/** The sun-flare wash on the yellow headers. */
export const YELLOW_WASH =
  'radial-gradient(60px 40px at 78% 24%, rgba(160,132,30,.28), transparent 70%), radial-gradient(90px 60px at 18% 84%, rgba(160,132,30,.2), transparent 70%)'
export const YELLOW_WASH_SM =
  'radial-gradient(90px 60px at 80% 18%, rgba(160,132,30,.26), transparent 70%)'
export const YELLOW_WASH_XS =
  'radial-gradient(80px 50px at 82% 22%, rgba(160,132,30,.24), transparent 70%)'
