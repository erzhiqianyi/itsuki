import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

const assets = import.meta.glob<ImageMetadata>('/public/assets/photos/**/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' });

export async function photoPreview(url: string, width = 960) {
  const asset = assets['/public' + url];
  if (!asset) return { src: url, width: undefined, height: undefined };
  const result = await getImage({ src: asset, width: Math.min(width, asset.width), format: 'webp', quality: 80 });
  return { src: result.src, width: asset.width, height: asset.height };
}
