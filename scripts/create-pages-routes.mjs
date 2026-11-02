import { copyFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const dist = join(import.meta.dirname, '..', 'dist')
const index = join(dist, 'index.html')

for (const route of ['es', 'en', 'es/galeria', 'en/gallery']) {
  const target = join(dist, route)
  await mkdir(target, { recursive: true })
  await copyFile(index, join(target, 'index.html'))
}

await copyFile(index, join(dist, '404.html'))
