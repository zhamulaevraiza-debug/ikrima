import { BackBar } from '../components/BackBar'
import { PhotoPlaceholder } from '../components/PhotoPlaceholder'
import { Screen, ScreenBody, ScreenHeader } from '../components/Screen'
import { useApp } from '../store/AppContext'
import { safeTop } from '../styles/tokens'

/** Past work: a two-column grid of finished pieces. Read-only. */
export function PortfolioScreen() {
  const { t, data } = useApp()

  return (
    <Screen>
      <ScreenHeader style={{ padding: `${safeTop(18)} 20px 14px` }}>
        <BackBar title={t('Мои работы')} to="/" />
      </ScreenHeader>

      <ScreenBody style={{ padding: '4px 20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {data.portfolio.map((w) => (
            <div key={w.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <PhotoPlaceholder caption={w.ph} radius={11} alpha={0.05} style={{ aspectRatio: '3/4' }} />
              <div style={{ fontSize: 11.5, fontWeight: 600 }}>{w.label}</div>
            </div>
          ))}
        </div>
      </ScreenBody>
    </Screen>
  )
}
