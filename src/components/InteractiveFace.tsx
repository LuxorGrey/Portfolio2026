import { useEffect, useRef } from 'react'
import centerUrl from '../assets/face/oscar-face-center.webp'
import leftUrl from '../assets/face/oscar-face-left.webp'
import rightUrl from '../assets/face/oscar-face-right.webp'
import upUrl from '../assets/face/oscar-face-up.webp'
import downUrl from '../assets/face/oscar-face-down.webp'
import blinkUrl from '../assets/face/oscar-face-blink.webp'
import angry1Url from '../assets/face/oscar-face-angry-1.webp'
import angry2Url from '../assets/face/oscar-face-angry-2.webp'
import angry3Url from '../assets/face/oscar-face-angry-3.webp'
import tongueUrl from '../assets/face/oscar-face-tongue.webp'

const SIZE = 640
type FrameName = 'center' | 'left' | 'right' | 'up' | 'down' | 'blink' | 'angry1' | 'angry2' | 'angry3' | 'tongue'
type Frames = { center: HTMLCanvasElement } & Partial<Record<Exclude<FrameName, 'center'>, HTMLCanvasElement>>
type Point = { x: number; y: number }

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function paintTriangle(
  context: CanvasRenderingContext2D,
  source: HTMLCanvasElement,
  a: Point,
  b: Point,
  c: Point,
  da: Point,
  db: Point,
  dc: Point,
) {
  const determinant = (a.x - c.x) * (b.y - c.y) - (b.x - c.x) * (a.y - c.y)
  if (!determinant) return
  const transformA =
    ((da.x - dc.x) * (b.y - c.y) - (db.x - dc.x) * (a.y - c.y)) / determinant
  const transformB =
    ((da.y - dc.y) * (b.y - c.y) - (db.y - dc.y) * (a.y - c.y)) / determinant
  const transformC =
    ((db.x - dc.x) * (a.x - c.x) - (da.x - dc.x) * (b.x - c.x)) / determinant
  const transformD =
    ((db.y - dc.y) * (a.x - c.x) - (da.y - dc.y) * (b.x - c.x)) / determinant
  const transformE = dc.x - transformA * c.x - transformC * c.y
  const transformF = dc.y - transformB * c.x - transformD * c.y

  context.save()
  context.beginPath()
  context.moveTo(da.x, da.y)
  context.lineTo(db.x, db.y)
  context.lineTo(dc.x, dc.y)
  context.closePath()
  context.clip()
  context.setTransform(
    transformA,
    transformB,
    transformC,
    transformD,
    transformE,
    transformF,
  )
  context.drawImage(source, 0, 0)
  context.restore()
}

function warpRegion(
  context: CanvasRenderingContext2D,
  source: HTMLCanvasElement,
  anchor: Point,
  pull: Point,
  showMesh: boolean,
) {
  const radius = 160
  const left = Math.max(0, anchor.x - radius)
  const top = Math.max(0, anchor.y - radius)
  const right = Math.min(SIZE, anchor.x + radius)
  const bottom = Math.min(SIZE, anchor.y + radius)
  const columns = 10
  const rows = 10
  const cellWidth = (right - left) / columns
  const cellHeight = (bottom - top) / rows

  // Replace the source region rather than drawing a shifted eye over its original.
  context.clearRect(left, top, right - left, bottom - top)

  function warped(point: Point): Point {
    const distance = Math.hypot(point.x - anchor.x, point.y - anchor.y)
    const influence = Math.max(0, 1 - (distance / radius) ** 2) ** 2
    return { x: point.x + pull.x * influence, y: point.y + pull.y * influence }
  }

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const x = left + column * cellWidth
      const y = top + row * cellHeight
      const a = { x, y }
      const b = { x: x + cellWidth, y }
      const c = { x, y: y + cellHeight }
      const d = { x: x + cellWidth, y: y + cellHeight }
      const wa = warped(a)
      const wb = warped(b)
      const wc = warped(c)
      const wd = warped(d)
      paintTriangle(context, source, a, b, c, wa, wb, wc)
      paintTriangle(context, source, d, c, b, wd, wc, wb)
    }
  }
  if (!showMesh) return

  // Reveal the same deformation mesh while the user is pulling the portrait.
  context.save()
  context.globalCompositeOperation = 'source-atop'
  context.strokeStyle = 'rgba(215, 226, 234, 0.42)'
  context.lineWidth = 0.75
  for (let row = 0; row <= rows; row++) {
    context.beginPath()
    for (let column = 0; column <= columns; column++) {
      const point = warped({ x: left + column * cellWidth, y: top + row * cellHeight })
      if (column === 0) context.moveTo(point.x, point.y)
      else context.lineTo(point.x, point.y)
    }
    context.stroke()
  }
  for (let column = 0; column <= columns; column++) {
    context.beginPath()
    for (let row = 0; row <= rows; row++) {
      const point = warped({ x: left + column * cellWidth, y: top + row * cellHeight })
      if (row === 0) context.moveTo(point.x, point.y)
      else context.lineTo(point.x, point.y)
    }
    context.stroke()
  }
  context.restore()
}

