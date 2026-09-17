import type { ReactNode } from 'react'
import { useApp } from '../store/AppContext'
import { TailorGateScreen } from '../screens/TailorGateScreen'

/**
 * Stands in front of the cabinet routes. Until the code has been entered this
 * session, any /cabinet address renders the gate instead — including a deep
 * link straight to one order.
 */
export function RequireTailor({ children }: { children: ReactNode }) {
  const { tailorUnlocked } = useApp()
  return tailorUnlocked ? <>{children}</> : <TailorGateScreen />
}
