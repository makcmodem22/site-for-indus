import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// minimal .env.local loader (no extra dep)
for (const line of readFileSync(join(root, '.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
if (!token) throw new Error('Missing SANITY_API_WRITE_TOKEN — create one at sanity.io/manage → API → Tokens (Editor)')

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

const materials = [
  {
    slug: 'granite',
    name: 'Granite Kitchen Worktop',
    tagline: 'Natural Harmony',
    description: 'Our Granite worktops are all top-of-the-line, so performance is guaranteed. Granite is a material formed by the process of crystallization of Magma. If you need help choosing one of our many Granite Worktops for a specific project or job, get in touch with one of our team today and they will be happy to help.',
    dropboxLink: 'https://www.dropbox.com/sh/0kwhk3m6f8mtnf6/AAAwNb06WYNhaDEv0VjeWKJ-a?dl=0',
    cardImageUrl: 'https://static.wixstatic.com/media/68c3548bf3a2466fae201518cec1af9c.jpg',
    heroLocal: 'public/images/granite.png',
  },
  {
    slug: 'quartz',
    name: 'Quartz Kitchen Worktop',
    tagline: 'Manmade Power',
    description: 'Our Quartz Worktops are all top-of-the-line, so performance is guaranteed. Quartz Worktops is a engineered product which is formed by 93% crushed quartz that is mixed with pigment for coloration and 7% polymer resin as a binder. If you need help choosing one of our many Quartz Worktops for a specific project or job, get in touch with a member of our team today and they will be happy to help.',
    dropboxLink: 'https://www.dropbox.com/sh/8rhby0s2iee3huf/AADpkeXEtMHK0DXQivCRkzt1a?dl=0',
    cardImageUrl: 'https://static.wixstatic.com/media/b4980652fc3b4120bb2e2ea80d0cfe22.jpg',
    heroLocal: 'public/images/quartz.png',
  },
  {
    slug: 'marble',
    name: 'Marble',
    tagline: 'Trusty & Reliable',
    description: 'Our Marble tiles are used for bathrooms, flooring and future walls which are all top-of-the-line, so performance is guaranteed. Marble is a material formed by the process of recrystallization of carbonate materials. If you need help choosing from one of our wide range of collections, get in touch with a member of our team today and they will be happy to help.',
    dropboxLink: 'https://www.dropbox.com/sh/awgk0if6ws0bzwv/AACPPkn5FefgvzPxEzPG0l1da?dl=0',
    cardImageUrl: 'https://static.wixstatic.com/media/9b8796dfbbf8470889603b49c34f5953.jpg',
    heroLocal: 'public/images/marble.png',
  },
  {
    slug: 'interior-porcelain-tiles',
    name: 'Interior Porcelain Tiles',
    tagline: 'Subtle Excellence',
    description: 'Our Interior Porcelain Tiles are all top-of-the-line, guaranteeing exceptional durability and subtle excellence in any room. Porcelain is a highly refined material fired at extreme temperatures, resulting in a dense, water-resistant, and stain-proof surface that is perfect for modern homes. If you need help choosing from our wide range of interior collections for your specific project, get in touch with a member of our team today and they will be happy to help.',
    dropboxLink: 'https://www.dropbox.com/sh/iaaopfdwonzxvww/AAAs3C7Z6KDj6EI_rg78gJwWa?dl=0',
    cardImageUrl: 'https://static.wixstatic.com/media/b6022e61cb0449abaf9b477261adc218.jpg',
    heroLocal: 'public/images/gallery-1.png',
  },
  {
    slug: 'exterior-porcelain-tiles',
    name: 'Exterior Porcelain Tiles',
    tagline: 'Precise Performance',
    description: 'Our Exterior Porcelain Tiles are top-of-the-line, engineered to withstand the elements while maintaining precise performance outdoors. Frost-proof, fade-resistant, and incredibly durable, these tiles provide a seamless transition from your indoor living spaces to your outdoor patios. If you need help choosing the right exterior porcelain tiles for your landscaping project, get in touch with a member of our team today and they will be happy to help.',
    dropboxLink: 'https://www.dropbox.com/sh/n8e1cusg6k9g8sa/AAAs4wN5nFXg-8_woHWfsC-na?dl=0',
    cardImageUrl: 'https://static.wixstatic.com/media/0565deed883142249fb9709721706fe3.jpg',
    heroLocal: 'public/images/gallery-2.png',
  },
  {
    slug: 'sandstone',
    name: 'Sandstone Tiles',
    tagline: 'Unsettled Warmth',
    description: 'Our Sandstone tiles are all top-of-the-line, which are used for outdoor flooring. Sandstone is a material formed mainly of sand-sized mineral particles or rock fragments or organic material. If you need help choosing one of our many Sandstone tiles for a specific project or job, get in touch with a member of our team today and they will be happy to help.',
    dropboxLink: 'https://www.dropbox.com/sh/g34kd69vsgymubx/AAAn4JiRCYeU5CnoeHvxGIsVa?dl=0',
    cardImageUrl: 'https://static.wixstatic.com/media/51b81c6aa3e846d9bbba6a04a4652373.jpg',
    heroLocal: 'public/images/hero.png',
  },
  {
    slug: 'porcelain-slabs',
    name: 'Porcelain Slabs',
    tagline: 'Exotic Touch',
    description: 'Our large-format Porcelain Slabs deliver an exotic touch and are completely top-of-the-line, designed for expansive installations with minimal grout lines. These slabs offer the luxurious look of natural stone combined with the unbeatable hygiene and scratch resistance of modern porcelain. If you need help choosing the perfect porcelain slab for your feature wall, floor, or bespoke project, get in touch with one of our team today and they will be happy to help.',
    dropboxLink: 'https://www.dropbox.com/sh/1yvxcggp1r9syw3/AAAeHeOsSETtfkOE1rx6zX6La?dl=0',
    cardImageUrl: 'https://static.wixstatic.com/media/afc06a3cdd7f48eb8277be4d9094db2b.jpg',
    heroLocal: 'public/images/hero.png',
  },
]

async function uploadFromUrl(url, filename) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buf, { filename })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

async function uploadFromFile(relPath, filename) {
  const full = join(root, relPath)
  if (!existsSync(full)) {
    console.warn(`  ! missing local file ${relPath}, skipping`)
    return null
  }
  const buf = readFileSync(full)
  const asset = await client.assets.upload('image', buf, { filename })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

for (let i = 0; i < materials.length; i++) {
  const m = materials[i]
  const _id = `product.${m.slug}`
  console.log(`→ ${m.slug}`)

  console.log('  uploading card image…')
  const image = await uploadFromUrl(m.cardImageUrl, `${m.slug}-card.jpg`).catch((e) => {
    console.warn('  ! card upload failed:', e.message)
    return null
  })

  console.log('  uploading hero image…')
  const heroImage = await uploadFromFile(m.heroLocal, `${m.slug}-hero.png`)

  const doc = {
    _id,
    _type: 'product',
    name: m.name,
    slug: { _type: 'slug', current: m.slug },
    tagline: m.tagline,
    description: m.description,
    dropboxLink: m.dropboxLink,
    order: i,
    ...(image ? { image } : {}),
    ...(heroImage ? { heroImage } : {}),
  }

  await client.createOrReplace(doc)
  console.log(`  ✓ saved ${_id}`)
}

console.log('\nDone. Open /studio to manage products.')
