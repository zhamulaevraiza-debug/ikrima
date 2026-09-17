import { INK, YEL, ink } from '../styles/tokens'

/**
 * The dotted progress line on a customer's order.
 *
 * Driven entirely by the labels it is given, so a made-to-measure order shows
 * five workshop stages and a ready-made one shows its four delivery stages.
 */
export function StageStepper({ stages, stage }: { stages: readonly string[]; stage: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {stages.map((label, i) => {
        const done = i <= stage
        return (
          <div
            key={label}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
          >
            <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: i === 0 ? 'transparent' : done ? INK : ink(0.15),
                }}
              />
              <div
                style={{
                  width: 11,
                  height: 11,
                  flex: 'none',
                  borderRadius: '50%',
                  background: done ? YEL : 'transparent',
                  border: `1.5px solid ${done ? INK : ink(0.3)}`,
                }}
              />
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background:
                    i === stages.length - 1 ? 'transparent' : i < stage ? INK : ink(0.15),
                }}
              />
            </div>
            <span
              style={{ fontSize: 8.5, color: done ? INK : ink(0.4), textAlign: 'center' }}
            >
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
