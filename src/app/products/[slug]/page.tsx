import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

// Exact data from original rrgranites.co.uk site
const materialsData: Record<string, {
  name: string,
  tagline: string,
  description: string,
  dropboxLink: string,
  image: string,
  heroImage: string,
}> = {
  granite: {
    name: 'Granite Kitchen Worktop',
    tagline: 'Natural Harmony',
    description: 'Our Granite worktops are all top-of-the-line, so performance is guaranteed. Granite is a material formed by the process of crystallization of Magma. If you need help choosing one of our many Granite Worktops for a specific project or job, get in touch with one of our team today and they will be happy to help.',
    dropboxLink: 'https://www.dropbox.com/sh/0kwhk3m6f8mtnf6/AAAwNb06WYNhaDEv0VjeWKJ-a?dl=0',
    image: 'https://static.wixstatic.com/media/68c3548bf3a2466fae201518cec1af9c.jpg',
    heroImage: '/images/granite.png',
  },
  quartz: {
    name: 'Quartz Kitchen Worktop',
    tagline: 'Manmade Power',
    description: 'Our Quartz Worktops are all top-of-the-line, so performance is guaranteed. Quartz Worktops is a engineered product which is formed by 93% crushed quartz that is mixed with pigment for coloration and 7% polymer resin as a binder. If you need help choosing one of our many Quartz Worktops for a specific project or job, get in touch with a member of our team today and they will be happy to help.',
    dropboxLink: 'https://www.dropbox.com/sh/8rhby0s2iee3huf/AADpkeXEtMHK0DXQivCRkzt1a?dl=0',
    image: 'https://static.wixstatic.com/media/b4980652fc3b4120bb2e2ea80d0cfe22.jpg',
    heroImage: '/images/quartz.png',
  },
  marble: {
    name: 'Marble',
    tagline: 'Trusty & Reliable',
    description: 'Our Marble tiles are used for bathrooms, flooring and future walls which are all top-of-the-line, so performance is guaranteed. Marble is a material formed by the process of recrystallization of carbonate materials. If you need help choosing from one of our wide range of collections, get in touch with a member of our team today and they will be happy to help.',
    dropboxLink: 'https://www.dropbox.com/sh/awgk0if6ws0bzwv/AACPPkn5FefgvzPxEzPG0l1da?dl=0',
    image: 'https://static.wixstatic.com/media/9b8796dfbbf8470889603b49c34f5953.jpg',
    heroImage: '/images/marble.png',
  },
  'interior-porcelain-tiles': {
    name: 'Interior Porcelain Tiles',
    tagline: 'Subtle Excellence',
    description: 'Our Interior Porcelain Tiles are all top-of-the-line, guaranteeing exceptional durability and subtle excellence in any room. Porcelain is a highly refined material fired at extreme temperatures, resulting in a dense, water-resistant, and stain-proof surface that is perfect for modern homes. If you need help choosing from our wide range of interior collections for your specific project, get in touch with a member of our team today and they will be happy to help.',
    dropboxLink: 'https://www.dropbox.com/sh/iaaopfdwonzxvww/AAAs3C7Z6KDj6EI_rg78gJwWa?dl=0',
    image: 'https://static.wixstatic.com/media/b6022e61cb0449abaf9b477261adc218.jpg',
    heroImage: '/images/gallery-1.png',
  },
  'exterior-porcelain-tiles': {
    name: 'Exterior Porcelain Tiles',
    tagline: 'Precise Performance',
    description: 'Our Exterior Porcelain Tiles are top-of-the-line, engineered to withstand the elements while maintaining precise performance outdoors. Frost-proof, fade-resistant, and incredibly durable, these tiles provide a seamless transition from your indoor living spaces to your outdoor patios. If you need help choosing the right exterior porcelain tiles for your landscaping project, get in touch with a member of our team today and they will be happy to help.',
    dropboxLink: 'https://www.dropbox.com/sh/n8e1cusg6k9g8sa/AAAs4wN5nFXg-8_woHWfsC-na?dl=0',
    image: 'https://static.wixstatic.com/media/0565deed883142249fb9709721706fe3.jpg',
    heroImage: '/images/gallery-2.png',
  },
  sandstone: {
    name: 'Sandstone Tiles',
    tagline: 'Unsettled Warmth',
    description: 'Our Sandstone tiles are all top-of-the-line, which are used for outdoor flooring. Sandstone is a material formed mainly of sand-sized mineral particles or rock fragments or organic material. If you need help choosing one of our many Sandstone tiles for a specific project or job, get in touch with a member of our team today and they will be happy to help.',
    dropboxLink: 'https://www.dropbox.com/sh/g34kd69vsgymubx/AAAn4JiRCYeU5CnoeHvxGIsVa?dl=0',
    image: 'https://static.wixstatic.com/media/51b81c6aa3e846d9bbba6a04a4652373.jpg',
    heroImage: '/images/hero.png',
  },
  'porcelain-slabs': {
    name: 'Porcelain Slabs',
    tagline: 'Exotic Touch',
    description: 'Our large-format Porcelain Slabs deliver an exotic touch and are completely top-of-the-line, designed for expansive installations with minimal grout lines. These slabs offer the luxurious look of natural stone combined with the unbeatable hygiene and scratch resistance of modern porcelain. If you need help choosing the perfect porcelain slab for your feature wall, floor, or bespoke project, get in touch with one of our team today and they will be happy to help.',
    dropboxLink: 'https://www.dropbox.com/sh/1yvxcggp1r9syw3/AAAeHeOsSETtfkOE1rx6zX6La?dl=0',
    image: 'https://static.wixstatic.com/media/afc06a3cdd7f48eb8277be4d9094db2b.jpg',
    heroImage: '/images/hero.png',
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const materialKey = resolvedParams.slug.toLowerCase();
  const material = materialsData[materialKey];

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white antialiased pb-24">
      {/* Simple Header */}
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

      {/* Hero Section styled strictly based on content */}
      <section className="relative pt-40 pb-24 overflow-hidden min-h-screen flex items-center justify-center -mt-20">
        {/* Immersive common background */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none mt-20 overflow-hidden">
           {/* Beautifully animated background image */}
           <div 
             className="w-full h-full object-cover opacity-50 md:opacity-60 mix-blend-screen scale-110"
             style={{ 
                backgroundImage: `url(${material.heroImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                animation: 'kenburns 25s ease-in-out infinite alternate'
             }}
           />
           {/* Overlays to ensure text remains highly readable and deepens contrast */}
           <div className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-[2px]" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
           <div className="absolute inset-0 bg-gradient-to-x from-[#0a0a0a] via-[#0a0a0a]/20 to-[#0a0a0a]" />
           {/* Center glowing accent for premium feel */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#c9a962]/15 rounded-full blur-[140px]" />
        </div>
        
        <div className="mx-auto max-w-4xl px-6 lg:px-10 relative z-10 text-center">
           <span className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[#c9a962]" style={{ fontFamily: "'Inter', sans-serif" }}>
             {material.tagline}
           </span>
           <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
             {material.name}
           </h1>
           
           {material.description && (
             <p className="text-lg leading-relaxed text-neutral-300 font-['Inter'] max-w-3xl mx-auto mb-12">
               {material.description}
             </p>
           )}

           <div className="flex justify-center gap-4 flex-wrap">
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
