import { useLocation, useNavigate } from 'react-router-dom'
import { INK, PAPER, ink, safeBottom } from '../styles/tokens'
import { GridIcon, PersonIcon, RulerIcon, TagIcon } from './icons'
import { useApp } from '../store/AppContext'
import { Tap } from './Tap'

/** Routes where a tab counts as the current one. */
const TABS = [
  { to: '/', label: 'Каталог', Icon: GridIcon, match: ['/', '/product'] },
  { to: '/measure', label: 'Пошив', Icon: RulerIcon, match: ['/measure', '/fitting'] },
  { to: '/orders', label: 'Заказы', Icon: TagIcon, match: ['/orders'] },
  { to: '/profile', label: 'Профиль', Icon: PersonIcon, match: ['/profile'] },
] as const

export function TabBar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { t } = useApp()

  return (
    <nav
      aria-label="Разделы"
      style={{
        flex: 'none',
        padding: `10px 12px ${safeBottom(14)}`,
        background: PAPER,
        borderTop: `1px solid ${ink(0.14)}`,
        display: 'flex',
      }}
    >
      {TABS.map(({ to, label, Icon, match }) => {
        const active = match.some((m) => (m === '/' ? pathname === '/' : pathname.startsWith(m)))
        return (
          <Tap
            key={to}
            onClick={() => navigate(to)}
            aria-current={active ? 'page' : undefined}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              color: active ? INK : ink(0.62),
            }}
          >
            <Icon />
            <span style={{ fontSize: 10, fontWeight: 700 }}>{t(label)}</span>
          </Tap>
        )
      })}
    </nav>
  )
}
