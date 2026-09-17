import { INK, ink } from '../styles/tokens'
import { useApp } from '../store/AppContext'
import { Tap } from './Tap'

/** The row of round fabric samples shown under a product and on the form. */
export function FabricSwatches() {
  const { data, fabricId, selectFabric } = useApp()

  return (
    <div style={{ display: 'flex', gap: 14 }}>
      {data.fabrics.map((fabric) => {
        const selected = fabricId === fabric.id
        return (
          <Tap
            key={fabric.id}
            onClick={() => selectFabric(fabric.id)}
            aria-pressed={selected}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
          >
            <span
              style={{
                width: 46,
                height: 46,
                borderRadius: '50%',
                background: fabric.color,
                border: `2px solid ${selected ? INK : 'transparent'}`,
                boxShadow: `inset 0 0 0 1px ${ink(0.12)}`,
                display: 'block',
              }}
            />
            <span style={{ fontSize: 10, color: ink(0.6) }}>{fabric.name}</span>
          </Tap>
        )
      })}
    </div>
  )
}
