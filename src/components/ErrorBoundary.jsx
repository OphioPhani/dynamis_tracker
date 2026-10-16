import { Component } from 'react'

// Isolates visualization crashes: a WebGL/anatomy failure shows a fallback
// card instead of blanking the entire Muscles page (or app).
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { crashed: false }
  }
  static getDerivedStateFromError() {
    return { crashed: true }
  }
  componentDidCatch(err) {
    try { console.error('Anatomy viewer crashed:', err) } catch {}
    this.props.onCrash?.()
  }
  render() {
    if (this.state.crashed) {
      return (
        <div className="p-4 text-center" style={{ background: '#0f1113', border: '1px solid #ef4444' }} role="alert">
          <div className="font-black">ANATOMY VIEWER ERROR</div>
          <div className="text-xs text-mut mt-1">The 3D viewer crashed on this device. Your workouts and analytics below keep working.</div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button className="btn" onClick={() => this.setState({ crashed: false })}>RETRY ANATOMY</button>
            <a href="#muscle-list" className="btn text-center">VIEW MUSCLE LIST</a>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
