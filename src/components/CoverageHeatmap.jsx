import { REQUIRED_MUSCLES } from '../data/workoutPlan.js'

// intensity: 0 none, 1 stabilizer/secondary, 2 primary low sets, 3 primary high sets
export default function CoverageHeatmap({ matrix }) {
  // matrix: { muscle: { Mon: level, ... } } — simplified to weekly level per muscle here
  const days = ['Mon', 'Tue', 'Thu', 'Fri', 'Sat']
  function color(l) {
    if (l >= 3) return '#22c55e'
    if (l === 2) return '#4ade80'
    if (l === 1) return '#eab308'
    return '#1e2126'
  }
  return (
    <div className="hscroll" style={{ border: '1px solid #2a2e34' }}>
      <table style={{ borderCollapse: 'collapse', minWidth: 420, width: '100%', fontSize: 12 }}>
        <thead>
          <tr>
            <th className="mono text-left p-2" style={{ position: 'sticky', left: 0, background: '#16191d', minWidth: 150 }}>MUSCLE</th>
            {days.map((d) => <th key={d} className="mono p-2">{d}</th>)}
          </tr>
        </thead>
        <tbody>
          {REQUIRED_MUSCLES.map((m) => (
            <tr key={m} style={{ borderTop: '1px solid #2a2e34' }}>
              <td className="p-2" style={{ position: 'sticky', left: 0, background: '#111316', fontSize: 12 }}>{m}</td>
              {days.map((d) => {
                const lvl = matrix?.[m]?.[d] ?? 0
                return (
                  <td key={d} className="p-1 text-center">
                    <span className="inline-block" title={`${m} ${d}: level ${lvl}`} style={{ width: 28, height: 20, background: color(lvl), border: '1px solid #2a2e34' }} />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
