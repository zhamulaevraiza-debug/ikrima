import { useNavigate } from 'react-router-dom'
import { Screen, ScreenBody, ScreenHeader } from '../components/Screen'
import { StageStepper } from '../components/StageStepper'
import { Tap } from '../components/Tap'
import { WORKSHOP } from '../data/seed'
import { useApp } from '../store/AppContext'
import { AMBER, FONT_DISPLAY, INK, ink, safeTop } from '../styles/tokens'

/** Where the customer follows her own orders through the workshop. */
export function OrdersScreen() {
  const navigate = useNavigate()
  const { t, data, myOrders, stagesOf, stageLabel } = useApp()

  return (
    <Screen>
      <ScreenHeader style={{ padding: `${safeTop(18)} 20px 14px` }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22 }}>{t('Мои заказы')}</div>
      </ScreenHeader>

      <ScreenBody
        style={{
          padding: '4px 20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {myOrders.length === 0 ? (
          <div
            style={{
              marginTop: 40,
              textAlign: 'center',
              fontSize: 13,
              lineHeight: 1.6,
              color: ink(0.65),
            }}
          >
            Заказов пока нет.
            <br />
            Выберите готовый размер в каталоге или отправьте мерки на пошив.
          </div>
        ) : (
          myOrders.map((order) => {
            const meta = [order.meta, order.fittingSlot && `примерка ${order.fittingSlot}`]
              .filter(Boolean)
              .join(' · ')
            const stages = stagesOf(order)
            const step = Math.min(order.stage + 1, stages.length)
            return (
              <div
                key={order.id}
                style={{
                  padding: 16,
                  borderRadius: 13,
                  background: '#fff',
                  border: `1.3px solid ${ink(0.16)}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}
                >
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>
                    №{order.id} · {order.model}
                  </div>
                  <div
                    style={{
                      flex: 'none',
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: AMBER,
                    }}
                  >
                    {stageLabel(order)}
                  </div>
                </div>

                {meta && (
                  <div style={{ marginTop: 4, fontSize: 11.5, color: ink(0.65) }}>{meta}</div>
                )}

                {/* The stepper repeats every stage name on every card, which a
                    screen reader would read out in full. Announcing it as one
                    progress indicator says the same thing in one breath. */}
                <div
                  style={{ marginTop: 14 }}
                  role="progressbar"
                  aria-label={`Заказ №${order.id}`}
                  aria-valuemin={1}
                  aria-valuemax={stages.length}
                  aria-valuenow={step}
                  aria-valuetext={`${stageLabel(order)} · этап ${step} из ${stages.length}`}
                >
                  <StageStepper stages={stages} stage={order.stage} />
                </div>

                <div style={{ marginTop: 14, display: 'flex', gap: 9 }}>
                  <a
                    href={`https://wa.me/${WORKSHOP.phoneDigits}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    // Every card carries the same two controls, so each one
                    // names its own order for anyone listing links or buttons.
                    aria-label={`WhatsApp швее · заказ №${order.id}`}
                    style={{
                      flex: 1,
                      display: 'block',
                      padding: 11,
                      borderRadius: 9,
                      border: `1.3px solid ${INK}`,
                      textAlign: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    WhatsApp швее
                  </a>
                  <Tap
                    onClick={() => navigate('/measure')}
                    aria-label={`Мои мерки · заказ №${order.id}`}
                    style={{
                      flex: 1,
                      padding: 11,
                      borderRadius: 9,
                      background: ink(0.07),
                      textAlign: 'center',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    Мои мерки
                  </Tap>
                </div>
              </div>
            )
          })
        )}

        {/* A customer with nothing finished yet would otherwise get a heading
            standing over an empty space. The fragment keeps both blocks direct
            children of the column, so the design's 12px gap is unchanged. */}
        {data.past.length > 0 && (
          <>
            <div style={{ marginTop: 6, fontSize: 12, fontWeight: 700, color: ink(0.6) }}>
              {t('Завершённые')}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {data.past.map((order) => (
                <div
                  key={order.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 13px',
                    borderRadius: 11,
                    background: ink(0.045),
                  }}
                >
                  <div style={{ flex: 1, fontSize: 12.5, fontWeight: 600 }}>
                    №{order.id} · {order.model}
                  </div>
                  <div style={{ fontSize: 11.5, color: ink(0.62) }}>{order.date}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </ScreenBody>
    </Screen>
  )
}
