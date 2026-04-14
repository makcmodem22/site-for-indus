// @ts-nocheck
'use client'

import { useLayoutEffect, useRef, useState, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { KitchenCanvas } from '../../Scene'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

/* ─────────────── Loading Screen ─────────────── */

function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 15 + 5
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            if (containerRef.current) {
              gsap.to(containerRef.current, {
                opacity: 0,
                duration: 0.8,
                ease: 'power2.inOut',
                onComplete: onFinish,
              })
            }
          }, 400)
          return 100
        }
        return next
      })
    }, 200)
    return () => clearInterval(interval)
  }, [onFinish])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: '#06080b' }}
    >
      <div className="mb-10 text-center">
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.5em] text-[#c9a962]/60"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          RR Granites
        </p>
        <h1
          className="mt-3 text-3xl font-medium tracking-tight text-neutral-200 md:text-4xl"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          3D Studio Experience
        </h1>
      </div>

      <div className="relative h-[2px] w-48 overflow-hidden rounded-full bg-neutral-800 md:w-64">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${Math.min(progress, 100)}%`,
            background: 'linear-gradient(90deg, #c9a962, #e8d5a3)',
          }}
        />
      </div>

      <p
        className="mt-4 text-xs tabular-nums text-neutral-500"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {Math.min(Math.round(progress), 100)}%
      </p>
    </div>
  )
}

/* ─────────────── Scroll Progress Bar ─────────────── */

function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (!barRef.current) return
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0
      barRef.current.style.transform = `scaleX(${progress})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-[2px] bg-transparent">
      <div
        ref={barRef}
        className="h-full origin-left"
        style={{
          background: 'linear-gradient(90deg, #c9a962, #e8d5a3, #c9a962)',
          transform: 'scaleX(0)',
          transition: 'transform 0.1s linear',
        }}
      />
    </div>
  )
}

/* ─────────────── Scroll Hint ─────────────── */

