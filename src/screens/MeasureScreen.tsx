import { useId } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActionBar, Screen, ScreenBody, ScreenHeader } from '../components/Screen'
import { BackBar } from '../components/BackBar'
import { FabricSwatches } from '../components/FabricSwatches'
import { PhotoPicker } from '../components/PhotoPicker'
import { Tap } from '../components/Tap'
import { GARMENT_FORMS, MEASURE_FIELDS } from '../data/seed'
import { filledOf } from '../lib/format'
import { useApp } from '../store/AppContext'
import { INK, ink, safeTop, YEL } from '../styles/tokens'

const SECTION_TITLE = { fontSize: 12.5, fontWeight: 700 } as const

export function MeasureScreen() {
  const navigate = useNavigate()
  // Prefix for the ids that tie each measurement to its own label and hint.
  const fieldId = useId()
  const {
    t,
    form,
    setForm,
    measurements,
    setMeasurement,
    filledCount,
    comment,
    setComment,
    garmentPhoto,
    referencePhoto,
    setPhoto,
    sendMeasurements,
  } = useApp()

  return (
    <Screen>
      <ScreenHeader style={{ padding: `${safeTop(18)} 20px 16px`, background: YEL }}>
        <BackBar title={t('Мерки с одежды')} to="/" />
        <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.5, color: ink(0.72) }}>
          Измерьте вещь, которая хорошо сидит, и впишите сантиметры. Нюансы посадки решим на примерке.
        </div>
      </ScreenHeader>

      <ScreenBody style={{ padding: '18px 20px 24px' }}>
        <div style={SECTION_TITLE}>{t('Форма')}</div>
        <div style={{ marginTop: 9, display: 'flex', gap: 8 }}>
          {GARMENT_FORMS.map((label) => {
            const selected = form === label
            return (
              <Tap
                key={label}
                onClick={() => setForm(label)}
                aria-pressed={selected}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 10,
                  textAlign: 'center',
                  border: `1.3px solid ${selected ? INK : ink(0.25)}`,
                  background: selected ? INK : '#fff',
                  color: selected ? YEL : INK,
                  fontSize: 12.5,
                  fontWeight: 600,
                }}
              >
                {label}
              </Tap>
            )
          })}
        </div>

        <div
          style={{
            marginTop: 22,
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}
        >
          <div style={SECTION_TITLE}>{t('Мерки с одежды, см')}</div>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: ink(0.62) }}>
            {filledOf(filledCount, MEASURE_FIELDS.length)}
          </div>
        </div>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MEASURE_FIELDS.map((f) => (
            <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                {/* The design's caption is the field's real label, and the line
                    under it describes where to hold the tape. */}
                <label
                  htmlFor={`${fieldId}${f.key}`}
                  style={{ display: 'block', fontSize: 12.5, fontWeight: 600 }}
                >
                  {f.label}
                </label>
                <div
                  id={`${fieldId}${f.key}-hint`}
                  style={{ marginTop: 2, fontSize: 10.5, color: ink(0.62), lineHeight: 1.35 }}
                >
                  {f.hint}
                </div>
              </div>
              <input
                id={`${fieldId}${f.key}`}
                aria-describedby={`${fieldId}${f.key}-hint`}
                value={measurements[f.key]}
                onChange={(e) => setMeasurement(f.key, e.currentTarget.value)}
                placeholder="0"
                inputMode="decimal"
                style={{
                  width: 74,
                  flex: 'none',
                  padding: '11px 12px',
                  borderRadius: 9,
                  border: `1.3px solid ${ink(0.25)}`,
                  background: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  textAlign: 'center',
                  color: INK,
                }}
              />
            </div>
          ))}
        </div>

        <div style={{ ...SECTION_TITLE, marginTop: 22 }}>{t('Фото вещи и референс')}</div>
        <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
          <PhotoPicker
            label="+ фото вашей вещи"
            slot="garment"
            photo={garmentPhoto}
            onChange={(photo) => setPhoto('garment', photo)}
          />
          <PhotoPicker
            label="+ образец модели"
            slot="reference"
            photo={referencePhoto}
            onChange={(photo) => setPhoto('reference', photo)}
          />
        </div>

        <div style={{ ...SECTION_TITLE, marginTop: 22 }}>{t('Ткань')}</div>
        <div style={{ marginTop: 10 }}>
          <FabricSwatches />
        </div>

        <label
          htmlFor={`${fieldId}comment`}
          style={{ ...SECTION_TITLE, marginTop: 22, display: 'block' }}
        >
          {t('Комментарий')}
        </label>
        <textarea
          id={`${fieldId}comment`}
          value={comment}
          onChange={(e) => setComment(e.currentTarget.value)}
          placeholder="Длина рукава как на фото, воротник пониже…"
          style={{
            marginTop: 10,
            width: '100%',
            boxSizing: 'border-box',
            height: 78,
            padding: 12,
            borderRadius: 10,
            border: `1.3px solid ${ink(0.25)}`,
            background: '#fff',
            fontSize: 12.5,
            lineHeight: 1.5,
            resize: 'none',
            color: INK,
          }}
        />

        <Tap
          onClick={() => navigate('/fitting')}
          style={{
            display: 'block',
            width: '100%',
            boxSizing: 'border-box',
            marginTop: 16,
            padding: 14,
            borderRadius: 11,
            border: `1.4px solid ${INK}`,
            textAlign: 'center',
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          Записаться на примерку в Шатое
        </Tap>
      </ScreenBody>

      <ActionBar>
        <Tap
          onClick={() => {
            const id = sendMeasurements()
            if (id) navigate(`/done/${id}`)
          }}
          style={{
            flex: 1,
            padding: 15,
            borderRadius: 11,
            background: INK,
            color: YEL,
            textAlign: 'center',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {t('Отправить заявку')}
        </Tap>
      </ActionBar>
    </Screen>
  )
}
