import type { Lang } from '../types'

/**
 * English for the strings a non-Russian-speaking customer needs.
 *
 * The prototype translated only the navigation and screen titles; anything
 * without an entry falls back to Russian, which is the intended behaviour —
 * the shop is Russian-speaking and EN is a courtesy layer.
 */
const EN: Record<string, string> = {
  // Navigation and titles
  'Каталог': 'Shop',
  'Пошив': 'Tailoring',
  'Заказы': 'Orders',
  'Профиль': 'Profile',
  'Готовые размеры': 'Available now',
  'Мерки с одежды': 'Measurements',
  'Мои заказы': 'My orders',
  'О мастере': 'The tailor',
  'Индивидуальный пошив': 'Custom tailoring',
  'Примерка': 'Fitting',
  'Ткани': 'Fabrics',
  'Мои работы': 'My work',
  'Корзина': 'Cart',
  'Кабинет швеи': "Tailor's desk",
  'Портфолио →': 'Portfolio →',

  // Catalog
  'Камис, штаны, размер': 'Kameez, trousers, size',
  'Мерки снимаем с вашей одежды': 'We measure your own garment',
  'Все': 'All',
  'Классика': 'Classic',
  'С узлами': 'Knotted',
  'Штаны': 'Trousers',
  'только на пошив': 'made to order',

  // Product
  'оплата при получении': 'pay on delivery',
  'Ткань': 'Fabric',
  'Выберите размер': 'Choose a size',
  'Нет в наличии': 'Out of stock',
  'Сшить на заказ': 'Order made to measure',

  // Measurements
  'Форма': 'Cut',
  'Мерки с одежды, см': 'Garment measurements, cm',
  'Комментарий': 'Notes',
  'Отправить заявку': 'Send request',
  'Фото вещи и референс': 'Photo of your garment and a reference',

  // Cart and orders
  'Получение': 'Delivery',
  'Оформить заказ': 'Place order',
  'К оплате при получении': 'Due on delivery',
  'Завершённые': 'Completed',
  'Свободное время': 'Available times',
  'Отзывы': 'Reviews',
}

/**
 * Where the same Russian wording needs different English depending on where it
 * appears. "Мерки с одежды" is a screen title ("Measurements") but also the
 * label on the button that opens it ("Send measurements").
 */
const EN_VARIANTS: Record<string, Record<string, string>> = {
  cta: { 'Мерки с одежды': 'Send measurements' },
}

export function translate(ru: string, lang: Lang, variant?: string): string {
  if (lang !== 'EN') return ru
  if (variant) {
    const specific = EN_VARIANTS[variant]?.[ru]
    if (specific) return specific
  }
  return EN[ru] ?? ru
}
