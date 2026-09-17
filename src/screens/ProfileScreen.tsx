import { useNavigate } from 'react-router-dom'
import { Screen, ScreenBody, ScreenHeader } from '../components/Screen'
import { Tap } from '../components/Tap'
import { ArrowRight } from '../components/icons'
import { WORKSHOP } from '../data/seed'
import { useApp } from '../store/AppContext'
import {
  FONT_DISPLAY,
  INK,
  ink,
  paper,
  YEL,
  YELLOW_WASH_XS,
  safeTop,
} from '../styles/tokens'

/** About the tailor: contacts, WhatsApp, reviews and the way into her cabinet. */
export function ProfileScreen() {
  const navigate = useNavigate()
  const { t, lang, toggleLang, data } = useApp()

  const langLabel = lang === 'EN' ? 'EN / RU' : 'RU / EN'
  // The design's contact line names only the village: WORKSHOP.place carries
  // "· мастерская" for the fitting screen, which the prototype omits here.
  const town = WORKSHOP.town

  return (
    <Screen>
      <ScreenHeader
        style={{
          padding: `${safeTop(18)} 20px 18px`,
          background: YEL,
          backgroundImage: YELLOW_WASH_XS,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22 }}>{t('О мастере')}</div>
          <Tap
            onClick={toggleLang}
            // "RU / EN" alone does not say what the button does. Keep the
            // visible text inside the accessible name and add the action.
            // Not aria-pressed: it swaps between two languages rather than
            // turning one state on and off.
            aria-label={
              lang === 'EN'
                ? `${langLabel} — switch to Russian`
                : `${langLabel} — переключить на английский`
            }
            style={{
              padding: '7px 12px',
              borderRadius: 999,
              border: `1.2px solid ${ink(0.4)}`,
              fontSize: 11.5,
              fontWeight: 700,
            }}
          >
            {langLabel}
          </Tap>
        </div>
        <div
          style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.6, color: ink(0.75) }}
        >
          Ikrima · индивидуальный пошив мужской исламской одежды
          <br />
          {town} · {WORKSHOP.phone}
        </div>
      </ScreenHeader>

      <ScreenBody style={{ padding: '18px 20px 24px' }}>
        <div style={{ fontSize: 13, lineHeight: 1.65, color: ink(0.78) }}>
          Шью мужскую мусульманскую одежду: классическая форма и форма с узлами. Мерки снимаю
          только с одежды — присылайте размеры вашей вещи. Остальные нюансы решаем на примерке.
          Иногда бывают готовые размеры в наличии.
        </div>

        <div style={{ marginTop: 18, display: 'flex', gap: 9 }}>
          <a
            href={`https://wa.me/${WORKSHOP.phoneDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              boxSizing: 'border-box',
              padding: 13,
              // Ink-on-ink border so this button measures exactly like the
              // outlined one beside it; the prototype let them differ by 1.3px.
              border: `1.3px solid ${INK}`,
              borderRadius: 11,
              background: INK,
              color: YEL,
              textAlign: 'center',
              textDecoration: 'none',
              fontSize: 12.5,
              fontWeight: 700,
            }}
          >
            Написать в WhatsApp
          </a>
          <Tap
            onClick={() => navigate('/fabrics')}
            style={{
              flex: 1,
              boxSizing: 'border-box',
              padding: 13,
              borderRadius: 11,
              border: `1.3px solid ${INK}`,
              textAlign: 'center',
              fontSize: 12.5,
              fontWeight: 700,
            }}
          >
            {t('Ткани')}
          </Tap>
        </div>

        <div style={{ marginTop: 24, fontSize: 12.5, fontWeight: 700 }}>{t('Отзывы')}</div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 9 }}>
          {data.reviews.map((review) => (
            <div
              key={review.id}
              style={{
                padding: 13,
                borderRadius: 11,
                border: `1.2px dashed ${ink(0.3)}`,
                fontSize: 11.5,
                lineHeight: 1.5,
                color: ink(0.62),
              }}
            >
              {review.text}
            </div>
          ))}
        </div>

        <Tap
          onClick={() => navigate('/cabinet')}
          style={{
            marginTop: 24,
            width: '100%',
            boxSizing: 'border-box',
            padding: 15,
            borderRadius: 12,
            background: INK,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: YEL }}>
              {t('Кабинет швеи')}
            </span>
            <span style={{ display: 'block', marginTop: 3, fontSize: 11, color: paper(0.6) }}>
              заказы, мерки клиентов, наличие размеров
            </span>
          </span>
          <ArrowRight size={20} stroke={YEL} />
        </Tap>
      </ScreenBody>
    </Screen>
  )
}
