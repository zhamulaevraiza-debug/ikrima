import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type {
  CartItem,
  DeliveryKey,
  IkrimaData,
  Lang,
  MeasureKey,
  Order,
  Photo,
  PriceMode,
  Product,
} from '../types'
import { SHOP_STAGES, TAILORING_STAGES } from '../types'
import { createRepository, type IkrimaRepository } from '../data'
import { DELIVERY_OPTIONS, MEASURE_FIELDS, initialData } from '../data/seed'
import { fmt as fmtRub, price as formatPrice } from '../lib/format'
import { uid } from '../lib/id'
import { translate } from '../i18n/strings'
import {
  initialSession,
  readSession,
  writeSession,
  type SessionState,
} from './session'

/**
 * Everything a screen needs, in one flat object.
 *
 * Screens stay declarative: they read derived values and call actions, and
 * never touch the repository or localStorage directly.
 */
export interface AppValue {
  /** False until the stored data has loaded. */
  ready: boolean
  data: IkrimaData

  // ── settings ────────────────────────────────────────────────
  lang: Lang
  priceMode: PriceMode
  /**
   * Translate a Russian UI string for the current language. `variant` picks a
   * context-specific wording, e.g. `t('Мерки с одежды', 'cta')`.
   */
  t: (ru: string, variant?: string) => string
  toggleLang: () => void
  setPriceMode: (mode: PriceMode) => void

  // ── money ───────────────────────────────────────────────────
  /** Raw amount, always with a number: "5 900 ₽". */
  fmt: (n: number) => string
  /** Amount as the tailor chose to display prices. */
  price: (n: number) => string

  // ── catalog ─────────────────────────────────────────────────
  filter: string
  setFilter: (value: string) => void
  search: string
  setSearch: (value: string) => void
  /** Products after the active chip and the search box are applied. */
  visibleProducts: Product[]
  /** Sizes of a model that are made up right now. */
  sizesOf: (model: string) => string[]

  // ── product ─────────────────────────────────────────────────
  product: Product
  selectProduct: (id: string) => void
  size: string | null
  selectSize: (size: string | null) => void
  fabricId: string
  selectFabric: (id: string) => void

  // ── cart ────────────────────────────────────────────────────
  cart: CartItem[]
  cartCount: number
  /** Goods plus delivery, in roubles. */
  cartTotal: number
  addToCart: (product: Product, size: string) => void
  removeFromCart: (lineId: string) => void
  delivery: DeliveryKey
  setDelivery: (key: DeliveryKey) => void
  /** Creates the order and empties the cart. Returns its number, or null. */
  placeOrder: () => number | null

  // ── tailoring request ───────────────────────────────────────
  form: string
  setForm: (value: string) => void
  measurements: Record<MeasureKey, string>
  setMeasurement: (key: MeasureKey, value: string) => void
  /** How many of the six measurements are filled in. */
  filledCount: number
  comment: string
  setComment: (value: string) => void
  garmentPhoto: Photo | null
  referencePhoto: Photo | null
  setPhoto: (slot: 'garment' | 'reference', photo: Photo | null) => void
  /** Validates and sends. Returns the new order number, or null. */
  sendMeasurements: () => number | null

  // ── fitting ─────────────────────────────────────────────────
  slot: string | null
  selectSlot: (label: string) => void
  /** Books the chosen slot. Returns true when it went through. */
  bookFitting: () => boolean

  // ── orders ──────────────────────────────────────────────────
  myOrders: Order[]
  /** Stage labels for an order, which differ between tailoring and shop. */
  stagesOf: (order: Order) => readonly string[]
  stageLabel: (order: Order) => string

  // ── tailor's cabinet ────────────────────────────────────────
  cabOrder: Order
  openCabOrder: (id: number) => void
  advanceOrder: (id: number) => void
  toggleStock: (model: string, size: string) => void

  // ── toast ───────────────────────────────────────────────────
  toast: string
  showToast: (text: string) => void
}

