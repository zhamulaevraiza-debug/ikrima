import { useNavigate } from 'react-router-dom'
import { BackBar } from '../components/BackBar'
import { PhotoPlaceholder } from '../components/PhotoPlaceholder'
import { ActionBar, Screen, ScreenBody, ScreenHeader } from '../components/Screen'
import { Tap } from '../components/Tap'
import { DELIVERY_OPTIONS } from '../data/seed'
import { useApp } from '../store/AppContext'
import { FONT_DISPLAY, INK, YEL, ink, safeTop } from '../styles/tokens'

const DELIVERY_HEADING_ID = 'cart-delivery-heading'

/** The basket: what is reserved, how it is collected, and what to pay on delivery. */
export function CartScreen() {
  const navigate = useNavigate()
  const { t, cart, cartTotal, removeFromCart, delivery, setDelivery, placeOrder, price, fmt } =
    useApp()
  const hasItems = cart.length > 0

  return (
    <Screen>
      <ScreenHeader style={{ padding: `${safeTop(18)} 20px 14px` }}>
        <BackBar title={t('Корзина')} to="/" />
      </ScreenHeader>

      <ScreenBody style={{ padding: '4px 20px 24px' }}>
        {!hasItems && (
          <div
            style={{
              marginTop: 40,
              textAlign: 'center',
              fontSize: 13,
              lineHeight: 1.6,
              color: ink(0.65),
            }}
          >
            Пока пусто.
            <br />
            Выберите вещь в каталоге или отправьте мерки на пошив.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cart.map((item) => (
            <div
              key={item.lineId}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                padding: 12,
                borderRadius: 12,
                background: '#fff',
                border: `1px solid ${ink(0.14)}`,
              }}
            >
              <PhotoPlaceholder
                radius={7}
                step={5}
                alpha={0.05}
                style={{ width: 52, height: 66, flex: 'none', border: `1px solid ${ink(0.16)}` }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</div>
                <div style={{ marginTop: 3, fontSize: 11.5, color: ink(0.65) }}>{item.meta}</div>
                <div style={{ marginTop: 5, fontSize: 13, fontWeight: 700 }}>
                  {price(item.price)}
                </div>
              </div>
              <Tap
                aria-label={`Убрать ${item.name} · ${item.meta} из корзины`}
                onClick={() => removeFromCart(item.lineId)}
                style={{
                  width: 28,
                  height: 28,
                  flex: 'none',
                  borderRadius: '50%',
                  background: ink(0.07),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                }}
              >
                ×
              </Tap>
            </div>
          ))}
        </div>

        <div id={DELIVERY_HEADING_ID} style={{ marginTop: 22, fontSize: 12.5, fontWeight: 700 }}>
          {t('Получение')}
        </div>
        <div
          role="group"
          aria-labelledby={DELIVERY_HEADING_ID}
          style={{ marginTop: 9, display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          {DELIVERY_OPTIONS.map((option) => {
            const selected = delivery === option.key
            return (
              <Tap
                key={option.key}
                aria-pressed={selected}
                onClick={() => setDelivery(option.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  padding: 13,
                  boxSizing: 'border-box',
                  borderRadius: 11,
                  border: `1.3px solid ${selected ? INK : ink(0.18)}`,
                  background: selected ? '#fff' : 'transparent',
                }}
              >
                <span
                  style={{
                    width: 17,
                    height: 17,
                    flex: 'none',
                    borderRadius: '50%',
                    border: `1.5px solid ${INK}`,
                    background: selected ? INK : 'transparent',
                    display: 'block',
                  }}
                />
                <span style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <span style={{ display: 'block', fontSize: 12.5, fontWeight: 600 }}>
                    {option.label}
                  </span>
                  <span style={{ display: 'block', marginTop: 2, fontSize: 11, color: ink(0.65) }}>
                    {option.note}
                  </span>
                </span>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{option.price}</span>
              </Tap>
            )
          })}
        </div>

        <div
          style={{
            marginTop: 18,
            padding: 13,
            borderRadius: 11,
            background: ink(0.06),
            fontSize: 11.5,
            lineHeight: 1.55,
            color: ink(0.7),
          }}
        >
          Оплата при получении — наличными или переводом. Предоплату не берём.
        </div>
      </ScreenBody>

      <ActionBar style={{ flexDirection: 'column', gap: 11 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12.5, color: ink(0.6), fontWeight: 600 }}>
            {t('К оплате при получении')}
          </span>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 21 }}>{fmt(cartTotal)}</span>
        </div>
        <Tap
          onClick={() => {
            // placeOrder() returns the new order number, or null when the cart
            // is empty (it raises the "Корзина пуста" toast itself). Compare
            // against null rather than testing truthiness, so order №0 would
            // still navigate.
            if (placeOrder() !== null) navigate('/orders')
          }}
          style={{
            padding: 15,
            borderRadius: 11,
            background: hasItems ? INK : ink(0.12),
            color: hasItems ? YEL : ink(0.62),
            textAlign: 'center',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {t('Оформить заказ')}
        </Tap>
      </ActionBar>
    </Screen>
  )
}
