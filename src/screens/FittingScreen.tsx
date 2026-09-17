import { useNavigate } from 'react-router-dom'
import { ActionBar, Screen, ScreenBody, ScreenHeader } from '../components/Screen'
import { BackBar } from '../components/BackBar'
import { Tap } from '../components/Tap'
import { WORKSHOP } from '../data/seed'
import { useApp } from '../store/AppContext'
import { INK, YEL, ink, safeTop } from '../styles/tokens'

/** Booking a fitting at the workshop in Шатой. */
export function FittingScreen() {
  const navigate = useNavigate()
  const { t, data, slot, selectSlot, bookFitting, showToast } = useApp()

  // The session remembers the label, not the slot: one that has been booked in
  // the meantime (including the one this screen just booked) is no longer a
  // valid choice, so the bar falls back to "Выберите время".
  const bookable = data.slots.find((s) => s.label === slot && !s.taken) ?? null

  return (
    <Screen>
      <ScreenHeader style={{ padding: `${safeTop(18)} 20px 16px` }}>
        <BackBar title={t('Примерка')} to="/measure" />
      </ScreenHeader>

      <ScreenBody style={{ padding: '4px 20px 24px' }}>
        <div
          style={{
            padding: 14,
            borderRadius: 12,
            background: '#fff',
            border: `1px solid ${ink(0.16)}`,
            fontSize: 12.5,
            lineHeight: 1.6,
          }}
        >
          {WORKSHOP.place}
          <br />
          <a
            href={`tel:+${WORKSHOP.phoneDigits}`}
            style={{ color: ink(0.6), textDecoration: 'none' }}
          >
            {WORKSHOP.phone}
          </a>
        </div>

        <div style={{ marginTop: 20, fontSize: 12.5, fontWeight: 700 }}>
          {t('Свободное время')}
        </div>

        <div
          style={{
            marginTop: 10,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 9,
          }}
        >
          {data.slots.map((s) => {
            // A stale session label may point at a slot that is now taken;
            // such a slot is never shown as chosen.
            const selected = !s.taken && slot === s.label
            return (
              <Tap
                key={s.label}
                aria-pressed={selected}
                aria-disabled={s.taken || undefined}
                // The chip shows the time alone, as the prototype's unavailable
                // size chips do; the state is dimming plus this label.
                aria-label={s.taken ? `${s.label} — занято` : undefined}
                onClick={() =>
                  s.taken
                    ? showToast('Это время уже занято — выберите другое')
                    : selectSlot(s.label)
                }
                style={{
                  padding: 13,
                  borderRadius: 10,
                  textAlign: 'center',
                  // A booked slot is not in the prototype; it borrows the
                  // prototype's own out-of-stock chip treatment.
                  border: `1.3px solid ${s.taken ? ink(0.15) : selected ? INK : ink(0.2)}`,
                  background: s.taken ? ink(0.06) : selected ? INK : '#fff',
                  color: s.taken ? ink(0.35) : selected ? YEL : INK,
                  fontSize: 12.5,
                  fontWeight: 600,
                }}
              >
                {s.label}
              </Tap>
            )
          })}
        </div>

        <div
          style={{
            marginTop: 18,
            fontSize: 11.5,
            lineHeight: 1.55,
            color: ink(0.65),
          }}
        >
          На примерке уточняем посадку, длину и воротник. Возьмите с собой вещь, по которой
          снимали мерки.
        </div>
      </ScreenBody>

      <ActionBar>
        <Tap
          onClick={() => {
            if (!bookable) return showToast('Выберите время')
            if (bookFitting()) navigate('/orders')
          }}
          style={{
            flex: 1,
            padding: 15,
            borderRadius: 11,
            background: bookable ? INK : ink(0.12),
            color: bookable ? YEL : ink(0.62),
            textAlign: 'center',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {bookable ? `Записаться · ${bookable.label}` : 'Выберите время'}
        </Tap>
      </ActionBar>
    </Screen>
  )
}