function loadFrame(url: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = SIZE
      canvas.height = SIZE
      canvas.getContext('2d')?.drawImage(image, 0, 0, SIZE, SIZE)
      resolve(canvas)
    }
    image.onerror = reject
    image.src = url
  })
}

export default function InteractiveFace({ ariaLabel, onDragChange }: { ariaLabel: string; onDragChange?: (dragging: boolean) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mobileTouchRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const fallbackRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const mobileTouch = mobileTouchRef.current
    const layer = layerRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !layer || !context) return

    let disposed = false
    let animationFrame = 0
    let frames: Frames | null = null
    const gaze = { x: 0, y: 0 }
    let targetGaze = { x: 0, y: 0 }
    const pull = { x: 0, y: 0 }
    let targetPull = { x: 0, y: 0 }
    let dragAnchor: Point | null = null
    let pressedAnchor: Point | null = null
    let lastDragAnchor: Point = { x: 0, y: 0 }
    let activePointerId: number | null = null
    let activeTarget: HTMLElement | null = null
    let dragOrigin = { x: 0, y: 0 }
    let pointerOrigin = { x: 0, y: 0 }
    let dragStarted = 0
    let tongueUntil = 0
    let alphaMap: Uint8ClampedArray | null = null
    let nextBlink = performance.now() + 2000 + Math.random() * 1000
    let blinkUntil = 0
    let visible = true
    let lastPaint = { x: NaN, y: NaN, pullX: NaN, pullY: NaN, blink: false, angry: -1, tongue: false }
    const motionPreference = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )
    const snapshot = document.createElement('canvas')
    snapshot.width = SIZE
    snapshot.height = SIZE
    const snapshotContext = snapshot.getContext('2d')

    function angerIndex(now: number) {
      return dragAnchor === null ? -1 : Math.floor((now - dragStarted) / 450) % 3
    }

    function draw() {
      if (!frames || !context || !snapshotContext || !canvas) return
      const now = performance.now()
      context.clearRect(0, 0, SIZE, SIZE)
      const horizontal = Math.abs(targetGaze.x) >= Math.abs(targetGaze.y)
      const strength = horizontal ? Math.abs(targetGaze.x) : Math.abs(targetGaze.y)
      const direction = strength < 0.14
        ? frames.center
        : horizontal
          ? targetGaze.x < 0 ? frames.left ?? frames.center : frames.right ?? frames.center
          : targetGaze.y < 0 ? frames.up ?? frames.center : frames.down ?? frames.center
      const angry = angerIndex(now)
      const frame = tongueUntil > now ? frames.tongue ?? direction
        : angry === 0 ? frames.angry1 ?? direction
        : angry === 1 ? frames.angry2 ?? direction
          : angry === 2 ? frames.angry3 ?? direction
            : blinkUntil > now ? frames.blink ?? direction : direction
      // Each state is one complete frame: no iris, mouth, or face overlays.
      context.drawImage(frame, 0, 0)

      if (tongueUntil <= now && (dragAnchor !== null || Math.hypot(pull.x, pull.y) > 0.3)) {
        snapshotContext.clearRect(0, 0, SIZE, SIZE)
        snapshotContext.drawImage(canvas, 0, 0)
        warpRegion(context, snapshot, dragAnchor ?? lastDragAnchor, pull, dragAnchor !== null)
      }
    }

    function tick(now: number) {
      if (disposed) return
      const ease = motionPreference.matches ? 1 : 0.13
      gaze.x += (targetGaze.x - gaze.x) * ease
      gaze.y += (targetGaze.y - gaze.y) * ease
      pull.x += (targetPull.x - pull.x) * 0.22
      pull.y += (targetPull.y - pull.y) * 0.22

      if (visible && now >= nextBlink && tongueUntil <= now && dragAnchor === null) {
        blinkUntil = now + 110
        nextBlink = now + 2000 + Math.random() * 1000
      }

      if (
        visible &&
        (Math.abs(targetGaze.x - lastPaint.x) > 0.005 ||
          Math.abs(targetGaze.y - lastPaint.y) > 0.005 ||
          Math.abs(pull.x - lastPaint.pullX) > 0.2 ||
          Math.abs(pull.y - lastPaint.pullY) > 0.2 ||
          (blinkUntil > now) !== lastPaint.blink ||
          angerIndex(now) !== lastPaint.angry ||
          (tongueUntil > now) !== lastPaint.tongue)
      ) {
        draw()
        lastPaint = {
          x: targetGaze.x,
          y: targetGaze.y,
          pullX: pull.x,
          pullY: pull.y,
          blink: blinkUntil > now,
          angry: angerIndex(now),
          tongue: tongueUntil > now,
        }
      }
      if (visible && !motionPreference.matches && dragAnchor === null) {
        layer!.style.transform = `translate3d(${gaze.x * 13}px, ${gaze.y * 11 + Math.sin(now / 850) * 3}px, 0) rotateY(${gaze.x * 7}deg) rotateX(${-gaze.y * 5}deg)`
      } else if (dragAnchor !== null || motionPreference.matches) {
        layer!.style.transform = ''
      }
      animationFrame = requestAnimationFrame(tick)
    }

    function onWindowPointerMove(event: PointerEvent) {
      const rect = canvas!.getBoundingClientRect()
      targetGaze = {
        x: clamp(
          (event.clientX - (rect.left + rect.width / 2)) /
            (window.innerWidth * 0.42),
          -1,
          1,
        ),
        y: clamp(
          (event.clientY - (rect.top + rect.height / 2)) /
            (window.innerHeight * 0.42),
          -1,
          1,
        ),
      }
      if (visible) draw()
    }

    function localPoint(event: PointerEvent): Point {
      const rect = canvas!.getBoundingClientRect()
      return {
        x: ((event.clientX - rect.left) / rect.width) * SIZE,
        y: ((event.clientY - rect.top) / rect.height) * SIZE,
      }
    }

    function isOnFace(point: Point) {
      if (!alphaMap || point.x < 0 || point.y < 0 || point.x >= SIZE || point.y >= SIZE) return false
      const pixel = (Math.floor(point.y) * SIZE + Math.floor(point.x)) * 4
      return alphaMap[pixel + 3] > 40
    }

    function onPointerDown(event: PointerEvent) {
      if (activePointerId !== null) return
      const point = localPoint(event)
      if (!isOnFace(point)) return
      pressedAnchor = point
      dragOrigin = point
      pointerOrigin = { x: event.clientX, y: event.clientY }
      activePointerId = event.pointerId
      activeTarget = event.currentTarget as HTMLElement
      activeTarget.setPointerCapture(event.pointerId)
      event.preventDefault()
    }

    function onFacePointerMove(event: PointerEvent) {
      const point = localPoint(event)
      if (pressedAnchor === null || event.pointerId !== activePointerId) {
        ;(event.currentTarget as HTMLElement).style.cursor = isOnFace(point) ? 'grab' : 'default'
        return
      }
      if (dragAnchor === null && Math.hypot(event.clientX - pointerOrigin.x, event.clientY - pointerOrigin.y) >= 8) {
        dragAnchor = pressedAnchor
        lastDragAnchor = pressedAnchor
        dragStarted = performance.now()
        tongueUntil = 0
        activeTarget?.classList.add('is-pulling')
        onDragChange?.(true)
      }
      if (dragAnchor === null) return
      targetPull = {
        x: clamp(point.x - dragOrigin.x, -90, 90),
        y: clamp(point.y - dragOrigin.y, -80, 80),
      }
    }

    function onPointerUp(event: PointerEvent) {
      if (event.pointerId !== activePointerId) return
      const wasDrag = dragAnchor !== null
      const wasShortClick = event.type === 'pointerup' && !wasDrag
      dragAnchor = null
      pressedAnchor = null
      activePointerId = null
      activeTarget = null
      targetPull = { x: 0, y: 0 }
      if (wasShortClick) {
        tongueUntil = performance.now() + 1000
        blinkUntil = 0
      }
      const releasedTarget = event.currentTarget as HTMLElement
      releasedTarget.classList.remove('is-pulling')
      releasedTarget.style.cursor = 'grab'
      if (wasDrag) onDragChange?.(false)
      draw()
    }

    canvas.width = SIZE
    canvas.height = SIZE
    loadFrame(centerUrl).then((center) => {
      if (disposed) return
      frames = { center }
      alphaMap = center.getContext('2d')?.getImageData(0, 0, SIZE, SIZE).data ?? null
      draw()
      if (fallbackRef.current) fallbackRef.current.style.visibility = 'hidden'
      const remaining: [Exclude<FrameName, 'center'>, string][] = [
        ['left', leftUrl], ['right', rightUrl], ['up', upUrl], ['down', downUrl],
        ['blink', blinkUrl], ['angry1', angry1Url], ['angry2', angry2Url],
        ['angry3', angry3Url], ['tongue', tongueUrl],
      ]
      for (const [name, url] of remaining) {
        loadFrame(url).then((frame) => {
          if (disposed || !frames) return
          frames[name] = frame
          lastPaint.x = NaN
          if (visible) draw()
        }).catch(() => { /* Keep the center frame if an optional image fails. */ })
      }
    })
    window.addEventListener('pointermove', onWindowPointerMove, {
      passive: true,
    })
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onFacePointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)
    canvas.addEventListener('lostpointercapture', onPointerUp)
    mobileTouch?.addEventListener('pointerdown', onPointerDown)
    mobileTouch?.addEventListener('pointermove', onFacePointerMove)
    mobileTouch?.addEventListener('pointerup', onPointerUp)
    mobileTouch?.addEventListener('pointercancel', onPointerUp)
    mobileTouch?.addEventListener('lostpointercapture', onPointerUp)
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) lastPaint.x = NaN
      },
      { rootMargin: '160px' },
    )
    observer.observe(layer)
    animationFrame = requestAnimationFrame(tick)

    return () => {
      if (dragAnchor !== null) onDragChange?.(false)
      disposed = true
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('pointermove', onWindowPointerMove)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onFacePointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      canvas.removeEventListener('lostpointercapture', onPointerUp)
      mobileTouch?.removeEventListener('pointerdown', onPointerDown)
      mobileTouch?.removeEventListener('pointermove', onFacePointerMove)
      mobileTouch?.removeEventListener('pointerup', onPointerUp)
      mobileTouch?.removeEventListener('pointercancel', onPointerUp)
      mobileTouch?.removeEventListener('lostpointercapture', onPointerUp)
      observer.disconnect()
    }
  }, [onDragChange])

  return (
    <div
      className="interactive-face"
      ref={layerRef}
      role="img"
      aria-label={ariaLabel}
    >
      <img ref={fallbackRef} src={centerUrl} alt="" aria-hidden="true" width="1254" height="1254" fetchPriority="high" />
      <canvas ref={canvasRef} aria-hidden="true" />
      <div ref={mobileTouchRef} className="face-mobile-touch" aria-hidden="true" />
    </div>
  )
}
