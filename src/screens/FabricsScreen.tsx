import { BackBar } from '../components/BackBar'
import { Screen, ScreenBody, ScreenHeader } from '../components/Screen'
import { Tap } from '../components/Tap'
import { useApp } from '../store/AppContext'
import { AMBER, GREEN, INK, ink, safeTop } from '../styles/tokens'

/** The fabric list: pick the cloth the tailoring request will be sewn from. */
export function FabricsScreen() {
  const { t, data, fabricId, selectFabric } = useApp()

  return (
    <Screen>
      <ScreenHeader style={{ padding: `${safeTop(18)} 20px 14px` }}>
        <BackBar title={t('Ткани')} to="/" />
      </ScreenHeader>

      <ScreenBody
        style={{ padding: '4px 20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        {data.fabrics.map((fabric) => {
          const selected = fabricId === fabric.id
          return (
            <Tap
              key={fabric.id}
              onClick={() => selectFabric(fabric.id)}
              aria-pressed={selected}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: 13,
                boxSizing: 'border-box',
                borderRadius: 12,
                background: '#fff',
                border: `1.3px solid ${selected ? INK : ink(0.14)}`,
              }}
            >
              <span
                style={{
                  width: 54,
                  height: 54,
                  flex: 'none',
                  borderRadius: 8,
                  background: fabric.color,
                  border: `1px solid ${ink(0.18)}`,
                  display: 'block',
                }}
              />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 13.5, fontWeight: 600 }}>
                  {fabric.full}
                </span>
                <span
                  style={{ display: 'block', marginTop: 3, fontSize: 11.5, color: ink(0.65) }}
                >
                  {fabric.spec}
                </span>
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: fabric.status === 'в наличии' ? GREEN : AMBER,
                }}
              >
                {fabric.status}
              </span>
            </Tap>
          )
        })}

        <div style={{ marginTop: 6, fontSize: 11.5, lineHeight: 1.55, color: ink(0.65) }}>
          Ткань можно привезти свою — тогда в заявке напишите состав и метраж.
        </div>
      </ScreenBody>
    </Screen>
  )
}
