import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Screen } from '../components/Screen'
import { Tap } from '../components/Tap'
import { CheckMark } from '../components/icons'
import { FONT_DISPLAY, INK, ink, YEL, YELLOW_WASH_SM } from '../styles/tokens'

/** Confirmation after a tailoring request or an order is sent. */
export function DoneScreen() {
  const navigate = useNavigate()
  const { orderId } = useParams<{ orderId: string }>()
  const orderNo = Number(orderId)

  // The number is read straight from the URL, so a hand-typed /done/abc would
  // otherwise confirm «Заявка №abc отправлена». Without a real order number
  // there is nothing to confirm — send the visitor back to the catalog.
  if (!Number.isInteger(orderNo) || orderNo <= 0) return <Navigate to="/" replace />

  return (
    <Screen
      style={{
        justifyContent: 'center',
        padding: '40px 30px',
        boxSizing: 'border-box',
        textAlign: 'center',
        background: YEL,
        backgroundImage: YELLOW_WASH_SM,
      }}
    >
      <div
        style={{
          alignSelf: 'center',
          flex: 'none',
          width: 58,
          height: 58,
          borderRadius: '50%',
          background: INK,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CheckMark />
      </div>

      {/* role="status" so the confirmation is announced after the navigation. */}
      <div
        role="status"
        style={{ marginTop: 22, fontFamily: FONT_DISPLAY, fontSize: 26, lineHeight: 1.25 }}
      >
        Заявка №{orderNo} отправлена
      </div>

      <div style={{ marginTop: 12, fontSize: 13, lineHeight: 1.6, color: ink(0.72) }}>
        Швея посмотрит мерки и напишет в WhatsApp: подтвердит модель, ткань и срок. Оплата при
        получении.
      </div>

      <Tap
        onClick={() => navigate('/orders')}
        style={{
          marginTop: 26,
          width: '100%',
          boxSizing: 'border-box',
          padding: 14,
          borderRadius: 11,
          background: INK,
          color: YEL,
          fontSize: 13.5,
          fontWeight: 700,
        }}
      >
        Смотреть статус заказа
      </Tap>

      <Tap
        onClick={() => navigate('/')}
        style={{
          marginTop: 10,
          width: '100%',
          boxSizing: 'border-box',
          padding: 14,
          borderRadius: 11,
          border: `1.4px solid ${INK}`,
          fontSize: 13.5,
          fontWeight: 700,
        }}
      >
        В каталог
      </Tap>
    </Screen>
  )
}
