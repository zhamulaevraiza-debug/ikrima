/** Domain model for Ikrima. Mirrors the data in the approved prototype. */

/** The five stages a made-to-measure order moves through. */
export const TAILORING_STAGES = ['мерки', 'раскрой', 'пошив', 'примерка', 'выдача'] as const
export type TailoringStage = (typeof TAILORING_STAGES)[number]

/**
 * Ready-made items skip the workshop stages. The prototype only drew the
 * tailoring stepper, but the stepper is data-driven, so shop orders reuse it
 * with their own (shorter) set of steps.
 */
export const SHOP_STAGES = ['заказ принят', 'сборка', 'отправка', 'получен'] as const
export type ShopStage = (typeof SHOP_STAGES)[number]

export type OrderKind = 'tailoring' | 'shop'

export type FabricStatus = 'в наличии' | 'под заказ'

export interface Fabric {
  id: string
  /** Short name for swatches under a product. */
  name: string
  /** Full name with colour, used in the fabric list. */
  full: string
  color: string
  spec: string
  status: FabricStatus
}

/** Catalog categories, matching the filter chips. */
export type Category = 'Классика' | 'С узлами' | 'Штаны'

export interface Product {
  id: string
  name: string
  form: string
  cat: Category
  /** Price of a ready-made piece from stock. */
  price: number
  /** Price when sewn to measure. 0 means the item is stock-only. */
  sew: number
  /** Caption for the photo placeholder until real photography exists. */
  ph: string
  fabric: string
}

/** The six measurements, all taken from a garment the customer already owns. */
export const MEASURE_KEYS = ['len', 'shoulder', 'chest', 'sleeve', 'cuff', 'hem'] as const
export type MeasureKey = (typeof MEASURE_KEYS)[number]

export interface MeasureField {
  key: MeasureKey
  label: string
  hint: string
}

export type Measurements = Record<MeasureKey, string>

/** Which sizes of which model the tailor currently has made up. */
export type Stock = Record<string, Record<string, boolean>>

/** Which of the two photo slots on the request form a picture came from. */
export type PhotoSlot = 'garment' | 'reference'

/** A photo the customer attached, already downscaled for storage. */
export interface Photo {
  id: string
  /**
   * Kept with the photo so the tailor's cabinet shows each picture under the
   * right caption even when only one of the two was attached.
   */
  slot: PhotoSlot
  name: string
  /** Downscaled JPEG data URL. */
  dataUrl: string
}

export interface Order {
  id: number
  kind: OrderKind
  client: string
  model: string
  fabric: string
  /** Index into TAILORING_STAGES or SHOP_STAGES depending on `kind`. */
  stage: number
  /** True when this order belongs to the customer using the app. */
  mine: boolean
  /** Free-text line under the title, e.g. "мерки приняты · готово до 28 сентября". */
  meta?: string
  comment: string
  /** Measurements captured with the request, when it is a tailoring order. */
  measurements?: Measurements
  photos?: Photo[]
  /** Fitting appointment booked for this order, e.g. "вт 23 · 11:00". */
  fittingSlot?: string
  /** Total to pay on delivery, in roubles. */
  total?: number
}

export interface PastOrder {
  id: number
  model: string
  date: string
}

export interface CartItem {
  /** Stable id so the same model in two sizes stays two lines. */
  lineId: string
  productId: string
  name: string
  meta: string
  price: number
}

export type DeliveryKey = 'Самовывоз' | 'СДЭК'

export interface DeliveryOption {
  key: DeliveryKey
  label: string
  note: string
  price: string
  cost: number
}

export type Lang = 'RU' | 'EN'

/**
 * How prices are shown. The prototype exposed this as a design-time prop;
 * here it is a setting the tailor can change from her cabinet.
 */
export type PriceMode = 'точные' | 'от' | 'скрыть'

export interface PortfolioItem {
  id: string
  ph: string
  label: string
}

export interface Review {
  id: string
  text: string
}

/** Everything the app persists between visits. */
export interface IkrimaData {
  products: Product[]
  fabrics: Fabric[]
  stock: Stock
  orders: Order[]
  past: PastOrder[]
  portfolio: PortfolioItem[]
  reviews: Review[]
  /** Fitting slots the tailor has open, and whether each is taken. */
  slots: { label: string; taken: boolean }[]
  settings: { lang: Lang; priceMode: PriceMode }
  /** Next order number to hand out. */
  nextOrderId: number
}
