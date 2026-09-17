import { initialData } from './seed'
import { HttpRepository } from './http'
import { LocalRepository, type IkrimaRepository } from './repository'

/**
 * Picks where data lives.
 *
 * No `VITE_API_URL` → everything stays in this browser, which is what the
 * GitHub Pages build uses. Set `VITE_API_URL=https://api.example.com` in
 * `.env` (or in the deploy environment) and the same screens start talking to
 * the server instead.
 */
export function createRepository(): IkrimaRepository {
  const apiUrl = import.meta.env.VITE_API_URL
  return apiUrl ? new HttpRepository(apiUrl) : new LocalRepository(initialData)
}

export type { IkrimaRepository } from './repository'
