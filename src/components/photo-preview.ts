import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

const assets = import.meta.glob<ImageMetadata>('/public/assets/photos/**/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' });

type Photo = string | { url: string; width?: number; height?: number };

export async function photoPreview(photo: Photo | undefined, width = 960) {
  if (!photo) return { src: undefined, width: undefined, height: undefined };
  const { url, width: sourceWidth, height: sourceHeight } = typeof photo === 'string' ? { url: photo, width: undefined, height: undefined } : photo;
  if (!url) return { src: undefined, width: undefined, height: undefined };

  // Photos served from R2 are resized on the edge by Cloudflare Image Transformations;
  // their intrinsic size comes from the album front matter, since there is no local file to measure.
  if (/^https?:\/\//.test(url)) {
    const remote = new URL(url);
    const target = sourceWidth ? Math.min(width, sourceWidth) : width;
    return {
      src: `${remote.origin}/cdn-cgi/image/width=${target},format=auto,quality=80${remote.pathname}`,
      width: sourceWidth,
      height: sourceHeight,
    };
  }

  const asset = assets['/public' + url];
  if (!asset) return { src: url, width: sourceWidth, height: sourceHeight };
  const result = await getImage({ src: asset, width: Math.min(width, asset.width), format: 'webp', quality: 80 });
  return { src: result.src, width: asset.width, height: asset.height };
}
