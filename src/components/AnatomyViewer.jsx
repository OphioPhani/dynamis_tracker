// Real 3D anatomy viewer for Dynamis Tracker.
// Geometry: BodyParts3D 4.0 (c) Database Center for Life Science, CC BY 4.0,
// repacked to /public/models/dynamis-muscles.{json,bin} (161 unique
// named muscle meshes, 38 canonical muscles). No fake hitboxes: raycasting
// hits the actual anatomical mesh; selection resolves mesh -> canonical id.
// Vanilla three.js (no R3F) to keep the mobile bundle lean. Touch-first:
// 1-finger rotate, pinch zoom, 2-finger pan. DPR capped. Lazy + progress.
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { MODEL_URL_BASE } from '../data/anatomyMapping.js'

const FRONT_AZIMUTH = 0 // camera on +z (anatomical front)
const BACK_AZIMUTH = Math.PI

export default function AnatomyViewer({
  colors, selected, viewSignal, focusSignal, resetSignal, zoomSignal, onSelect, onReady, onProgress, onError, height = 420
}) {
  const mountRef = useRef(null)
  const apiRef = useRef(null)
  const mountGen = useRef(0)
  const cbRef = useRef({ colors, selected, onSelect, onReady, onProgress, onError })
  cbRef.current = { colors, selected, onSelect, onReady, onProgress, onError }

  // Apply colors + selection to the live scene.
  useEffect(() => {
    apiRef.current?.applyColors(colors, selected)
  }, [colors, selected])

  // Front/back rotation requests { view: 'front'|'back', nonce }.
  useEffect(() => {
    if (viewSignal) apiRef.current?.rotateTo(viewSignal.view === 'back' ? BACK_AZIMUTH : FRONT_AZIMUTH)
  }, [viewSignal])

  // Search focus requests { canonical, nonce }.
  useEffect(() => {
    if (focusSignal) apiRef.current?.focusMuscle(focusSignal.canonical)
  }, [focusSignal])

  // Reset-view requests { nonce }.
  useEffect(() => {
    if (resetSignal) apiRef.current?.reset()
  }, [resetSignal])

  // Zoom requests { delta, nonce } (explicit +/- buttons; pinch also works).
  useEffect(() => {
    if (zoomSignal) apiRef.current?.dolly(zoomSignal.delta)
  }, [zoomSignal])

  useEffect(() => {
    // Generation guard: with StrictMode double-mount (dev) or HMR remounts,
    // only the LATEST effect run may claim the mount/api. A stale run that
    // finishes late must dispose itself instead of hijacking a live scene.
    const myGen = ++mountGen.current
    const alive = () => !dead && myGen === mountGen.current
    let dead = false
    const aborter = new AbortController()
    let renderer = null, scene = null, camera = null, controls = null, raf = 0
    let canvasEl = null
    const meshes = []
    const clock = { tween: null }
    const dispose = () => {
      cancelAnimationFrame(raf)
      try { controls?.dispose?.() } catch {}
      for (const mesh of meshes) {
        try { mesh.geometry.dispose() } catch {}
        try { mesh.material.dispose() } catch {}
      }
      meshes.length = 0
      try { renderer?.dispose?.() } catch {}
      // Remove OUR canvas even if the async never finished (StrictMode-safe).
      try { if (canvasEl && canvasEl.parentNode) canvasEl.parentNode.removeChild(canvasEl) } catch {}
      renderer = scene = camera = controls = canvasEl = null
    }
    ;(async () => {
      const mount = mountRef.current
      if (!mount) return
      // Single-canvas guarantee: drop any stale canvas (HMR/StrictMode remnant).
      mount.querySelectorAll('canvas').forEach((c) => { try { c.parentNode?.removeChild(c) } catch {} })
      const W = mount.clientWidth || 320
      const H = height
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
      renderer.setClearColor(0x0f1113, 1)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setSize(W, H)
      canvasEl = renderer.domElement
      canvasEl.style.display = 'block'
      canvasEl.style.width = '100%'
      canvasEl.style.touchAction = 'none'
      mount.appendChild(canvasEl)

      scene = new THREE.Scene()
      scene.background = new THREE.Color(0x0f1113)
      camera = new THREE.PerspectiveCamera(38, W / H, 0.01, 50)
      camera.position.set(0, 0.82, 2.6)

      controls = new OrbitControls(camera, canvasEl)
      controls.target.set(0, 0.8, 0)
      controls.enableDamping = true
      controls.dampingFactor = 0.12
      controls.minDistance = 0.25
      controls.maxDistance = 8
      controls.enablePan = true
      controls.update()

      scene.add(new THREE.HemisphereLight(0xffffff, 0x223344, 1.15))
      const key = new THREE.DirectionalLight(0xffffff, 1.6)
      key.position.set(-1.5, 2.5, 2.5)
      scene.add(key)
      const rim = new THREE.DirectionalLight(0x88aaff, 0.7)
      rim.position.set(1.5, 1.2, -2.5)
      scene.add(rim)

      const report = (p) => { if (alive()) cbRef.current.onProgress?.(p) }
      // Manifest (small JSON)
      report({ stage: 'manifest', loaded: 0, total: 1 })
      const manRes = await fetch(`${MODEL_URL_BASE}.json`, { signal: aborter.signal })
      if (!manRes.ok) throw new Error('manifest')
      const manifest = await manRes.json()
      if (!alive()) { dispose(); return }
      report({ stage: 'manifest', loaded: 1, total: 1 })

      // Binary with progress
      const binRes = await fetch(`${MODEL_URL_BASE}.bin`, { signal: aborter.signal })
      if (!binRes.ok) throw new Error('geometry')
      const total = Number(binRes.headers.get('content-length') || 0)
      const reader = binRes.body.getReader()
      const chunks = []
      let received = 0
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
        received += value.length
        report({ stage: 'geometry', loaded: received, total })
      }
      const blob = new Blob(chunks)
      const buffer = await blob.arrayBuffer()

      const group = new THREE.Group()
      for (const m of manifest.meshes) {
        const geo = new THREE.BufferGeometry()
        const pos = new Uint16Array(buffer, m.posOff, m.count * 3)
        const posArr = new Float32Array(m.count * 3)
        const sx = m.max[0] - m.min[0] || 1e-9
        const sy = m.max[1] - m.min[1] || 1e-9
        const sz = m.max[2] - m.min[2] || 1e-9
        for (let i = 0; i < m.count * 3; i += 3) {
          posArr[i] = m.min[0] + (pos[i] / 65535) * sx
          posArr[i + 1] = m.min[1] + (pos[i + 1] / 65535) * sy
          posArr[i + 2] = m.min[2] + (pos[i + 2] / 65535) * sz
        }
        geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
        geo.setAttribute('normal', new THREE.BufferAttribute(new Int16Array(buffer, m.nrmOff, m.count * 3), 3, true))
        geo.setIndex(new THREE.BufferAttribute(new Uint16Array(buffer, m.idxOff, m.indexCount), 1))
        geo.computeBoundingSphere()
        const mat = new THREE.MeshStandardMaterial({ color: 0x3a3f46, roughness: 0.55, metalness: 0.05, side: THREE.DoubleSide })
        const mesh = new THREE.Mesh(geo, mat)
        mesh.userData = { canonicals: m.canonicals, primary: m.canonicals[0], side: m.side, meshName: m.name, label: m.label }
        group.add(mesh)
        meshes.push(mesh)
      }
      scene.add(group)

      const raycaster = new THREE.Raycaster()
      const pointer = new THREE.Vector2()
      let downAt = null
      const el = canvasEl
      el.addEventListener('pointerdown', (e) => { downAt = { x: e.clientX, y: e.clientY, t: Date.now() } })
      el.addEventListener('pointerup', (e) => {
        if (!downAt) return
        const moved = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y)
        downAt = null
        if (moved > 10) return // was a drag, not a tap (no time limit: slow taps still count)
        const r = el.getBoundingClientRect()
        pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1
        pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1
        raycaster.setFromCamera(pointer, camera)
        const hits = raycaster.intersectObjects(meshes, false)
        if (hits.length) {
          const u = hits[0].object.userData
          cbRef.current.onSelect?.({ canonical: u.primary, meshName: u.meshName, label: u.label })
        }
      })

      const tmpBox = new THREE.Box3()
      const modelBox = new THREE.Box3()
      const modelCenter = new THREE.Vector3()
      let modelRadius = 1
      function fitCameraToModel(azimuth) {
        modelBox.setFromObject(group)
        if (modelBox.isEmpty()) return false
        modelBox.getCenter(modelCenter)
        const size = modelBox.getSize(new THREE.Vector3())
        modelRadius = Math.max(size.x, size.y, size.z) / 2
        // Frame the model with margin; near/far derived from real bounds.
        const dist = Math.max(0.3, (modelRadius / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) * 1.35)
        camera.near = Math.max(0.01, dist - modelRadius * 4)
        camera.far = dist + modelRadius * 20 + 10
        camera.updateProjectionMatrix()
        controls.target.copy(modelCenter)
        const az = azimuth ?? Math.atan2(camera.position.x - modelCenter.x, camera.position.z - modelCenter.z)
        camera.position.set(
          modelCenter.x + Math.sin(az) * dist,
          modelCenter.y + modelRadius * 0.05,
          modelCenter.z + Math.cos(az) * dist
        )
        controls.update()
        return true
      }
      const api = {
        // Render priority (no movement, no camera change, no extra passes):
        // selected meshes draw last (renderOrder 999) with a slight depth
        // bias so they read as foreground in place. depthTest stays ON for
        // believable occlusion. Non-selected anatomy is dimmed (~55%) while
        // a selection is active; clearing restores everything exactly.
        applyColors(colorMap, sel) {
          const entryOf = (id) => (colorMap?.get ? colorMap.get(id) : colorMap?.[id]);
          const hasSel = !!(sel && sel.canonical)
          for (const mesh of meshes) {
            const u = mesh.userData
            const ids = u.canonicals || [u.canonical].filter(Boolean)
            const isSel = hasSel && ids.includes(sel.canonical)
            if (isSel) {
              mesh.renderOrder = 999
              mesh.material.color.set('#3b82f6')
              mesh.material.emissive.set('#1d4ed8')
              mesh.material.emissiveIntensity = 1.0
              mesh.material.polygonOffset = true
              mesh.material.polygonOffsetFactor = -2
              mesh.material.polygonOffsetUnits = -2
            } else {
              let best = null
              for (const id of ids) {
                const e = entryOf(id)
                if (e && (best === null || e.rank < best.rank)) best = e
              }
              const c = best ? best.color : '#3a3f46'
              mesh.renderOrder = 0
              if (hasSel) {
                mesh.material.color.set(c).multiplyScalar(0.55)
                mesh.material.emissive.set(c)
                mesh.material.emissiveIntensity = 0.08
              } else {
                mesh.material.color.set(c)
                mesh.material.emissive.set(c)
                mesh.material.emissiveIntensity = best ? 0.35 : 0
              }
              if (mesh.material.polygonOffset) {
                mesh.material.polygonOffset = false
                mesh.material.polygonOffsetFactor = 0
                mesh.material.polygonOffsetUnits = 0
              }
            }
          }
        },
        rotateTo(azimuth) {
          const off = camera.position.clone().sub(controls.target)
          const start = Math.atan2(off.x, off.z)
          let delta = ((azimuth - start + Math.PI * 3) % (Math.PI * 2)) - Math.PI
          const dist = off.length()
          const t0 = performance.now()
          clock.tween = { t0, dur: 650, step: (k) => {
            const a = start + delta * k
            camera.position.set(
              controls.target.x + Math.sin(a) * dist,
              camera.position.y,
              controls.target.z + Math.cos(a) * dist
            )
          } }
        },
        focusMuscle(canonical) {
          // Gentle recenter only: keeps orientation AND distance (no zoom
          // jumps on selection). Side rotation is handled by FRONT/BACK.
          const list = meshes.filter((m) => (m.userData.canonicals || []).includes(canonical))
          if (!list.length) return
          tmpBox.makeEmpty()
          for (const m of list) tmpBox.expandByObject(m)
          const center = tmpBox.getCenter(new THREE.Vector3())
          const dir = camera.position.clone().sub(controls.target).normalize()
          const dist = camera.position.clone().sub(controls.target).length()
          const t0 = performance.now()
          const fromT = controls.target.clone()
          clock.tween = { t0, dur: 500, step: (k) => {
            controls.target.lerpVectors(fromT, center, k)
            camera.position.copy(controls.target).addScaledVector(dir, dist)
          } }
        },
        reset() {
          fitCameraToModel(FRONT_AZIMUTH)
        },
        dolly(factor) {
          const off = camera.position.clone().sub(controls.target)
          const len = Math.max(controls.minDistance, Math.min(controls.maxDistance, off.length() * factor))
          camera.position.copy(controls.target).addScaledVector(off.normalize(), len)
        }
      }
      // Only the latest mount generation may claim the shared api ref.
      // A stale run that finishes late disposes itself instead of hijacking
      // the live scene (this was the highlight/black-viewport race).
      if (!alive()) { dispose(); return }
      apiRef.current = api
      api._gen = myGen
      api.applyColors(cbRef.current.colors, cbRef.current.selected)
      // Center + frame the REAL model bounds (never assume origin).
      fitCameraToModel(FRONT_AZIMUTH)
      // Debug handle (scene introspection for automated verification).
      apiRef.current._three = { scene, camera, renderer, controls, meshes, THREE }
      try { window.__dynamisViewer = apiRef.current } catch {}

      const ro = new ResizeObserver(() => {
        if (!alive() || !mount) return
        const w = mount.clientWidth || 320
        camera.aspect = w / H
        camera.updateProjectionMatrix()
        renderer.setSize(w, H)
      })
      ro.observe(mount)

      // Readiness: LOADED (meshes) -> RENDERING (first frame) -> READY
      // (several real frames on a non-zero canvas). READY is only reported
      // after actual pixels have been drawn.
      let framesDrawn = 0
      let readyFired = false
      const loop = () => {
        if (!alive()) return
        raf = requestAnimationFrame(loop)
        window.__dynamisFrames = (window.__dynamisFrames || 0) + 1
        const tw = clock.tween
        if (tw) {
          const k = Math.min(1, (performance.now() - tw.t0) / tw.dur)
          tw.step(k < 0.5 ? 2 * k * k : 1 - ((-2 * k + 2) ** 2) / 2)
          if (k >= 1) clock.tween = null
        }
        controls.update()
        renderer.render(scene, camera)
        framesDrawn++
        if (framesDrawn === 1) cbRef.current.onProgress?.({ stage: 'rendering', loaded: 1, total: 1 })
        if (framesDrawn === 8 && !readyFired && alive() && renderer.domElement.clientWidth > 0) {
          readyFired = true
          cbRef.current.onReady?.({ meshes: meshes.length, canvas: [renderer.domElement.clientWidth, renderer.domElement.clientHeight] })
        }
      }
      loop()
      // Debug introspection (used by automated visual verification).
      try {
        const box = new THREE.Box3().setFromObject(group)
        const c = box.getCenter(new THREE.Vector3())
        const s = box.getSize(new THREE.Vector3())
        window.__dynamisAnatomy = () => ({
          meshes: meshes.length,
          visibleMeshes: meshes.filter((m) => m.visible).length,
          bbox: { min: box.min.toArray(), max: box.max.toArray(), center: [c.x, c.y, c.z], size: [s.x, s.y, s.z] },
          camera: camera.position.toArray(),
          target: controls.target.toArray(),
          canvas: [renderer.domElement.clientWidth, renderer.domElement.clientHeight, renderer.domElement.width, renderer.domElement.height],
          frames: window.__dynamisFrames || 0,
          gl: renderer.getContext().getParameter(renderer.getContext().VERSION)
        })
      } catch {}
      // NOTE: onReady now fires from the render loop after real frames.

      apiRef.current._dispose = () => {
        try { ro.disconnect() } catch {}
        dispose()
      }
    })().catch((e) => {
      if (e && e.name === 'AbortError') return // superseded mount; silent
      if (alive()) cbRef.current.onError?.(e)
    })

    return () => {
      dead = true
      try { aborter.abort() } catch {}
      cancelAnimationFrame(raf)
      try { apiRef.current?._dispose?.() } catch {}
      // Only the owning run clears the shared ref.
      if (apiRef.current && apiRef.current._gen === myGen) apiRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={mountRef} style={{ width: '100%', height, background: '#0f1113', border: '1px solid #2a2e34', overflow: 'hidden' }} />
}
