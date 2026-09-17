import type { CartItem, DeliveryKey, Measurements, Photo } from '../types'
import { EMPTY_MEASUREMENTS } from '../data/seed'

/** The part of the state that belongs to this visitor, not to the shop. */
export interface SessionState {
  cart: CartItem[]
  delivery: DeliveryKey
  /** Draft of the tailoring request, kept while the customer fills it in. */
  draft: {
    form: string
    measurements: Measurements
    comment: string
    fabricId: string
    garment: Photo | null
    reference: Photo | null
  }
  ui: {
    filter: string
    search: string
    productId: string
    size: string | null
    slot: string | null
    cabId: number
  }
}

export const SESSION_KEY = 'ikrima.session.v1'

export function initialSession(): SessionState {
  return {
    cart: [],
    delivery: 'Самовывоз',
    draft: {
      form: 'Классическая',
      measurements: { ...EMPTY_MEASUREMENTS },
      comment: '',
      fabricId: 'gab-b',
      garment: null,
      reference: null,
    },
    ui: { filter: 'Все', search: '', productId: 'k1', size: null, slot: null, cabId: 142 },
  }
}

export function readSession(): SessionState {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return initialSession()
    const stored = JSON.parse(raw) as Partial<SessionState>
    const base = initialSession()
    return {
      ...base,
      ...stored,
      draft: {
        ...base.draft,
        ...stored.draft,
        // Merged key by key: a session stored by an older build may be missing
        // one, and a missing value would turn that input into an uncontrolled
        // field that silently drops what the customer types.
        measurements: { ...base.draft.measurements, ...stored.draft?.measurements },
      },
      ui: { ...base.ui, ...stored.ui },
    }
  } catch {
    return initialSession()
  }
}

export function writeSession(session: SessionState): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    // Attached photos can overflow the quota. Retry without them rather than
    // losing the cart, which is the part the customer would actually miss.
    try {
      const lean: SessionState = {
        ...session,
        draft: { ...session.draft, garment: null, reference: null },
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify(lean))
    } catch {
      /* storage unavailable — the session stays in memory only */
    }
  }
}
