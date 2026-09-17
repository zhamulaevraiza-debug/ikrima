import { HashRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { AppProvider, useApp } from './store/AppContext'
import { TabBar } from './components/TabBar'
import { Toast } from './components/Toast'
import { CatalogScreen } from './screens/CatalogScreen'
import { ProductScreen } from './screens/ProductScreen'
import { MeasureScreen } from './screens/MeasureScreen'
import { DoneScreen } from './screens/DoneScreen'
import { FittingScreen } from './screens/FittingScreen'
import { FabricsScreen } from './screens/FabricsScreen'
import { PortfolioScreen } from './screens/PortfolioScreen'
import { CartScreen } from './screens/CartScreen'
import { OrdersScreen } from './screens/OrdersScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { CabinetScreen } from './screens/CabinetScreen'
import { CabOrderScreen } from './screens/CabOrderScreen'

/** Routes that sit outside the customer's tab bar. */
const FULL_SCREEN = ['/done', '/cabinet']

function Shell() {
  const { pathname } = useLocation()
  const { ready } = useApp()
  const showTabs = !FULL_SCREEN.some((prefix) => pathname.startsWith(prefix))

  return (
    <div className="frame-page">
      <div className="frame">
        {/* Hold the frame blank for the one tick it takes to read stored data,
            rather than showing seed prices and stock that then change. */}
        {ready ? <Outlet /> : <div style={{ flex: 1 }} aria-busy="true" />}
        {showTabs ? <TabBar /> : null}
        <Toast />
      </div>
    </div>
  )
}

function Router() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<CatalogScreen />} />
        <Route path="product/:productId" element={<ProductScreen />} />
        <Route path="measure" element={<MeasureScreen />} />
        <Route path="done/:orderId" element={<DoneScreen />} />
        <Route path="fitting" element={<FittingScreen />} />
        <Route path="fabrics" element={<FabricsScreen />} />
        <Route path="portfolio" element={<PortfolioScreen />} />
        <Route path="cart" element={<CartScreen />} />
        <Route path="orders" element={<OrdersScreen />} />
        <Route path="profile" element={<ProfileScreen />} />
        <Route path="cabinet" element={<CabinetScreen />} />
        <Route path="cabinet/:orderId" element={<CabOrderScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      {/* Hash routing so the same build works on GitHub Pages, on a plain
          static host and from a file:// path, with no server rewrites. */}
      <HashRouter>
        <Router />
      </HashRouter>
    </AppProvider>
  )
}
