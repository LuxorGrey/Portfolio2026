// Prototipo descartable: retrato con seguimiento de mirada y deformación local de mejilla.
import { useEffect, useRef } from 'react'
import centerUrl from './assets/oscar-face-center.png'
import leftUrl from './assets/oscar-face-left.png'
import rightUrl from './assets/oscar-face-right.png'
import upUrl from './assets/oscar-face-up.png'
import downUrl from './assets/oscar-face-down.png'
import blinkUrl from './assets/oscar-face-blink.png'

const SIZE = 640
const EYES = [
  { x: 245, y: 330 },
  { x: 385, y: 335 },
]
const CHEEKS = [
  { x: 200, y: 416 },
  { x: 435, y: 416 },
]

type Frames = Record<
  'center' | 'left' | 'right' | 'up' | 'down' | 'blink',
  HTMLCanvasElement
>
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

function warpCheek(
  context: CanvasRenderingContext2D,
  source: HTMLCanvasElement,
  cheek: Point,
  pull: Point,
) {
  const left = cheek.x - 128
  const top = cheek.y - 120
  const columns = 8
  const rows = 8
  const cellWidth = 256 / columns
  const cellHeight = 240 / rows

  function warped(point: Point): Point {
    const distance = Math.hypot(point.x - cheek.x, point.y - cheek.y)
    const influence = Math.max(0, 1 - (distance / 127) ** 2) ** 2
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

export default function InteractiveFace() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
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
    let activeCheek: number | null = null
    let dragOrigin = { x: 0, y: 0 }
    let nextBlink = performance.now() + 3800
    let blinkStarted = 0
    let blinkAmount = 0
    let visible = true
    let lastPaint = { x: NaN, y: NaN, pullX: NaN, pullY: NaN, blink: NaN }
    const motionPreference = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )
    const snapshot = document.createElement('canvas')
    snapshot.width = SIZE
    snapshot.height = SIZE
    const snapshotContext = snapshot.getContext('2d')

    function draw() {
      if (!frames || !context || !snapshotContext || !canvas) return
      context.clearRect(0, 0, SIZE, SIZE)
      context.drawImage(frames.center, 0, 0)
      context.save()
      context.beginPath()
      for (const eye of EYES) {
        context.moveTo(eye.x + 75, eye.y)
        context.ellipse(eye.x, eye.y, 75, 57, 0, 0, Math.PI * 2)
      }
      context.clip()
      const horizontal = Math.abs(gaze.x) >= Math.abs(gaze.y)
      const direction = horizontal
        ? gaze.x < 0
          ? frames.left
          : frames.right
        : gaze.y < 0
          ? frames.up
          : frames.down
      const strength = horizontal ? Math.abs(gaze.x) : Math.abs(gaze.y)
      context.globalAlpha = clamp((strength - 0.07) * 1.6, 0, 1)
      context.drawImage(direction, 0, 0)
      if (blinkAmount > 0) {
        context.globalAlpha = blinkAmount
        context.drawImage(frames.blink, 0, 0)
      }
      context.restore()

      if (activeCheek !== null || Math.hypot(pull.x, pull.y) > 0.3) {
        snapshotContext.clearRect(0, 0, SIZE, SIZE)
        snapshotContext.drawImage(canvas, 0, 0)
        warpCheek(context, snapshot, CHEEKS[activeCheek ?? lastCheek], pull)
      }
    }

    let lastCheek = 0
    function tick(now: number) {
      if (disposed) return
      const ease = motionPreference.matches ? 1 : 0.13
      gaze.x += (targetGaze.x - gaze.x) * ease
      gaze.y += (targetGaze.y - gaze.y) * ease
      pull.x += (targetPull.x - pull.x) * 0.22
      pull.y += (targetPull.y - pull.y) * 0.22

      if (!motionPreference.matches && now >= nextBlink && !blinkStarted) {
        blinkStarted = now
      }
      if (blinkStarted) {
        const progress = (now - blinkStarted) / 185
        blinkAmount =
          progress < 0.5 ? progress * 2 : Math.max(0, (1 - progress) * 2)
        if (progress >= 1) {
          blinkStarted = 0
          blinkAmount = 0
          nextBlink = now + 3800 + Math.random() * 3000
        }
      }

      if (
        visible &&
        (Math.abs(gaze.x - lastPaint.x) > 0.005 ||
          Math.abs(gaze.y - lastPaint.y) > 0.005 ||
          Math.abs(pull.x - lastPaint.pullX) > 0.2 ||
          Math.abs(pull.y - lastPaint.pullY) > 0.2 ||
          Math.abs(blinkAmount - lastPaint.blink) > 0.01)
      ) {
        draw()
        lastPaint = {
          x: gaze.x,
          y: gaze.y,
          pullX: pull.x,
          pullY: pull.y,
          blink: blinkAmount,
        }
      }
      if (visible && !motionPreference.matches && activeCheek === null) {
        layer!.style.transform = `translate3d(${gaze.x * 13}px, ${gaze.y * 11 + Math.sin(now / 850) * 3}px, 0) rotateY(${gaze.x * 7}deg) rotateX(${-gaze.y * 5}deg)`
      } else if (activeCheek !== null || motionPreference.matches) {
        layer!.style.transform = ''
      }
      animationFrame = requestAnimationFrame(tick)
    }

    function onWindowPointerMove(event: PointerEvent) {
      if (motionPreference.matches) return
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
    }

    function localPoint(event: PointerEvent): Point {
      const rect = canvas!.getBoundingClientRect()
      return {
        x: ((event.clientX - rect.left) / rect.width) * SIZE,
        y: ((event.clientY - rect.top) / rect.height) * SIZE,
      }
    }

    function onPointerDown(event: PointerEvent) {
      if (motionPreference.matches) return
      const point = localPoint(event)
      const index = CHEEKS.findIndex(
        (cheek) =>
          Math.hypot((point.x - cheek.x) * 0.85, point.y - cheek.y) < 85,
      )
      if (index < 0) return
      activeCheek = index
      lastCheek = index
      dragOrigin = point
      canvas!.setPointerCapture(event.pointerId)
      canvas!.classList.add('is-pulling')
      event.preventDefault()
    }

    function onFacePointerMove(event: PointerEvent) {
      if (activeCheek === null) return
      const point = localPoint(event)
      targetPull = {
        x: clamp(point.x - dragOrigin.x, -90, 90),
        y: clamp(point.y - dragOrigin.y, -80, 80),
      }
    }

    function onPointerUp() {
      activeCheek = null
      targetPull = { x: 0, y: 0 }
      canvas!.classList.remove('is-pulling')
    }

    canvas.width = SIZE
    canvas.height = SIZE
    Promise.all(
      [centerUrl, leftUrl, rightUrl, upUrl, downUrl, blinkUrl].map(loadFrame),
    ).then((loaded) => {
      if (disposed) return
      frames = {
        center: loaded[0],
        left: loaded[1],
        right: loaded[2],
        up: loaded[3],
        down: loaded[4],
        blink: loaded[5],
      }
      draw()
    })
    window.addEventListener('pointermove', onWindowPointerMove, {
      passive: true,
    })
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onFacePointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)
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
      disposed = true
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('pointermove', onWindowPointerMove)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onFacePointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      observer.disconnect()
    }
  }, [])

  return (
    <div
      className="interactive-face"
      ref={layerRef}
      role="img"
      aria-label="Retrato ilustrado de Oscar con ojos azul claro que siguen el cursor. Puedes arrastrar sus mejillas."
    >
      <img src={centerUrl} alt="" aria-hidden="true" />
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
