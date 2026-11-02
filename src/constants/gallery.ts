export const GALLERY_CATEGORY_IDS = ['photos', 'design', 'covers', 'logos', 'threeD', 'videos'] as const
export type GalleryCategoryId = (typeof GALLERY_CATEGORY_IDS)[number]

import generated from './gallery-images.generated.json'

export type GalleryImage = { src: string; thumbnail: string; width: number; height: number }
const withBase = (items: GalleryImage[]) => items.map((item) => ({
  ...item,
  src: `${import.meta.env.BASE_URL}${item.src.slice(1)}`,
  thumbnail: `${import.meta.env.BASE_URL}${item.thumbnail.slice(1)}`,
}))
const images = {
  Photos: withBase(generated.Photos),
  Design: withBase(generated.Design),
  Cover: withBase(generated.Cover),
  logos: withBase(generated.logos),
  '3D': withBase(generated['3D']),
  Titles: withBase(generated.Titles),
}

// The category order and image counts follow the source WHTY gallery.
export const GALLERY_IMAGES: Record<Exclude<GalleryCategoryId, 'videos'>, GalleryImage[]> = {
  photos: images.Photos,
  design: images.Design,
  covers: images.Cover,
  logos: images.logos,
  threeD: images['3D'],
}

export const GALLERY_VIDEOS = [
  'pGYNpZ9DMN0',
  '8_toq7f2mM4',
  'b2XiyS_ZXfM',
  'VawUjP-9hXU',
  'hQh-nD1u9oU',
] as const

export const GALLERY_PREVIEWS: Record<GalleryCategoryId, string> = {
  photos: images.Photos[3].thumbnail,
  design: images.Design[0].thumbnail,
  covers: images.Cover[21].thumbnail,
  logos: images.logos[0].thumbnail,
  threeD: images['3D'][2].thumbnail,
  videos: images.Titles[0].thumbnail,
}

export type FeaturedSlideId = 'portraits' | 'covers' | 'identity' | 'worlds' | 'selection'
type FeaturedImage = { category: Exclude<GalleryCategoryId, 'videos'>; image: GalleryImage }

export const HOME_GALLERY_SLIDES: { id: FeaturedSlideId; images: FeaturedImage[] }[] = [
  { id: 'portraits', images: [
    { category: 'photos', image: images.Photos[3] },
    { category: 'photos', image: images.Photos[10] },
    { category: 'photos', image: images.Photos[18] },
  ] },
  { id: 'covers', images: [
    { category: 'covers', image: images.Cover[5] },
    { category: 'covers', image: images.Cover[21] },
    { category: 'covers', image: images.Cover[32] },
  ] },
  { id: 'identity', images: [
    { category: 'design', image: images.Design[1] },
    { category: 'logos', image: images.logos[0] },
    { category: 'design', image: images.Design[4] },
  ] },
  { id: 'worlds', images: [
    { category: 'threeD', image: images['3D'][2] },
    { category: 'threeD', image: images['3D'][5] },
    { category: 'covers', image: images.Cover[12] },
  ] },
  { id: 'selection', images: [
    { category: 'photos', image: images.Photos[5] },
    { category: 'covers', image: images.Cover[27] },
    { category: 'threeD', image: images['3D'][0] },
  ] },
]
