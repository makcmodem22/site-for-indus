import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

type Product = {
  name: string
  tagline?: string
  description?: string
  dropboxLink?: string
  image?: { asset?: { _ref: string } } | null
  heroImage?: { asset?: { _ref: string } } | null
}

const PRODUCT_QUERY = `*[_type == "product" && slug.current == $slug][0]{
  name, tagline, description, dropboxLink, image, heroImage
}`

export const revalidate = 60

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(
    `*[_type == "product" && defined(slug.current)]{ "slug": slug.current }`
  )
  return slugs.map((s) => ({ slug: s.slug }))
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const material = await client.fetch<Product | null>(PRODUCT_QUERY, { slug: slug.toLowerCase() })

  if (!material) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Product Not Found</h1>
        <p className="text-neutral-400 mb-8 font-['Inter']">We couldn't find the material you're looking for.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-neutral-300 backdrop-blur-sm transition-all hover:bg-white/[0.08]"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    );
  }

  const heroImageUrl = material.heroImage ? urlFor(material.heroImage).width(2000).url() : ''

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white antialiased pb-24">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.06] bg-[#0e0e0e]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5">
             <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-[#c9a962] to-[#a58940]">
              <span className="text-sm font-bold text-[#1a1a1a]" style={{ fontFamily: "'Playfair Display', serif" }}>
                RR
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                RR Granites
              </p>
            </div>
          </Link>
          <Link
             href="/"
             className="text-[13px] font-medium tracking-wide text-neutral-400 transition-colors duration-300 hover:text-[#c9a962] flex items-center gap-2"
          >
            <ArrowLeft size={14} /> Back
          </Link>
        </div>
      </nav>

      <section className="relative pt-40 pb-24 overflow-hidden min-h-screen flex items-center justify-center -mt-20">
        <div className="absolute inset-0 z-0 select-none pointer-events-none mt-20 overflow-hidden">
           {heroImageUrl && (
             <div
               className="w-full h-full object-cover opacity-50 md:opacity-60 mix-blend-screen scale-110"
               style={{
                  backgroundImage: `url(${heroImageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  animation: 'kenburns 25s ease-in-out infinite alternate'
               }}
             />
           )}
           <div className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-[2px]" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
           <div className="absolute inset-0 bg-gradient-to-x from-[#0a0a0a] via-[#0a0a0a]/20 to-[#0a0a0a]" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#c9a962]/15 rounded-full blur-[140px]" />
        </div>

        <div className="mx-auto max-w-4xl px-6 lg:px-10 relative z-10 text-center">
           {material.tagline && (
             <span className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[#c9a962]" style={{ fontFamily: "'Inter', sans-serif" }}>
               {material.tagline}
             </span>
           )}
           <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
             {material.name}
           </h1>

           {material.description && (
             <p className="text-lg leading-relaxed text-neutral-300 font-['Inter'] max-w-3xl mx-auto mb-12">
               {material.description}
             </p>
           )}

           <div className="flex justify-center gap-4 flex-wrap">
             {material.dropboxLink && (
               <a
                 href={material.dropboxLink}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#c9a962] to-[#b8983f] px-8 py-4 text-sm font-semibold text-[#1a1a1a] shadow-lg shadow-[#c9a962]/15 transition-all duration-300 hover:shadow-xl hover:shadow-[#c9a962]/25"
                 style={{ fontFamily: "'Inter', sans-serif" }}
               >
                 View Products
                 <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
               </a>
             )}
             <Link
               href="/#contact"
               className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-8 py-4 text-sm font-medium text-neutral-300 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
               style={{ fontFamily: "'Inter', sans-serif" }}
             >
               Contact Us
             </Link>
           </div>
        </div>
      </section>
    </div>
  )
}
