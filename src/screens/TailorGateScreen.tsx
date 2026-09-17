import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Screen, ScreenBody, ScreenHeader } from '../components/Screen'
import { BackBar } from '../components/BackBar'
import { Tap } from '../components/Tap'
import { useApp } from '../store/AppContext'
import { PIN_LENGTH, isValidPin } from '../lib/pin'
import { FONT_DISPLAY, INK, YEL, paper, safeTop, yel } from '../styles/tokens'

const darkScreen = { background: INK, '--ink': YEL } as CSSProperties

/**
 * Asks the tailor for her code before the cabinet opens — and asks her to
 * choose one the first time.
 *
 * The code guards the shop's own screens, so the copy stays matter-of-fact
 * about what it is for rather than talking about security.
 */
export function TailorGateScreen({ change = false }: { change?: boolean } = {}) {
  const { hasTailorPin, setTailorPin, unlockTailor, showToast } = useApp()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [entry, setEntry] = useState('')
  const [confirmation, setConfirmation] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [shake, setShake] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Choosing a code takes two passes: type it, then repeat it. That happens on
  // the first ever visit, and whenever she asks to replace the code from inside
  // the cabinet — which she can only reach already unlocked.
  const choosing = change || !hasTailorPin
  const repeating = choosing && confirmation !== null
  const backTo = change ? '/cabinet' : '/profile'

  const title = choosing
    ? repeating
      ? 'Повторите код'
      : change
        ? 'Новый код'
        : 'Придумайте код'
    : 'Код швеи'
  const hint = choosing
    ? repeating
      ? 'Введите те же четыре цифры ещё раз.'
      : 'Четыре цифры, чтобы кабинет не открыл никто, кроме вас. Запомните их — восстановить код будет негде.'
    : 'Введите четыре цифры, чтобы открыть кабинет.'

  // `shake` remounts the field and `busy` blurs it, so both have to bring focus
  // back: without this a mistyped code closes the phone's keyboard and every
  // further digit goes nowhere.
  useEffect(() => {
    if (!busy) inputRef.current?.focus()
  }, [repeating, shake, busy])

  async function submit(pin: string) {
    if (busy) return
    setBusy(true)
    try {
      if (choosing) {
        if (confirmation === null) {
          setConfirmation(pin)
          setEntry('')
          return
        }
        if (pin !== confirmation) {
          reject('Коды не совпали — начните заново')
          setConfirmation(null)
          return
        }
        await setTailorPin(pin)
        showToast(change ? 'Новый код сохранён' : 'Код сохранён')
        navigate('/cabinet', { replace: true })
        return
      }

      if (await unlockTailor(pin)) {
        // The guard renders in place, so the address bar still holds the order
        // she opened. Stay on it — except on the change-code screen, which is
        // not where anyone means to arrive by entering their code.
        if (pathname === '/cabinet/pin') navigate('/cabinet', { replace: true })
        return
      }
      reject('Неверный код')
    } finally {
      setBusy(false)
    }
  }

  function reject(message: string) {
    setEntry('')
    setShake((n) => n + 1)
    showToast(message)
  }

  function type(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, PIN_LENGTH)
    setEntry(digits)
    if (isValidPin(digits)) void submit(digits)
  }

  return (
    <Screen style={darkScreen}>
      <ScreenHeader style={{ padding: `${safeTop(18)} 20px 14px` }}>
        <BackBar to={backTo} dark title="Кабинет швеи" />
      </ScreenHeader>

      <ScreenBody style={{ padding: '4px 20px 24px' }}>
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, color: YEL, lineHeight: 1.25 }}>
            {title}
          </div>
          <div
            style={{
              margin: '12px auto 0',
              maxWidth: 260,
              fontSize: 12.5,
              lineHeight: 1.6,
              color: paper(0.6),
            }}
          >
            {hint}
          </div>

          <label
            // The dots are the visible field; the input itself only exists to
            // raise the phone's numeric keyboard.
            key={shake}
            style={{
              margin: '34px auto 0',
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              cursor: 'text',
              animation: 'ikrima-toast-in .18s ease-out',
            }}
          >
            <input
              ref={inputRef}
              value={entry}
              onChange={(e) => type(e.target.value)}
              inputMode="numeric"
              autoComplete="off"
              aria-label={title}
              disabled={busy}
              style={{ position: 'absolute', opacity: 0, width: 1, height: 1, pointerEvents: 'none' }}
            />
            {Array.from({ length: PIN_LENGTH }, (_, i) => (
              <span
                key={i}
                aria-hidden="true"
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: i < entry.length ? YEL : 'transparent',
                  border: `1.5px solid ${i < entry.length ? YEL : paper(0.3)}`,
                }}
              />
            ))}
          </label>

          <Tap
            onClick={() => inputRef.current?.focus()}
            style={{
              marginTop: 30,
              padding: '13px 22px',
              borderRadius: 11,
              background: yel(0.12),
              border: `1px solid ${yel(0.4)}`,
              color: YEL,
              fontSize: 12.5,
              fontWeight: 700,
            }}
          >
            Ввести код
          </Tap>
        </div>
      </ScreenBody>
    </Screen>
  )
}
