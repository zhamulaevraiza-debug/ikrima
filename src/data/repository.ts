import type { IkrimaData, Order, Stock } from '../types'

/**
 * Everything the app needs from storage.
 *
 * The operations are deliberately granular rather than "save the whole
 * document", so each one maps to a single request once the app moves to a
 * server with a database. Swapping `LocalRepository` for `HttpRepository`
 * requires no change to any screen.
 */
export interface IkrimaRepository {
  /** Read the full dataset. Called once on start-up. */
  load(): Promise<IkrimaData>
  /** The tailor marked a size as made up, or sold out. */
  setStock(model: string, size: string, available: boolean): Promise<void>
  /** A new tailoring request or shop order. */
  createOrder(order: Order): Promise<void>
  /** Move an order along, attach a fitting, edit a comment. */
  updateOrder(id: number, patch: Partial<Order>): Promise<void>
  /** Reserve a fitting slot, optionally against an order. */
  bookSlot(label: string, orderId?: number): Promise<void>
  saveSettings(settings: IkrimaData['settings']): Promise<void>
  /** Throw away local changes and start from the seed data again. */
  reset(): Promise<void>
}

export const STORAGE_KEY = 'ikrima.data.v1'

/**
 * Stores everything in this browser.
 *
 * Good enough to run the shop from one phone and to publish a working demo on
 * GitHub Pages: nothing leaves the device, and the data survives reloads. It
 * is per-device by definition — two customers do not see the same catalog —
 * which is why `HttpRepository` exists for the server stage.
 */
export class LocalRepository implements IkrimaRepository {
  constructor(private readonly seed: () => IkrimaData) {}

  async load(): Promise<IkrimaData> {
    const stored = readStorage()
    if (!stored) {
      const fresh = this.seed()
      writeStorage(fresh)
      return fresh
    }
    // Merge over the seed so a release that adds a field does not break
    // a device that stored the previous shape.
    return { ...this.seed(), ...stored, settings: { ...this.seed().settings, ...stored.settings } }
  }

  async setStock(model: string, size: string, available: boolean): Promise<void> {
    this.mutate((data) => {
      const stock: Stock = { ...data.stock, [model]: { ...data.stock[model], [size]: available } }
      return { ...data, stock }
    })
  }

  async createOrder(order: Order): Promise<void> {
    this.mutate((data) => ({
      ...data,
      orders: [order, ...data.orders],
      nextOrderId: Math.max(data.nextOrderId, order.id + 1),
    }))
  }

  async updateOrder(id: number, patch: Partial<Order>): Promise<void> {
    this.mutate((data) => ({
      ...data,
      orders: data.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    }))
  }

  async bookSlot(label: string, orderId?: number): Promise<void> {
    this.mutate((data) => ({
      ...data,
      slots: data.slots.map((s) => (s.label === label ? { ...s, taken: true } : s)),
      orders: orderId
        ? data.orders.map((o) => (o.id === orderId ? { ...o, fittingSlot: label } : o))
        : data.orders,
    }))
  }

  async saveSettings(settings: IkrimaData['settings']): Promise<void> {
    this.mutate((data) => ({ ...data, settings }))
  }

  async reset(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* storage unavailable — nothing to clear */
    }
  }

  /** Read-modify-write, so two tabs cannot clobber each other's whole document. */
  private mutate(fn: (data: IkrimaData) => IkrimaData): void {
    const current = readStorage() ?? this.seed()
    writeStorage(fn({ ...this.seed(), ...current }))
  }
}

function readStorage(): IkrimaData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as IkrimaData) : null
  } catch {
    // Private mode, blocked cookies or corrupt JSON: fall back to the seed.
    return null
  }
}

function writeStorage(data: IkrimaData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Quota exceeded (usually attached photos) or storage blocked. The app
    // keeps working from memory for this session.
    console.warn('[ikrima] не удалось сохранить данные в этом браузере')
  }
}