const AppContext = createContext<AppValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [repo] = useState<IkrimaRepository>(createRepository)
  const [data, setData] = useState<IkrimaData>(initialData)
  const [ready, setReady] = useState(false)
  const [session, setSession] = useState<SessionState>(initialSession)
  const [toast, setToast] = useState('')
  const toastTimer = useRef<number>()

  // Load the shop's data once, then keep it in memory.
  useEffect(() => {
    let cancelled = false
    setSession(readSession())
    repo
      .load()
      .then((loaded) => {
        if (!cancelled) setData(loaded)
      })
      .catch((err) => {
        console.warn('[ikrima] не удалось загрузить данные, работаем с исходными', err)
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [repo])

  // Persist the visitor's cart and draft as they change.
  useEffect(() => {
    if (ready) writeSession(session)
  }, [ready, session])

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const showToast = useCallback((text: string) => {
    setToast(text)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 2600)
  }, [])

  /** Applies a change locally and pushes it to storage. */
  const commit = useCallback(
    (next: (data: IkrimaData) => IkrimaData, persist: () => Promise<void>) => {
      setData(next)
      persist().catch((err) => {
        console.warn('[ikrima] изменение не сохранилось', err)
        showToast('Не удалось сохранить — проверьте связь')
      })
    },
    [showToast],
  )

  const patchSession = useCallback((patch: (s: SessionState) => SessionState) => {
    setSession(patch)
  }, [])

  const { lang, priceMode } = data.settings
  const t = useCallback((ru: string, variant?: string) => translate(ru, lang, variant), [lang])
  const price = useCallback((n: number) => formatPrice(n, priceMode), [priceMode])

  const sizesOf = useCallback(
    (model: string) => {
      const sizes = data.stock[model]
      return sizes ? Object.keys(sizes).filter((key) => sizes[key]) : []
    },
    [data.stock],
  )

  const visibleProducts = useMemo(() => {
    const { filter, search } = session.ui
    const query = search.trim().toLowerCase()
    return data.products.filter((p) => {
      if (filter !== 'Все' && p.cat !== filter) return false
      if (!query) return true
      const haystack = [p.name, p.form, p.cat, p.fabric, ...sizesOf(p.name)]
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [data.products, session.ui, sizesOf])

  const product = useMemo(
    () => data.products.find((p) => p.id === session.ui.productId) ?? data.products[0],
    [data.products, session.ui.productId],
  )

  const cartGoods = useMemo(
    () => session.cart.reduce((sum, item) => sum + item.price, 0),
    [session.cart],
  )
  const deliveryCost =
    DELIVERY_OPTIONS.find((d) => d.key === session.delivery)?.cost ?? 0
  const cartTotal = cartGoods + (session.cart.length ? deliveryCost : 0)

  const myOrders = useMemo(() => data.orders.filter((o) => o.mine), [data.orders])

  const cabOrder = useMemo(
    () => data.orders.find((o) => o.id === session.ui.cabId) ?? data.orders[0],
    [data.orders, session.ui.cabId],
  )

  const stagesOf = useCallback(
    (order: Order) => (order.kind === 'shop' ? SHOP_STAGES : TAILORING_STAGES),
    [],
  )

  const value: AppValue = {
    ready,
    data,

    lang,
    priceMode,
    t,
    toggleLang: () => {
      const settings = { ...data.settings, lang: lang === 'EN' ? ('RU' as Lang) : ('EN' as Lang) }
      commit((d) => ({ ...d, settings }), () => repo.saveSettings(settings))
    },
    setPriceMode: (mode) => {
      const settings = { ...data.settings, priceMode: mode }
      commit((d) => ({ ...d, settings }), () => repo.saveSettings(settings))
    },

    fmt: fmtRub,
    price,

    filter: session.ui.filter,
    setFilter: (value) => patchSession((s) => ({ ...s, ui: { ...s.ui, filter: value } })),
    search: session.ui.search,
    setSearch: (value) => patchSession((s) => ({ ...s, ui: { ...s.ui, search: value } })),
    visibleProducts,
    sizesOf,

    product,
    selectProduct: (id) =>
      patchSession((s) => {
        const picked = data.products.find((p) => p.id === id)
        const available = picked ? sizesOf(picked.name) : []
        // Opening a different model preselects its first available size, as in
        // the design. Re-opening the one already on screen — coming back from
        // the cart, say — keeps the size the visitor chose, unless it sold out.
        const keep = s.ui.productId === id && s.ui.size && available.includes(s.ui.size)
        return {
          ...s,
          ui: { ...s.ui, productId: id, size: keep ? s.ui.size : available[0] ?? null },
        }
      }),
    size: session.ui.size,
    selectSize: (size) => patchSession((s) => ({ ...s, ui: { ...s.ui, size } })),
    fabricId: session.draft.fabricId,
    selectFabric: (id) =>
      patchSession((s) => ({ ...s, draft: { ...s.draft, fabricId: id } })),

    cart: session.cart,
    cartCount: session.cart.length,
    cartTotal,
    addToCart: (item, size) => {
      const line: CartItem = {
        lineId: uid('line'),
        productId: item.id,
        name: item.name,
        meta: `${size} · ${item.fabric}`,
        price: item.price,
      }
      patchSession((s) => ({ ...s, cart: [...s.cart, line] }))
      showToast(`${item.name} · ${size} в корзине`)
    },
    removeFromCart: (lineId) =>
      patchSession((s) => ({ ...s, cart: s.cart.filter((i) => i.lineId !== lineId) })),
    delivery: session.delivery,
    setDelivery: (key) => patchSession((s) => ({ ...s, delivery: key })),
    placeOrder: () => {
      if (!session.cart.length) {
        showToast('Корзина пуста')
        return null
      }
      const id = data.nextOrderId
      const order: Order = {
        id,
        kind: 'shop',
        client: 'Вы',
        model: session.cart.map((i) => `${i.name} · ${i.meta.split(' · ')[0]}`).join(', '),
        fabric: session.cart.map((i) => i.meta.split(' · ')[1]).filter(Boolean).join(', '),
        stage: 0,
        mine: true,
        meta: `${session.delivery} · оплата при получении`,
        comment: '—',
        total: cartTotal,
      }
      commit(
        (d) => ({ ...d, orders: [order, ...d.orders], nextOrderId: d.nextOrderId + 1 }),
        () => repo.createOrder(order),
      )
      patchSession((s) => ({ ...s, cart: [] }))
      showToast('Заказ принят · оплата при получении')
      return id
    },

    form: session.draft.form,
    setForm: (value) => patchSession((s) => ({ ...s, draft: { ...s.draft, form: value } })),
    measurements: session.draft.measurements,
    setMeasurement: (key, value) =>
      patchSession((s) => ({
        ...s,
        draft: { ...s.draft, measurements: { ...s.draft.measurements, [key]: value } },
      })),
    filledCount: MEASURE_FIELDS.filter(
      (f) => String(session.draft.measurements[f.key]).trim() !== '',
    ).length,
    comment: session.draft.comment,
    setComment: (value) => patchSession((s) => ({ ...s, draft: { ...s.draft, comment: value } })),
    garmentPhoto: session.draft.garment,
    referencePhoto: session.draft.reference,
    setPhoto: (slotName, photo) =>
      patchSession((s) => ({ ...s, draft: { ...s.draft, [slotName]: photo } })),
    sendMeasurements: () => {
      const { draft } = session
      const filled = MEASURE_FIELDS.filter(
        (f) => String(draft.measurements[f.key]).trim() !== '',
      ).length
      if (filled < 3) {
        showToast('Впишите хотя бы длину, плечи и грудь')
        return null
      }
      const id = data.nextOrderId
      const fabric = data.fabrics.find((f) => f.id === draft.fabricId)
      const photos = [draft.garment, draft.reference].filter((p): p is Photo => p !== null)
      const order: Order = {
        id,
        kind: 'tailoring',
        client: 'Вы',
        model:
          draft.form === 'С узлами' ? 'Пошив · форма с узлами' : 'Пошив · классическая форма',
        fabric: fabric?.full ?? '—',
        stage: 0,
        mine: true,
        meta: 'мерки приняты · швея напишет в WhatsApp',
        comment: draft.comment.trim() || '—',
        measurements: { ...draft.measurements },
        photos,
      }
      commit(
        (d) => ({ ...d, orders: [order, ...d.orders], nextOrderId: d.nextOrderId + 1 }),
        () => repo.createOrder(order),
      )
      // Clear the form once it has been sent. Without this, going Back from the
      // confirmation screen shows the request still filled in and sending it
      // again creates a duplicate order.
      patchSession((s) => ({ ...s, draft: initialSession().draft }))
      return id
    },

    slot: session.ui.slot,
    selectSlot: (label) => patchSession((s) => ({ ...s, ui: { ...s.ui, slot: label } })),
    bookFitting: () => {
      const label = session.ui.slot
      if (!label) {
        showToast('Выберите время')
        return false
      }
      // The slot may have been taken since it was chosen — on another device,
      // or by the tailor herself.
      if (data.slots.find((s) => s.label === label)?.taken) {
        showToast('Это время уже занято — выберите другое')
        patchSession((s) => ({ ...s, ui: { ...s.ui, slot: null } }))
        return false
      }
      // Attach the fitting to the customer's newest order still in progress.
      const target = data.orders.find(
        (o) => o.mine && o.kind === 'tailoring' && o.stage < TAILORING_STAGES.length - 1,
      )
      commit(
        (d) => ({
          ...d,
          slots: d.slots.map((s) => (s.label === label ? { ...s, taken: true } : s)),
          orders: target
            ? d.orders.map((o) => (o.id === target.id ? { ...o, fittingSlot: label } : o))
            : d.orders,
        }),
        () => repo.bookSlot(label, target?.id),
      )
      patchSession((s) => ({ ...s, ui: { ...s.ui, slot: null } }))
      showToast(`Примерка ${label} · с. Шатой`)
      return true
    },

    myOrders,
    stagesOf,
    stageLabel: (order) => stagesOf(order)[Math.min(order.stage, stagesOf(order).length - 1)],

    cabOrder,
    openCabOrder: (id) => patchSession((s) => ({ ...s, ui: { ...s.ui, cabId: id } })),
    advanceOrder: (id) => {
      const order = data.orders.find((o) => o.id === id)
      if (!order) return
      const stages = stagesOf(order)
      if (order.stage >= stages.length - 1) {
        showToast(order.kind === 'shop' ? 'Заказ уже получен' : 'Заказ уже выдан')
        return
      }
      const stage = order.stage + 1
      commit(
        (d) => ({ ...d, orders: d.orders.map((o) => (o.id === id ? { ...o, stage } : o)) }),
        () => repo.updateOrder(id, { stage }),
      )
      showToast(`№${id} → ${stages[stage]}`)
    },
    toggleStock: (model, size) => {
      const available = !data.stock[model]?.[size]
      commit(
        (d) => ({
          ...d,
          stock: { ...d.stock, [model]: { ...d.stock[model], [size]: available } },
        }),
        () => repo.setStock(model, size, available),
      )
    },

    toast,
    showToast,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

/** Access the shop state. Must be used inside <AppProvider>. */
export function useApp(): AppValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
