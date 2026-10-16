export const APP_NAME = 'Dynamis Tracker'
export const APP_SHORT = 'Dynamis'
export const APP_TAGLINE = 'Train. Track. Progress.'

export function LogoMark({ size = 40 }) {
  return (
    <img
      src="/logo-mark.svg"
      alt="Dynamis Tracker logo"
      width={size}
      height={size}
      style={{ width: size, height: size, display: 'block', flexShrink: 0 }}
    />
  )
}

export function LogoFull({ height = 44 }) {
  return (
    <img
      src="/logo.svg"
      alt="Dynamis Tracker"
      style={{ height, display: 'block' }}
    />
  )
}

export function LoadingScreen({ label = 'LOADING...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6" style={{ background: '#09090B' }}>
      <LogoMark size={72} />
      <div className="font-black tracking-widest text-lg">DYNAMIS TRACKER</div>
      <div className="mono text-xs text-mut">{label}</div>
    </div>
  )
}
