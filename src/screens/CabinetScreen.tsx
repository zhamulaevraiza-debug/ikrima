import type { CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackBar } from '../components/BackBar'
import { Screen, ScreenBody, ScreenHeader } from '../components/Screen'
import { Tap } from '../components/Tap'
import { useApp } from '../store/AppContext'
import type { PriceMode } from '../types'
import { FONT_DISPLAY, INK, PAPER, paper, safeTop, YEL } from '../styles/tokens'

const PRICE_MODES: PriceMode[] = ['точные', 'от', 'скрыть']

/** Yellow when the tailor has it on, outlined when she does not. */
function chipStyle(on: boolean) {
  return {
    padding: '9px 14px',
    borderRadius: 9,
    background: on ? YEL : 'transparent',
    color: on ? INK : paper(0.55),
    border: `1.2px solid ${on ? YEL : paper(0.25)}`,
    fontSize: 12,
    fontWeight: 600,
  } as const
}

const sectionTitle = {
  fontSize: 12.5,
  fontWeight: 700,
  color: PAPER,
} as const

/**
 * The cabinet's near-black surface, plus one override: the shared focus ring in
 * global.css is `2px solid var(--ink)`, which is invisible against this
 * background. Redefining --ink for this subtree repaints the ring yellow, and
 * nothing else under here reads the variable — the screen's own colours come
 * from the tokens module.
 */
const darkScreen = { background: INK, '--ink': YEL } as CSSProperties

/** The tailor's own dark screen: her orders, her stock, her price display. */
export function CabinetScreen() {
  const navigate = useNavigate()
  const { t, data, stagesOf, stageLabel, openCabOrder, toggleStock, priceMode, setPriceMode } =
    useApp()

  // The prototype hard-coded both tiles; here they follow the real orders.
  const activeCount = data.orders.filter((o) => o.stage < stagesOf(o).length - 1).length
  // A "new request" is a tailoring order nobody has started cutting yet.
  // A ready-made purchase also sits at stage 0, but it is not a request.
  const newCount = data.orders.filter((o) => o.kind === 'tailoring' && o.stage === 0).length

  return (
    <Screen style={darkScreen}>
      <ScreenHeader style={{ padding: `${safeTop(18)} 20px 16px` }}>
        <BackBar title={t('Кабинет швеи')} to="/profile" dark />
      </ScreenHeader>

      <ScreenBody style={{ padding: '4px 20px 24px' }}>
        <div style={{ display: 'flex', gap: 9 }}>
          {[
            { value: activeCount, label: 'в работе' },
            { value: newCount, label: 'новые заявки' },
          ].map((tile) => (
            <div
              key={tile.label}
              style={{
                flex: 1,
                padding: 13,
                borderRadius: 11,
                background: paper(0.07),
                border: `1px solid ${paper(0.12)}`,
              }}
            >
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: YEL }}>{tile.value}</div>
              <div style={{ marginTop: 3, fontSize: 10.5, color: paper(0.55) }}>{tile.label}</div>
            </div>
          ))}
        </div>

        <div style={{ ...sectionTitle, marginTop: 22 }}>{t('Заказы')}</div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 9 }}>
          {data.orders.map((order) => {
            const stages = stagesOf(order)
            const pct = `${Math.round(((order.stage + 1) / stages.length) * 100)}%`
            return (
              <Tap
                key={order.id}
                onClick={() => {
                  openCabOrder(order.id)
                  navigate(`/cabinet/${order.id}`)
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: 14,
                  borderRadius: 12,
                  background: paper(0.06),
                  border: `1px solid ${paper(0.13)}`,
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: PAPER }}>
                    {order.client}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: YEL }}>
                    {stageLabel(order)}
                  </span>
                </span>
                <span
                  style={{
                    display: 'block',
                    marginTop: 4,
                    fontSize: 11.5,
                    color: paper(0.55),
                  }}
                >
                  №{order.id} · {order.model} · {order.fabric}
                </span>
                <span
                  style={{
                    display: 'block',
                    marginTop: 10,
                    height: 3,
                    borderRadius: 2,
                    background: paper(0.14),
                    overflow: 'hidden',
                  }}
                >
                  <span style={{ display: 'block', width: pct, height: '100%', background: YEL }} />
                </span>
              </Tap>
            )
          })}
        </div>

        <div style={{ ...sectionTitle, marginTop: 24 }}>Готовые размеры в наличии</div>
        <div style={{ marginTop: 4, fontSize: 11, color: paper(0.5), lineHeight: 1.5 }}>
          Отмечайте, что есть сейчас — в каталоге у клиента обновится сразу.
        </div>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.entries(data.stock).map(([model, sizes]) => (
            <div key={model}>
              <div style={{ fontSize: 12, fontWeight: 600, color: paper(0.8) }}>{model}</div>
              {/* Named group: on its own a chip announces only "M, pressed",
                  with no hint of which model it belongs to. */}
              <div
                role="group"
                aria-label={model}
                style={{ marginTop: 8, display: 'flex', gap: 7, flexWrap: 'wrap' }}
              >
                {Object.entries(sizes).map(([size, on]) => (
                  <Tap
                    key={size}
                    onClick={() => toggleStock(model, size)}
                    aria-pressed={on}
                    style={chipStyle(on)}
                  >
                    {size}
                  </Tap>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Beyond the prototype: it exposed the price display as a design-time
            prop, but the choice is the tailor's, so it lives in her cabinet. */}
        <div style={{ ...sectionTitle, marginTop: 24 }}>Цены в каталоге</div>
        <div
          role="group"
          aria-label="Цены в каталоге"
          style={{ marginTop: 10, display: 'flex', gap: 7, flexWrap: 'wrap' }}
        >
          {PRICE_MODES.map((mode) => (
            <Tap
              key={mode}
              onClick={() => setPriceMode(mode)}
              aria-pressed={priceMode === mode}
              style={chipStyle(priceMode === mode)}
            >
              {mode}
            </Tap>
          ))}
        </div>
      </ScreenBody>
    </Screen>
  )
}
