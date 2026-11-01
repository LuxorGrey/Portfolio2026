export const GALLERY_CATEGORY_IDS = ['photos', 'design', 'covers', 'logos', 'threeD', 'videos'] as const
export type GalleryCategoryId = (typeof GALLERY_CATEGORY_IDS)[number]

import generated from './gallery-images.generated.json'

export type GalleryImage = { src: string; thumbnail: string; width: number; height: number }

// The category order and image counts follow the source WHTY gallery.
export const GALLERY_IMAGES: Record<Exclude<GalleryCategoryId, 'videos'>, GalleryImage[]> = {
  photos: generated.Photos,
  design: generated.Design,
  covers: generated.Cover,
  logos: generated.logos,
  threeD: generated['3D'],
}

export const GALLERY_VIDEOS = [
  'pGYNpZ9DMN0',
  '8_toq7f2mM4',
  'b2XiyS_ZXfM',
  'VawUjP-9hXU',
  'hQh-nD1u9oU',
] as const

export const GALLERY_PREVIEWS: Record<GalleryCategoryId, string> = {
  photos: generated.Photos[3].thumbnail,
  design: generated.Design[0].thumbnail,
  covers: generated.Cover[21].thumbnail,
  logos: generated.logos[0].thumbnail,
  threeD: generated['3D'][2].thumbnail,
  videos: generated.Titles[0].thumbnail,
}
