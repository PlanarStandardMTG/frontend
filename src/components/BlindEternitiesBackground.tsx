import { useEffect, useRef } from 'react'

type Star = {
  x: number
  y: number
  radius: number
  depth: number
  vx: number
  vy: number
}

export function BlindEternitiesBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const starsRef = useRef<Star[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    const STAR_COUNT = Math.floor(
      (window.innerWidth * window.innerHeight) / 6000
    )

    starsRef.current = Array.from({ length: STAR_COUNT }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.6 + 0.4,
      depth: Math.random() * 0.8 + 0.2,

      // 🌌 ultra-slow drift (scaled by depth)
      vx: (Math.random() - 0.5) * 0.02,
      vy: (Math.random() - 0.5) * 0.02,
    }))

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    window.addEventListener('mousemove', handleMouseMove)

    const INFLUENCE_RADIUS = 120
    const MAX_OFFSET = 5

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const star of starsRef.current) {
        // 🌠 drift
        star.x += star.vx * star.depth
        star.y += star.vy * star.depth

        // wrap edges
        if (star.x < 0) star.x = canvas.width
        if (star.x > canvas.width) star.x = 0
        if (star.y < 0) star.y = canvas.height
        if (star.y > canvas.height) star.y = 0

        // 🖱 localized mouse influence
        const dx = star.x - mouseRef.current.x
        const dy = star.y - mouseRef.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        let offsetX = 0
        let offsetY = 0

        if (distance < INFLUENCE_RADIUS) {
          const strength = 1 - distance / INFLUENCE_RADIUS
          const force = strength * MAX_OFFSET * star.depth

          offsetX = dx * 0.01 * force
          offsetY = dy * 0.01 * force
        }

        ctx.beginPath()
        ctx.arc(
          star.x + offsetX,
          star.y + offsetY,
          star.radius,
          0,
          Math.PI * 2
        )
        ctx.fillStyle = `rgba(200, 220, 255, ${0.6 + 0.3 * Math.sin(star.x + performance.now() * 0.001)})`
        ctx.fill()
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  )
}