function ScrollHint() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      if (window.scrollY > 80) {
        gsap.to(el, { opacity: 0, duration: 0.5 })
      } else {
        gsap.to(el, { opacity: 1, duration: 0.5 })
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    gsap.to(el.querySelector('.arrow-icon'), {
      y: 6,
      duration: 1.2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={ref} className="fixed bottom-8 left-1/2 z-30 -translate-x-1/2 text-center md:bottom-10">
      <p
        className="mb-2 text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-500"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Scroll to assemble
      </p>
      <div className="arrow-icon flex justify-center">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#c9a962]/60"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}

/* ─────────────── 3D Experience Page ─────────────── */

export default function ThreeDExperience() {
  const [loaded, setLoaded] = useState(false)
  const scrollDriverRef = useRef<HTMLDivElement>(null)
  const precisionRef = useRef<HTMLParagraphElement>(null)
  const handFinishedRef = useRef<HTMLParagraphElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)

  const handleLoadFinish = useCallback(() => setLoaded(true), [])

  useLayoutEffect(() => {
    if (!loaded) return

    const driver = scrollDriverRef.current
    const elP = precisionRef.current
    const elH = handFinishedRef.current
    const elT = taglineRef.current
    const elD = dividerRef.current
    if (!driver || !elP || !elH || !elT || !elD) return

    const ctx = gsap.context(() => {
      gsap.fromTo(elD, { scaleX: 0 }, {
        scaleX: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: driver, start: 'top top', end: '+=40%', scrub: 0.6 },
      })

      gsap.fromTo(elP, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0,
        ease: 'power2.out',
        scrollTrigger: { trigger: driver, start: 'top top', end: '+=50%', scrub: 0.6 },
      })

      gsap.fromTo(elH, { opacity: 0, y: 25 }, {
        opacity: 1, y: 0,
        ease: 'power2.out',
        scrollTrigger: { trigger: driver, start: 'top+=30% top', end: '+=50%', scrub: 0.65 },
      })

      gsap.fromTo(elT, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0,
        ease: 'power2.out',
        scrollTrigger: { trigger: driver, start: 'top+=55% top', end: 'bottom bottom', scrub: 0.7 },
      })
    })

    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => ctx.revert()
  }, [loaded])

  return (
    <div className="relative min-h-screen" style={{ background: '#06080b', color: '#e8e6e3' }}>
      {!loaded && <LoadingScreen onFinish={handleLoadFinish} />}
      {loaded && <ScrollProgress />}

      <div
        ref={scrollDriverRef}
        className="pointer-events-none relative z-10 w-full"
        style={{ minHeight: '300vh' }}
        aria-hidden
      />

      <KitchenCanvas scrollContainerRef={scrollDriverRef} />

      {/* UI Overlay */}
      <div className="pointer-events-none fixed inset-0 z-20 flex">
        <div className="flex flex-1 flex-col justify-end pb-[min(20vh,10rem)] pl-6 md:pl-14 lg:pl-20">
          <div
            ref={dividerRef}
            className="mb-5 h-[1px] max-w-[min(80vw,14rem)] origin-left md:mb-6 md:max-w-[16rem]"
            style={{ background: 'linear-gradient(90deg, #c9a962, transparent)', transform: 'scaleX(0)' }}
          />
          <p
            ref={precisionRef}
            className="max-w-[min(90vw,20rem)] text-2xl font-medium tracking-tight opacity-0 md:max-w-xs md:text-3xl"
            style={{ fontFamily: "'Playfair Display', serif", color: '#c9a962' }}
          >
            Precision Engineering
          </p>
          <p
            ref={handFinishedRef}
            className="mt-3 max-w-[min(90vw,22rem)] text-lg font-normal italic opacity-0 md:mt-4 md:text-xl"
            style={{ fontFamily: "'Playfair Display', serif", color: '#8a8d94' }}
          >
            Hand-Finished Stone
          </p>
          <p
            ref={taglineRef}
            className="mt-5 max-w-[min(85vw,18rem)] text-xs font-light leading-relaxed opacity-0 md:mt-6 md:max-w-[20rem] md:text-sm"
            style={{ fontFamily: "'Inter', sans-serif", color: '#555a63' }}
          >
            Every slab is measured, cut, and polished to land with absolute precision — engineered for permanence.
          </p>
        </div>
        <div className="hidden w-[min(40%,12rem)] shrink-0 md:block" />
      </div>

      {/* Header */}
      <header className="pointer-events-auto fixed left-0 right-0 top-0 z-30 px-6 pt-6 md:px-10 md:pt-8">
        <div className="flex items-start justify-between">
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.4em]"
              style={{ fontFamily: "'Inter', sans-serif", color: '#5a5f68' }}
            >
              RR Granites · Studio
            </p>
            <p
              className="mt-1.5 max-w-xs text-lg md:text-xl"
              style={{ fontFamily: "'Playfair Display', serif", color: '#b5b8bf' }}
            >
              Kitchen Island Assembly
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-3 md:flex">
              <div className="h-[1px] w-8" style={{ background: '#c9a962', opacity: 0.3 }} />
              <p
                className="text-[9px] font-medium uppercase tracking-[0.35em]"
                style={{ fontFamily: "'Inter', sans-serif", color: '#c9a962', opacity: 0.5 }}
              >
                3D Experience
              </p>
            </div>
            <Link
              href="/"
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-400 backdrop-blur-sm transition-all duration-300 hover:border-[#c9a962]/20 hover:text-[#c9a962]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              ← Back
            </Link>
          </div>
        </div>
      </header>

      {loaded && <ScrollHint />}

      <div className="pointer-events-none fixed bottom-6 right-6 z-30 hidden md:block">
        <p
          className="text-[9px] font-medium uppercase tracking-[0.3em]"
          style={{ fontFamily: "'Inter', sans-serif", color: '#3a3f48' }}
        >
          Scroll-Driven · R3F
        </p>
      </div>
    </div>
  )
}
