'use client'

import { useEffect, useRef, useCallback, useState } from "react"
import createGlobe from "cobe"

interface PulseMarker {
  id: string
  location: [number, number]
  delay: number
}

interface GlobePulseProps {
  className?: string
  speed?: number
}

const workLocation: PulseMarker[] = [
  { id: "work-zone", location: [51.5074, -0.1278], delay: 0 },
]

export function GlobePulse({
  className = "",
  speed = 0.003,
}: GlobePulseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)
  const dotRef = useRef<HTMLDivElement>(null)

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        }
      }
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerUp])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId: number | null = null
    let timeoutId: number | null = null
    const width = canvas.offsetWidth

    // 1. Calculate spherical map coordinates (London)
    const phi_loc = (-0.1278 * Math.PI) / 180;
    const theta_loc = (51.5074 * Math.PI) / 180;
    
    // Base 3D vector
    const x0 = Math.sin(phi_loc) * Math.cos(theta_loc);
    const y0 = Math.sin(theta_loc);
    const z0 = Math.cos(phi_loc) * Math.cos(theta_loc);

    function init(w: number) {
      if (globe) return

      let phi = 0

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width: w,
        height: w,
        phi: 0,
        theta: 0.2,
        dark: 1,
        diffuse: 1.5,
        mapSamples: 16000,
        mapBrightness: 10,
        baseColor: [0.2, 0.2, 0.2],
        markerColor: [0.9, 0.7, 0.2],
        glowColor: [0.1, 0.1, 0.1],
        markerElevation: 0,
        // Disable native marker to avoid duplicates; we will use CSS dot exclusively
        markers: [],
        arcs: [],
        opacity: 0.9,
      })

      function animate() {
        if (!isPausedRef.current) phi += speed
        
        const currentPhi = phi + phiOffsetRef.current + dragOffset.current.phi
        const currentTheta = 0.2 + thetaOffsetRef.current + dragOffset.current.theta
        
        globe!.update({
          phi: currentPhi,
          theta: currentTheta,
        })

        if (dotRef.current) {
          // Exact Cobe orthographic spherical projection matching the shader output:
          const lat = (51.5074 * Math.PI) / 180;
          const lon = (-0.1278 * Math.PI) / 180;
          
          // Cobe evaluates phi rotation essentially by shifting the longitude offset.
          // Note parameter shifting to align texture seam. Cobe uses a +PI/2 map alignment offset.
          const p = lon + currentPhi + Math.PI / 2;
          
          // Base spherical to Cartesian
          let x1 = Math.cos(lat) * Math.sin(p);
          let y1 = Math.sin(lat);
          let z1 = Math.cos(lat) * Math.cos(p);

          // Apply X-axis rotation (theta tilt)
          let y2 = y1 * Math.cos(currentTheta) - z1 * Math.sin(currentTheta);
          let z2 = y1 * Math.sin(currentTheta) + z1 * Math.cos(currentTheta);
          let x2 = x1;

          // Cobe Orthographic Mapping parameters
          // In Cobe, if z2 > 0, it is on the FRONT of the sphere facing the camera
          if (z2 > 0) {
            dotRef.current.style.opacity = "1"
            const scale = w * 0.4;
            const px = w / 2 + x2 * scale;
            const py = w / 2 - y2 * scale;
            dotRef.current.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%)`
          } else {
            dotRef.current.style.opacity = "0"
          }
        }

        animationId = requestAnimationFrame(animate)
      }

      animate()
      setTimeout(() => canvas && (canvas.style.opacity = "1"))
    }

    function checkWidthAndInit() {
      if (!canvasRef.current || globe) return
      const w = canvasRef.current.offsetWidth
      
      if (w > 0) {
        init(w)
      } else {
        timeoutId = window.setTimeout(checkWidthAndInit, 50)
      }
    }

    checkWidthAndInit()

    return () => {
      if (timeoutId !== null) window.clearTimeout(timeoutId)
      if (animationId !== null) cancelAnimationFrame(animationId)
      if (globe) {
        globe.destroy()
        globe = null
      }
    }
  }, [speed])

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <style>{`
        @keyframes custom-ripple {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(3.5); opacity: 0; }
        }
      `}</style>
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = { x: e.clientX, y: e.clientY }
          canvasRef.current!.style.cursor = "grabbing"
          isPausedRef.current = true
        }}
        style={{
          width: "100%", height: "100%", cursor: "grab", opacity: 0,
          transition: "opacity 1.2s ease", borderRadius: "50%", touchAction: "none",
        }}
      />

      {/* Sync CSS layer for the pulsing dot */}
      <div 
        ref={dotRef} 
        className="absolute top-0 left-0 pointer-events-none transition-opacity duration-300"
        style={{ opacity: 0, transform: `translate(0px, 0px)` }}
      >
        <div className="relative flex items-center justify-center">
          {/* Core dot */}
          <div className="w-2.5 h-2.5 bg-[#c9a962] rounded-full shadow-[0_0_8px_#c9a962] relative z-10 animate-pulse"></div>
          {/* Emit waves (Ripple) */}
          <div className="absolute w-4 h-4 border-2 border-[#c9a962] rounded-full z-0 opacity-0" style={{ animation: 'custom-ripple 2s ease-out infinite 0.5s' }}></div>
          <div className="absolute w-4 h-4 border-2 border-[#c9a962] rounded-full z-0 opacity-0" style={{ animation: 'custom-ripple 2s ease-out infinite 1.5s' }}></div>
        </div>
      </div>
    </div>
  )
}
