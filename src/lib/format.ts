import type { PriceMode } from '../types'

/** "5 900 ₽" — a plain rouble amount. */
export function fmt(n: number): string {
  return n.toLocaleString('ru-RU') + ' ₽'
}

/**
 * A price as the tailor chose to show it.
 *
 * "скрыть" is for periods when fabric costs move too fast to publish a number;
 * "от" marks the starting price of a made-to-measure piece.
 */
export function price(n: number, mode: PriceMode): string {
  if (mode === 'скрыть') return 'цена по запросу'
  if (mode === 'от') return 'от ' + fmt(n)
  return fmt(n)
}

/** "заполнено 4 из 6" */
export function filledOf(filled: number, total: number): string {
  return `заполнено ${filled} из ${total}`
}
