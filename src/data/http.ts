import type { IkrimaData, Order } from '../types'
import { initialData } from './seed'
import type { IkrimaRepository } from './repository'

/**
 * Talks to a real backend. Switched on by setting `VITE_API_URL`.
 *
 * The endpoints it expects — implement these when the server goes up:
 *
 *   GET    /data                        → IkrimaData
 *   PUT    /stock                       ← { model, size, available }
 *   POST   /orders                      ← Order
 *   PATCH  /orders/:id                  ← Partial<Order>
 *   POST   /slots/book                  ← { label, orderId? }
 *   PUT    /settings                    ← IkrimaData['settings']
 *
 * Until then the app runs on `LocalRepository` and nothing here is called.
 */
export class HttpRepository implements IkrimaRepository {
  constructor(private readonly baseUrl: string) {}

  async load(): Promise<IkrimaData> {
    const payload = await this.request<Partial<IkrimaData>>('GET', '/data')
    // Layered over the defaults, the same way LocalRepository does it, so a
    // server that has not caught up with a new field cannot leave a screen
    // reading an undefined collection.
    const base = initialData()
    return { ...base, ...payload, settings: { ...base.settings, ...payload.settings } }
  }

  async setStock(model: string, size: string, available: boolean): Promise<void> {
    await this.request('PUT', '/stock', { model, size, available })
  }

  async createOrder(order: Order): Promise<void> {
    await this.request('POST', '/orders', order)
  }

  async updateOrder(id: number, patch: Partial<Order>): Promise<void> {
    await this.request('PATCH', `/orders/${id}`, patch)
  }

  async bookSlot(label: string, orderId?: number): Promise<void> {
    await this.request('POST', '/slots/book', { label, orderId })
  }

  async saveSettings(settings: IkrimaData['settings']): Promise<void> {
    await this.request('PUT', '/settings', settings)
  }

  async reset(): Promise<void> {
    // Resetting is a local-only convenience; the server keeps real orders.
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(this.baseUrl.replace(/\/$/, '') + path, {
      method,
      headers: body ? { 'content-type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    })
    if (!res.ok) throw new Error(`${method} ${path} → ${res.status}`)
    return res.status === 204 ? (undefined as T) : ((await res.json()) as T)
  }
}
