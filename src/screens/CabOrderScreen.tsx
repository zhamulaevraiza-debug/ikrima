import { useEffect, type CSSProperties } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { ActionBar, Screen, ScreenBody, ScreenHeader } from '../components/Screen'
import { BackBar } from '../components/BackBar'
import { Tap } from '../components/Tap'
import { useApp } from '../store/AppContext'
import { FALLBACK_MEASURES, MEASURE_FIELDS, WORKSHOP } from '../data/seed'
import { INK, PAPER, YEL, paper, safeTop, yel } from '../styles/tokens'

const sectionTitle = {
  fontSize: 12.5,
  fontWeight: 700,
  color: PAPER,
} as const

/**
 * The cabinet's near-black surface, plus one override: the shared focus ring in
 * global.css is `2px solid var(--ink)`, which is invisible against this
 * background. Redefining --ink for this subtree repaints the ring yellow, so
 * the back button, the advance button and the call link stay visibly focusable
 * for keyboard users. Nothing else under here reads the variable — the screen's
 * own colours come from the tokens module.
 */
const darkScreen = { background: INK, '--ink': YEL } as CSSProperties

const photoSlot = {
  flex: 1,
  height: 96,
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 10,
  color: paper(0.45),
} as const

/** One order as the tailor sees it: the client's measurements, photos and stage. */
export function CabOrderScreen() {
  const { data, openCabOrder, advanceOrder, stagesOf } = useApp()
  const { orderId } = useParams<{ orderId: string }>()
  const id = Number(orderId)

  // Read the order straight from the URL rather than from the store's
  // `cabOrder`: the effect below syncs the store one render later, which on a
  // deep link would show the previously opened client for a frame. Both point
  // at the same record once synced.
  const order = data.orders.find((o) => o.id === id)
  const found = order !== undefined

  useEffect(() => {
    // Only point the store at an order that exists: a hand-typed /cabinet/abc
    // would otherwise persist cabId: NaN into the session, and `cabOrder`
    // would silently fall back to whichever order happens to be first.
    if (found) openCabOrder(id)
    // openCabOrder is rebuilt on every render, so only the id may re-run this.
  }, [id, found])

  if (!order) return <Navigate to="/cabinet" replace />

  const stages = stagesOf(order)
  const photos = order.photos ?? []
  // «Заказ выдан» is the tailoring wording. stagesOf() also serves shop orders,
  // which end at «получен» — advanceOrder's own toast says «Заказ уже получен»,
  // so the button must not call the same state "выдан".
  const advanceLabel =
    order.stage >= stages.length - 1
      ? order.kind === 'shop'
        ? 'Заказ получен'
        : 'Заказ выдан'
      : `Этап: ${stages[order.stage + 1]}`

  return (
    <Screen style={darkScreen}>
      <ScreenHeader style={{ padding: `${safeTop(18)} 20px 14px` }}>
        <BackBar
          to="/cabinet"
          dark
          title={<span style={{ fontSize: 19 }}>{order.client}</span>}
        />
      </ScreenHeader>

      <ScreenBody style={{ padding: '4px 20px 24px' }}>
        <div style={{ fontSize: 12, color: paper(0.6) }}>
          №{order.id} · {order.model} · {order.fabric}
        </div>

        {/* A ready-made purchase has no measurements, and the fallback numbers
            would read as the customer's own. Only a tailoring order shows the
            measurement table and the two photo slots that go with it. */}
        {order.kind === 'tailoring' ? (
          <>
            <div style={{ ...sectionTitle, marginTop: 18 }}>Мерки с одежды клиента, см</div>
            <div
              style={{
                marginTop: 10,
                borderRadius: 12,
                overflow: 'hidden',
                border: `1px solid ${paper(0.13)}`,
              }}
            >
              {MEASURE_FIELDS.map((field, i) => {
                const taken = order.measurements?.[field.key]
                // The stand-in numbers stand in for a whole order taken before
                // the app existed. Once a customer has actually sent measurements,
                // a blank stays blank — a made-up sleeve length would be cut.
                const value =
                  taken && taken.trim() !== ''
                    ? taken
                    : order.measurements
                      ? '—'
                      : FALLBACK_MEASURES[field.key]
                return (
                  <div
                    key={field.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 14px',
                      background: i % 2 ? paper(0.04) : 'transparent',
                    }}
                  >
                    <div style={{ flex: 1, fontSize: 12, color: paper(0.7) }}>{field.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: YEL }}>{value}</div>
                  </div>
                )
              })}
            </div>

            <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
              {([
                ['garment', 'фото вещи клиента'],
                ['reference', 'образец модели'],
              ] as const).map(([slot, caption]) => {
                // Matched by slot, not by position: a request with only a reference
                // image would otherwise show it as a photo of the customer's garment.
                const photo = photos.find((p) => p.slot === slot)
                return photo ? (
                  <div
                    key={caption}
                    role="img"
                    aria-label={photo.name}
                    style={{
                      ...photoSlot,
                      border: `1px solid ${paper(0.18)}`,
                      backgroundImage: `url(${photo.dataUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                ) : (
                  <div
                    key={caption}
                    style={{ ...photoSlot, border: `1.2px dashed ${paper(0.3)}` }}
                  >
                    {caption}
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <div style={{ ...sectionTitle, marginTop: 18, color: paper(0.7), fontWeight: 400 }}>
            Готовая вещь из наличия{order.total ? ` · ${order.total.toLocaleString('ru-RU')} ₽` : ''}
          </div>
        )}

        <div
          style={{
            marginTop: 18,
            padding: 13,
            borderRadius: 11,
            background: paper(0.06),
            fontSize: 12,
            lineHeight: 1.55,
            color: paper(0.7),
          }}
        >
          Комментарий: {order.comment}
        </div>

        <div style={{ ...sectionTitle, marginTop: 20 }}>Этап</div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 7 }}>
          {stages.map((label, i) => {
            const done = i <= order.stage
            const now = i === order.stage
            return (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  padding: '11px 13px',
                  borderRadius: 10,
                  background: now ? yel(0.12) : paper(0.04),
                  border: `1px solid ${now ? yel(0.4) : paper(0.1)}`,
                }}
              >
                <div
                  style={{
                    width: 15,
                    height: 15,
                    flex: 'none',
                    borderRadius: '50%',
                    border: `1.5px solid ${done ? YEL : paper(0.3)}`,
                    background: done ? YEL : 'transparent',
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: done ? PAPER : paper(0.5),
                  }}
                >
                  {label}
                </div>
                <div style={{ fontSize: 10.5, color: paper(0.45) }}>
                  {i < order.stage ? 'готово' : now ? 'сейчас' : ''}
                </div>
              </div>
            )
          })}
        </div>
      </ScreenBody>

      <ActionBar dark safeArea>
        <Tap
          onClick={() => advanceOrder(order.id)}
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 11,
            background: YEL,
            color: INK,
            textAlign: 'center',
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {advanceLabel}
        </Tap>
        {/* The prototype's "Позвонить" did nothing; here it is a real tel: link. */}
        <a
          href={`tel:+${WORKSHOP.phoneDigits}`}
          style={{
            flex: 'none',
            padding: '14px 18px',
            borderRadius: 11,
            border: `1.3px solid ${yel(0.5)}`,
            color: YEL,
            fontSize: 13,
            fontWeight: 700,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Позвонить
        </a>
      </ActionBar>
    </Screen>
  )
}
