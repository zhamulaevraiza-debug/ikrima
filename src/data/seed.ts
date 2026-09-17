import type {
  DeliveryOption,
  Fabric,
  IkrimaData,
  MeasureField,
  Measurements,
  Product,
} from '../types'

/** Workshop contact details, shown on the fitting and profile screens. */
export const WORKSHOP = {
  town: 'с. Шатой',
  place: 'с. Шатой · мастерская',
  phone: '+7 938 018-25-43',
  /** Digits only, for tel: and wa.me links. */
  phoneDigits: '79380182543',
} as const

export const FABRICS: Fabric[] = [
  { id: 'gab-b', name: 'габардин', full: 'Габардин чёрный', color: '#1B1B1B', spec: 'плотный, держит форму', status: 'в наличии' },
  { id: 'pop-w', name: 'поплин', full: 'Поплин белый', color: '#F2EEE2', spec: 'лёгкий, на лето', status: 'в наличии' },
  { id: 'len-s', name: 'лён', full: 'Лён песочный', color: '#C9B98F', spec: 'дышит, мягкие складки', status: 'в наличии' },
  { id: 'twl-k', name: 'твил', full: 'Твил хаки', color: '#4A5A50', spec: 'матовый, для формы с узлами', status: 'под заказ' },
]

export const PRODUCTS: Product[] = [
  { id: 'k1', name: 'Камис классический', form: 'классическая форма', cat: 'Классика', price: 5900, sew: 7200, ph: 'фото · классическая форма', fabric: 'габардин' },
  { id: 'k2', name: 'Камис с узлами', form: 'форма с узлами', cat: 'С узлами', price: 7400, sew: 8500, ph: 'фото · с узлами', fabric: 'габардин' },
  { id: 'p1', name: 'Штаны', form: 'классическая форма', cat: 'Штаны', price: 2300, sew: 3100, ph: 'фото · штаны', fabric: 'хлопок' },
  { id: 'j1', name: 'Джалабия с узлами', form: 'форма с узлами', cat: 'С узлами', price: 8200, sew: 9400, ph: 'фото · джалабия', fabric: 'лён' },
  { id: 'k3', name: 'Камис детский', form: 'классическая форма', cat: 'Классика', price: 3400, sew: 4200, ph: 'фото · детский', fabric: 'поплин' },
  { id: 't1', name: 'Такия', form: 'аксессуар', cat: 'Классика', price: 900, sew: 0, ph: 'фото · такия', fabric: 'шерсть' },
]

export const MEASURE_FIELDS: MeasureField[] = [
  { key: 'len', label: 'Длина изделия', hint: 'от плеча до низа по спине' },
  { key: 'shoulder', label: 'Ширина плеч', hint: 'от шва до шва' },
  { key: 'chest', label: 'Ширина в груди', hint: 'по вещи, от края до края' },
  { key: 'sleeve', label: 'Длина рукава', hint: 'от плечевого шва до края' },
  { key: 'cuff', label: 'Ширина рукава внизу', hint: 'по краю манжеты' },
  { key: 'hem', label: 'Ширина по низу', hint: 'от края до края' },
]

/** Shown in the cabinet for orders placed before the app existed. */
export const FALLBACK_MEASURES: Record<string, number> = {
  len: 142, shoulder: 49, chest: 58, sleeve: 61, cuff: 15, hem: 120,
}

export const EMPTY_MEASUREMENTS: Measurements = {
  len: '', shoulder: '', chest: '', sleeve: '', cuff: '', hem: '',
}

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  { key: 'Самовывоз', label: 'Самовывоз, с. Шатой', note: 'можно сразу примерить', price: 'бесплатно', cost: 0 },
  { key: 'СДЭК', label: 'СДЭК по России', note: '3–6 дней, оплата при получении', price: '350 ₽', cost: 350 },
]

export const CATALOG_FILTERS = ['Все', 'Классика', 'С узлами', 'Штаны', 'Ткани'] as const

export const GARMENT_FORMS = ['Классическая', 'С узлами'] as const

/** The state the app starts from on a device that has never opened it. */
export function initialData(): IkrimaData {
  return {
    products: PRODUCTS,
    fabrics: FABRICS,
    stock: {
      'Камис классический': { M: true, L: true, XL: false },
      Штаны: { S: true, M: true, L: true },
      'Камис детский': { '6 лет': true, '8 лет': false },
      Такия: { 'один размер': true },
    },
    orders: [
      { id: 142, kind: 'tailoring', client: 'Ахмед М.', model: 'Камис с узлами', fabric: 'габардин чёрный', stage: 1, mine: true, meta: 'мерки приняты · готово до 28 сентября', comment: 'рукав как на фото, воротник пониже' },
      { id: 143, kind: 'tailoring', client: 'Иса Т.', model: 'Штаны', fabric: 'хлопок', stage: 2, mine: false, comment: 'длина на 2 см короче' },
      { id: 141, kind: 'tailoring', client: 'Рустам А.', model: 'Камис классический', fabric: 'поплин белый', stage: 3, mine: false, comment: '—' },
    ],
    past: [
      { id: 138, model: 'Камис классический', date: 'август' },
      { id: 131, model: 'Штаны', date: 'июль' },
    ],
    portfolio: [
      { id: 'w1', ph: 'фото · камис', label: 'Классическая форма, габардин' },
      { id: 'w2', ph: 'фото · узлы', label: 'Форма с узлами' },
      { id: 'w3', ph: 'фото · комплект', label: 'Комплект, лён' },
      { id: 'w4', ph: 'фото · детский', label: 'Детский камис' },
      { id: 'w5', ph: 'фото · воротник', label: 'Воротник, деталь' },
      { id: 'w6', ph: 'фото · штаны', label: 'Штаны, хлопок' },
    ],
    reviews: [
      { id: 'r1', text: 'здесь будет отзыв клиента' },
      { id: 'r2', text: 'здесь будет отзыв клиента' },
      { id: 'r3', text: 'здесь будет отзыв клиента' },
    ],
    slots: [
      { label: 'пн 22 · 10:00', taken: false },
      { label: 'пн 22 · 15:00', taken: false },
      { label: 'вт 23 · 11:00', taken: false },
      { label: 'вт 23 · 17:00', taken: false },
      { label: 'чт 25 · 12:00', taken: false },
      { label: 'пт 26 · 09:30', taken: false },
    ],
    settings: { lang: 'RU', priceMode: 'точные', tailorPinHash: null },
    nextOrderId: 144,
  }
}
