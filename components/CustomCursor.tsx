'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Efekurucay tarzı: küçük dot + gecikmeli ring, link üzerinde büyüme ve tıklamada ripple
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [hoveringInteractive, setHoveringInteractive] = useState(false)
  const [isDown, setIsDown] = useState(false)
  const [rippleKey, setRippleKey] = useState(0)

  // Hızlı dot için değerler
  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)
  const dotSpring = { damping: 18, stiffness: 1000 }
  const dotXSpring = useSpring(dotX, dotSpring)
  const dotYSpring = useSpring(dotY, dotSpring)

  // Gecikmeli ring için değerler (biraz daha yumuşak takip)
  const ringX = useMotionValue(-100)
  const ringY = useMotionValue(-100)
  const ringSpring = { damping: 24, stiffness: 500 }
  const ringXSpring = useSpring(ringX, ringSpring)
  const ringYSpring = useSpring(ringY, ringSpring)

  // Boyutlar
  const dotSize = 8 // px
  const ringSizeDefault = 28 // px
  const ringSizeHover = 48 // px (interaktif elementlerde büyüt)

  const interactiveSelector = useMemo(
    () => 'a, button, [role="button"], input, textarea, select, label, [data-cursor="pointer"]',
    []
  )

  // Etkinlik: masaüstü ve hover destekleyen cihazlarda aç
  useEffect(() => {
    const isHoverCapable = window.matchMedia('(hover: hover)').matches
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    setEnabled(isHoverCapable && isFinePointer)
  }, [])

  // Hareket ve tıklama
  useEffect(() => {
    if (!enabled) return

    const move = (e: MouseEvent) => {
      // Dot merkezleme
      dotX.set(e.clientX - dotSize / 2)
      dotY.set(e.clientY - dotSize / 2)

      const size = hoveringInteractive ? ringSizeHover : ringSizeDefault
      ringX.set(e.clientX - size / 2)
      ringY.set(e.clientY - size / 2)
    }

    const down = () => setIsDown(true)
    const up = () => setIsDown(false)

    const click = () => {
      // Ripple animasyonunu tetiklemek için anahtarı değiştir
      setRippleKey((k) => k + 1)
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    window.addEventListener('click', click)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('click', click)
    }
  }, [enabled, dotX, dotY, ringX, ringY, hoveringInteractive])

  // Link & buton hover tespiti
  useEffect(() => {
    if (!enabled) return

    const setHover = () => setHoveringInteractive(true)
    const unsetHover = () => setHoveringInteractive(false)

    const nodes = Array.from(document.querySelectorAll(interactiveSelector))
    nodes.forEach((el) => {
      el.addEventListener('mouseenter', setHover)
      el.addEventListener('mouseleave', unsetHover)
    })

    return () => {
      nodes.forEach((el) => {
        el.removeEventListener('mouseenter', setHover)
        el.removeEventListener('mouseleave', unsetHover)
      })
    }
  }, [enabled, interactiveSelector])

  if (!enabled) return null

  const ringSize = hoveringInteractive ? ringSizeHover : ringSizeDefault

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          width: dotSize,
          height: dotSize,
          x: dotXSpring,
          y: dotYSpring,
          borderRadius: '9999px',
          backgroundColor: '#ffffff',
          opacity: 0.9,
          scale: isDown ? 0.8 : 1,
        }}
      />

      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference"
        style={{
          width: ringSize,
          height: ringSize,
          x: ringXSpring,
          y: ringYSpring,
          borderRadius: '9999px',
          border: '1.5px solid rgba(255,255,255,0.8)',
          boxShadow: hoveringInteractive
            ? '0 0 24px rgba(147, 51, 234, 0.45), 0 0 12px rgba(59, 130, 246, 0.35)'
            : '0 0 14px rgba(59, 130, 246, 0.25)'
        }}
        animate={{
          scale: isDown ? 0.9 : 1,
          opacity: 1,
        }}
        transition={{ type: 'spring', stiffness: 700, damping: 28 }}
      />

      {/* Click ripple (merkezde büyüyen halka) */}
      <motion.span
        key={rippleKey}
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{
          width: ringSize,
          height: ringSize,
          x: ringXSpring,
          y: ringYSpring,
          borderRadius: '9999px',
          border: '1px solid rgba(255,255,255,0.35)'
        }}
        initial={{ opacity: 0.5, scale: 0.6 }}
        animate={{ opacity: 0, scale: 1.6 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      />
    </>
  )
}
