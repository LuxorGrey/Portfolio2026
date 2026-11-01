import { readdir, mkdir, writeFile, stat } from 'node:fs/promises'
import { basename, dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const faceDir = join(root, 'src', 'assets', 'face')
const projectsDir = join(root, 'src', 'assets', 'projects')
const sourceGallery = join(root, 'source-assets', 'gallery')
const publicGallery = join(root, 'public', 'gallery')
const manifestPath = join(root, 'src', 'constants', 'gallery-images.generated.json')
const galleryFolders = ['Photos', 'Design', 'Cover', 'logos', '3D', 'Titles']
const supported = new Set(['.jpg', '.jpeg', '.png'])
const manifest = {}
let sourceBytes = 0
let outputBytes = 0

function numericOrder(a, b) {
  const left = Number(a.match(/\d+/)?.[0] ?? 0)
  const right = Number(b.match(/\d+/)?.[0] ?? 0)
  return left - right || a.localeCompare(b)
}

async function convert(source, target, options = {}) {
  await mkdir(dirname(target), { recursive: true })
  const pipeline = sharp(source, { failOn: 'error' })
  if (options.width) pipeline.resize({ width: options.width, withoutEnlargement: true })
  const info = await pipeline.webp({ quality: options.quality ?? 82, alphaQuality: 95, effort: 6 }).toFile(target)
  outputBytes += info.size
  return info
}

for (const folder of [faceDir, projectsDir]) {
  const names = (await readdir(folder)).filter((name) => supported.has(extname(name).toLowerCase()))
  for (const name of names) {
    const source = join(folder, name)
    sourceBytes += (await stat(source)).size
    await convert(source, join(folder, `${basename(name, extname(name))}.webp`), { quality: 84 })
  }
}

for (const folder of galleryFolders) {
  const names = (await readdir(join(sourceGallery, folder)))
    .filter((name) => supported.has(extname(name).toLowerCase()))
    .sort(numericOrder)
  manifest[folder] = []
  for (const name of names) {
    const source = join(sourceGallery, folder, name)
    sourceBytes += (await stat(source)).size
    const stem = basename(name, extname(name))
    const fullPath = join(publicGallery, folder, `${stem}.webp`)
    const thumbPath = join(publicGallery, 'thumbs', folder, `${stem}.webp`)
    const full = await convert(source, fullPath, { quality: 80, width: 1920 })
    await convert(source, thumbPath, { quality: 72, width: 480 })
    manifest[folder].push({
      src: `/gallery/${folder}/${stem}.webp`,
      thumbnail: `/gallery/thumbs/${folder}/${stem}.webp`,
      width: full.width,
      height: full.height,
    })
  }
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
const mb = (value) => (value / 1024 / 1024).toFixed(2)
console.log(`Source: ${mb(sourceBytes)} MiB; optimized files (including thumbnails): ${mb(outputBytes)} MiB`)
