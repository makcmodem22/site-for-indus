import { useRef, useState, type FormEvent } from 'react'
import { ShuffleHero } from '@/components/ui/shuffle-grid'
import { GlobePulse } from '@/components/ui/globe-pulse'
import { TestimonialSection, type Testimonial } from '@/components/ui/testimonials'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  Phone,
  Mail,
  Clock,
  Award,
  Ruler,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  MapPin,
  Star,
  Menu,
  X,
} from 'lucide-react'

/* ═══════════════════════════════════════════
   Animation Helpers
   ═══════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(12px)' },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
}


/** Hook wrapper for scroll-triggered animations */
function useAnimateOnScroll(threshold = 0.15) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: threshold })
  return { ref, isInView }
}

/* ═══════════════════════════════════════════
   Section: Navigation
   ═══════════════════════════════════════════ */

function Navbar() {
  const [open, setOpen] = useState(false)

  const links = [
    { label: 'About', href: '#why-us' },
    { label: 'Materials', href: '#materials' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.06] bg-[#0e0e0e]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-[#c9a962] to-[#a58940]">
            <span className="text-sm font-bold text-[#1a1a1a]" style={{ fontFamily: "'Playfair Display', serif" }}>
              RR
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
              RR Granites
            </p>
            <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-500" style={{ fontFamily: "'Inter', sans-serif" }}>
              Stone Fabrication
            </p>
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[13px] font-medium tracking-wide text-neutral-400 transition-colors duration-300 hover:text-[#c9a962]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full bg-gradient-to-r from-[#c9a962] to-[#b8983f] px-5 py-2 text-[13px] font-semibold text-[#1a1a1a] transition-all duration-300 hover:shadow-lg hover:shadow-[#c9a962]/20"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Get a Quote
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-white/5 hover:text-white md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-white/[0.06] bg-[#0e0e0e]/95 px-6 pb-6 pt-4 backdrop-blur-xl md:hidden"
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-medium text-neutral-300 transition-colors hover:text-[#c9a962]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-gradient-to-r from-[#c9a962] to-[#b8983f] px-5 py-2.5 text-center text-sm font-semibold text-[#1a1a1a]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Get a Quote
          </a>
        </motion.div>
      )}
    </nav>
  )
}

/* ═══════════════════════════════════════════
   Section: Hero
   ═══════════════════════════════════════════ */

function HeroSection() {
  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden bg-[#0a0a0a]">
      {/* Background image */}
      <div className="absolute inset-0">
        <video
          src="/videos/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/40" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-32 lg:px-10">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2.5}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c9a962]/20 bg-[#c9a962]/[0.06] px-4 py-1.5"
          >
            <Star size={12} className="text-[#c9a962]" fill="#c9a962" />
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#c9a962]" style={{ fontFamily: "'Inter', sans-serif" }}>
              London & Kent's Premier Stone Specialists
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3.0}
            className="text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Mastering the Art
            <br />
            of Stone.{' '}
            <span className="bg-gradient-to-r from-[#c9a962] to-[#e8d5a3] bg-clip-text italic text-transparent">
              Your Kitchen,
              <br />
              Redefined.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3.5}
            className="mt-6 max-w-lg text-base leading-relaxed text-neutral-400 md:text-lg"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Bespoke Granite, Marble, and Quartz worktops. Precision fabrication and expert
            installation across London &amp; Kent.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3.8}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#contact"
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#c9a962] to-[#b8983f] px-7 py-3.5 text-sm font-semibold text-[#1a1a1a] shadow-lg shadow-[#c9a962]/15 transition-all duration-300 hover:shadow-xl hover:shadow-[#c9a962]/25"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Get a Free Instant Quote
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#gallery"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-neutral-300 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              View Our Gallery
            </a>
          </motion.div>


        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center"
      >
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown size={20} className="text-[#c9a962]/40" />
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   Section: Why Us
   ═══════════════════════════════════════════ */

const whyUsItems = [
  {
    icon: Award,
    title: '20+ Years of Experience',
    desc: 'Two decades of mastering stone craftsmanship, serving London\'s most discerning clients.',
  },
  {
    icon: Clock,
    title: '7-Day Turnaround',
    desc: 'From template to installation in just one week — without compromising on quality.',
  },
  {
    icon: Ruler,
    title: 'Laser-Precision Measurements',
    desc: 'Digital templating technology ensures a flawless, gap-free fit every single time.',
  },
  {
    icon: ShieldCheck,
    title: 'Professional Grade Aftercare',
    desc: 'Comprehensive sealing and maintenance guidance to keep your stone pristine for decades.',
  },
]

function FloatingGlassCard({ item, index, isInView }: { item: typeof whyUsItems[0]; index: number; isInView: boolean }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth mouse follow physics
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.5 })

  // 3D Perspective Tilt mapping
  const rotateX = useTransform(springY, [-100, 100], [10, -10])
  const rotateY = useTransform(springX, [-100, 100], [-10, 10])

  // Magnetic Icon pull (amplified mouse movement for the inner icon)
  const iconX = useTransform(springX, [-100, 100], [-12, 12])
  const iconY = useTransform(springY, [-100, 100], [-12, 12])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  // Floating continuous animation parameters
  const floatDurations = [3, 4.5, 3.5, 4]
  const floatDuration = floatDurations[index % floatDurations.length]

  // Spring physics scroll entrance
  const springEntrance = {
    hidden: { opacity: 0, y: 100 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: custom,
      }
    })
  }

  return (
    <motion.div
      variants={springEntrance}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={index * 0.15}
      style={{ perspective: 1000 }}
    >
      <motion.div
        animate={isInView ? { y: [-8, 8, -8] } : {}}
        transition={{
          repeat: Infinity,
          duration: floatDuration,
          ease: "easeInOut"
        }}
        className="h-full"
      >
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY }}
          className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 backdrop-blur-md transition-colors hover:border-[#c9a962]/20 hover:bg-white/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
        >
          {/* Magnetic Icon */}
          <motion.div 
            style={{ x: iconX, y: iconY }}
            className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#c9a962]/[0.08] transition-colors duration-500 group-hover:bg-[#c9a962]/[0.12]"
          >
            <item.icon size={22} className="text-[#c9a962]" />
          </motion.div>

          <h3
            className="text-lg font-semibold text-white transition-colors duration-300"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {item.title}
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-neutral-400" style={{ fontFamily: "'Inter', sans-serif" }}>
            {item.desc}
          </p>

          {/* Hover glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#c9a962]/[0.05] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function WhyUsSection() {
  const { ref, isInView } = useAnimateOnScroll()

  return (
    <section id="why-us" ref={ref} className="relative bg-[#0e0e0e] py-24 md:py-32">
      {/* Subtle top accent line */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a962]/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0}
          className="text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#c9a962]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Why Choose Us
          </p>
          <h2
            className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Craftsmanship You Can Trust
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-500" style={{ fontFamily: "'Inter', sans-serif" }}>
            From sourcing the finest natural stone to precision installation, we deliver excellence at every stage.
          </p>
        </motion.div>

        {/* Floating Glassmorphism Cards */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyUsItems.map((item, i) => (
            <FloatingGlassCard key={item.title} item={item} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   Section: Materials Showcase
   ═══════════════════════════════════════════ */

const materials = [
  {
    name: 'Granite',
    tagline: 'Timeless & Durable',
    description: 'The natural choice for hardworking kitchens. Each slab is unique, offering unmatched strength and character that lasts a lifetime.',
    image: '/images/granite.png',
    accent: '#6b7280',
  },
  {
    name: 'Quartz',
    tagline: 'Modern & Versatile',
    description: 'Engineered for perfection — non-porous, stain-resistant, and available in a stunning range of contemporary colours and patterns.',
    image: '/images/quartz.png',
    accent: '#9ca3af',
  },
  {
    name: 'Marble',
    tagline: 'Luxury & Elegance',
    description: "The pinnacle of sophistication. Marble's dramatic veining and luminous finish elevate any space into a statement of refined taste.",
    image: '/images/marble.png',
    accent: '#d4c09a',
  },
]

function MaterialsSection() {
  const { ref, isInView } = useAnimateOnScroll()

  return (
    <section id="materials" ref={ref} className="relative bg-[#0a0a0a] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0}
          className="text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#c9a962]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Our Materials
          </p>
          <h2
            className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Nature's Finest, Perfected
          </h2>
        </motion.div>

        {/* Material cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {materials.map((mat, i) => (
            <motion.div
              key={mat.name}
              variants={scaleIn}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={0.15 + i * 0.12}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.05] bg-[#111111] transition-all duration-500 hover:border-[#c9a962]/15"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={mat.image}
                  alt={`${mat.name} stone texture`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />

                {/* Badge */}
                <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 backdrop-blur-sm">
                  <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {mat.tagline}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3
                  className="text-2xl font-semibold text-white"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {mat.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-500" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {mat.description}
                </p>
                <a
                  href="#contact"
                  className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#c9a962] transition-all duration-300 hover:gap-2.5"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Learn More
                  <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   Section: Gallery — live shuffle grid
   Powered by @/components/ui/shuffle-grid
   ═══════════════════════════════════════════ */

function GallerySection() {
  return (
    <section id="gallery" className="relative bg-[#0e0e0e]">
      {/* Gold accent separator */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a962]/20 to-transparent" />
      {/* ShuffleHero provides its own heading, copy, CTA, and animated 4×4 grid */}
      <ShuffleHero />
    </section>
  )
}

/* ═══════════════════════════════════════════
   Section: Testimonials
   ═══════════════════════════════════════════ */

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    quote:
      "He is super fast and creative, delivered the website design within a week. Highly skilled and professional designer!",
    name: "Sarah",
    role: "Kickflip",
    imageSrc: "https://images.unsplash.com/photo-1581403341630-a6e0b9d2d257?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODR8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900",
  },
  {
    id: 2,
    quote:
      "Impressed by the professionalism and attention to details in UI design. Highly Recommended!",
    name: "Martha",
    role: "Unicell",
    imageSrc: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900",
  },
  {
    id: 3,
    quote:
      "A seamless experience from start to finish. Josh made our app design and experience really impressive.",
    name: "Victor",
    role: "Horizone",
    imageSrc: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAyfHxwcm9maWxlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900",
  },
];

/* ═══════════════════════════════════════════
   Section: Contact / Lead Gen
   ═══════════════════════════════════════════ */

function ContactSection() {
  const { ref, isInView } = useAnimateOnScroll()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" ref={ref} className="relative bg-[#0e0e0e] py-24 md:py-32">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a962]/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Left — Info */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={0}
            className="relative"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#c9a962]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Get In Touch
            </p>
            <h2
              className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Let's Build Something
              <br />
              <span className="italic text-[#c9a962]">Beautiful</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-neutral-500" style={{ fontFamily: "'Inter', sans-serif" }}>
              Ready to transform your space? Get a free, no-obligation quote today. Our team will respond within 24 hours.
            </p>

            {/* Contact details */}
            <div className="mt-10 space-y-5">
              <a
                href="mailto:info@rrgranites.co.uk"
                className="flex items-center gap-4 text-neutral-400 transition-colors duration-300 hover:text-[#c9a962]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c9a962]/[0.08]">
                  <Mail size={18} className="text-[#c9a962]" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-600" style={{ fontFamily: "'Inter', sans-serif" }}>Email</p>
                  <p className="text-sm font-medium text-neutral-300" style={{ fontFamily: "'Inter', sans-serif" }}>info@rrgranites.co.uk</p>
                </div>
              </a>

              <a
                href="tel:+442012345678"
                className="flex items-center gap-4 text-neutral-400 transition-colors duration-300 hover:text-[#c9a962]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c9a962]/[0.08]">
                  <Phone size={18} className="text-[#c9a962]" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-600" style={{ fontFamily: "'Inter', sans-serif" }}>Phone</p>
                  <p className="text-sm font-medium text-neutral-300" style={{ fontFamily: "'Inter', sans-serif" }}>020 1234 5678</p>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c9a962]/[0.08]">
                  <MapPin size={18} className="text-[#c9a962]" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-600" style={{ fontFamily: "'Inter', sans-serif" }}>Location</p>
                  <p className="text-sm font-medium text-neutral-300" style={{ fontFamily: "'Inter', sans-serif" }}>London &amp; Kent</p>
                </div>
              </div>
            </div>

            {/* Call Now button */}
            <a
              href="tel:+442012345678"
              className="mt-10 inline-flex items-center gap-2.5 rounded-full border border-[#c9a962]/30 bg-[#c9a962]/[0.06] px-7 py-3.5 text-sm font-semibold text-[#c9a962] transition-all duration-300 hover:bg-[#c9a962]/[0.12]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Phone size={16} />
              Call Now
            </a>

            {/* Globe decoration floating in the gap */}
            <div className="absolute right-[-40px] md:right-0 bottom-[-40px] md:bottom-0 w-64 h-64 md:w-80 md:h-80 pointer-events-none">
              <GlobePulse className="w-full h-full" />
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={0.2}
          >
            {submitted ? (
              <div className="flex h-full items-center justify-center rounded-2xl border border-[#c9a962]/15 bg-[#111111] p-10 text-center">
                <div>
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#c9a962]/[0.1]">
                    <ShieldCheck size={28} className="text-[#c9a962]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Thank You!
                  </h3>
                  <p className="mt-3 text-sm text-neutral-500" style={{ fontFamily: "'Inter', sans-serif" }}>
                    We've received your enquiry and will be in touch within 24 hours.
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-2xl border border-white/[0.05] bg-[#111111] p-8 md:p-10"
              >
                <h3
                  className="mb-2 text-xl font-semibold text-white"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Request a Free Quote
                </h3>

                {/* Name */}
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-neutral-500" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-white/[0.06] bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none transition-colors duration-300 focus:border-[#c9a962]/30 focus:ring-1 focus:ring-[#c9a962]/20"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-neutral-500" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/[0.06] bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none transition-colors duration-300 focus:border-[#c9a962]/30 focus:ring-1 focus:ring-[#c9a962]/20"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="contact-phone" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-neutral-500" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Phone Number
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    placeholder="020 XXXX XXXX"
                    className="w-full rounded-xl border border-white/[0.06] bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none transition-colors duration-300 focus:border-[#c9a962]/30 focus:ring-1 focus:ring-[#c9a962]/20"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>

                {/* Material dropdown */}
                <div>
                  <label htmlFor="contact-material" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-neutral-500" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Material Interest
                  </label>
                  <div className="relative">
                    <select
                      id="contact-material"
                      defaultValue=""
                      className="w-full appearance-none rounded-xl border border-white/[0.06] bg-[#0a0a0a] px-4 py-3 pr-10 text-sm text-white outline-none transition-colors duration-300 focus:border-[#c9a962]/30 focus:ring-1 focus:ring-[#c9a962]/20"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <option value="" disabled className="text-neutral-600">
                        Select a material
                      </option>
                      <option value="granite">Granite</option>
                      <option value="quartz">Quartz</option>
                      <option value="marble">Marble</option>
                      <option value="other">Other / Not Sure</option>
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600" />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#c9a962] to-[#b8983f] px-6 py-3.5 text-sm font-semibold text-[#1a1a1a] shadow-lg shadow-[#c9a962]/10 transition-all duration-300 hover:shadow-xl hover:shadow-[#c9a962]/20"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Get My Free Quote
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   Section: Footer
   ═══════════════════════════════════════════ */

function Footer() {
  return (
    <footer className="border-t border-white/[0.04] bg-[#080808] py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[#c9a962] to-[#a58940]">
              <span className="text-xs font-bold text-[#1a1a1a]" style={{ fontFamily: "'Playfair Display', serif" }}>
                RR
              </span>
            </div>
            <p className="text-sm font-medium text-neutral-500" style={{ fontFamily: "'Inter', sans-serif" }}>
              RR Granites · Stone Fabrication &amp; Installation
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {['About', 'Materials', 'Gallery', 'Contact'].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="text-xs font-medium text-neutral-600 transition-colors duration-300 hover:text-[#c9a962]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-white/[0.04] pt-8 text-center">
          <p className="text-xs text-neutral-700" style={{ fontFamily: "'Inter', sans-serif" }}>
            © {new Date().getFullYear()} RR Granites. All rights reserved. London &amp; Kent.
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════════
   Page: Landing Page (assembled)
   ═══════════════════════════════════════════ */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white antialiased">
      <Navbar />
      <HeroSection />
      <WhyUsSection />
      <MaterialsSection />
      <GallerySection />
      <TestimonialSection 
        title="See what all the talk is about!"
        subtitle="Transformative Client experience from all around the globe"
        testimonials={testimonialsData}
      />
      <ContactSection />
      <Footer />
    </div>
  )
}
