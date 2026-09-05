# Editorial Design QA

Date: 2026-09-05

## Scope

Selected direction: movable-type laboratory. Homepage, article index, category index and article reading layout are redesigned. Remaining collection pages share the editorial shell and a scoped palette bridge, not a complete page-by-page redesign.

## Reference And Evidence

Reference: `/Users/itsuki/.codex/generated_images/01a0706c-5b5c-7122-b0d0-aa89b035316d/exec-28700276-3b9c-40ee-a707-68ad1060fe85.png`.

Evidence directory: `/Users/itsuki/.codex/visualizations/2026/09/05/01a0706c-5b5c-7122-b0d0-aa89b035316d/`.

- `design-comparison.png`: reference and implementation reviewed together.
- `homepage-desktop.png`, `homepage-mobile.png`: native browser captures.
- `homepage-preview.png`: normalized desktop capture.
- `article-desktop.png`, `photos-desktop.png`, `videos-desktop.png`: supporting page captures. Photos capture precedes the final object-contain change.

The browser capture backend renders content at two-thirds scale into a larger blank canvas. Desktop CSS viewport was verified as 1448 x 1086 through DOM measurement. The comparison crops the occupied 965 x 724 capture region and scales it to 1448 x 1086; it does not alter page content. The bottom footer is outside this capture and is not visually certified by it.

## Visual Review

- Layout: large masthead, chapter navigation, article/project/video/photo columns retained. Mobile becomes a single flow with a two-column chapter index.
- Typography: condensed black display face and restrained Japanese body text. Font metrics differ from the generated reference; not pixel-identical.
- Color: light paper, black ink, red rules and links. Heavy background panels removed.
- Media: actual latest media replaces mock imagery. Homepage portrait and landscape previews retain their natural ratios with a height limit. Album listing uses contain rather than cover.
- Detail: outlined chapter numbers, fine separators and real Lucide icons retained. Content excerpts come from actual Markdown headings when summaries are absent.

## Verification

- Production build succeeds: 317 pages.
- Homepage DOM width equals scroll width at 1448, 390 and 320 CSS pixels.
- Homepage images loaded; portrait is 188 x 250 from 6048 x 8064, landscape is 368 x 250 from 1440 x 979 (rounded DOM dimensions).
- Homepage article opens the existing note route; mobile article remains within 320px and body text is 17px.
- Article cover disclosure, image dialog opening and close button verified.
- Article pagination navigates to `/blog/2`.
- Project chapter navigates to `#projects`.
- Photo and video navigation verified. Photo covers loaded. Video title begins below the image after overlap correction.
- Existing content schema/deprecation, missing custom icon-directory and unused React-import build warnings remain outside this redesign.

## Limitations

No deployment or commit. Not an exhaustive audit of all 317 generated pages. External video playback, album lightbox interactions, every legacy page and all keyboard sequences were not tested. Legacy pages still retain some older content-specific structure.

final result: passed

This result applies to the local redesign preview and checks listed above, not a complete production accessibility or regression certification.

## Photography Follow-up

Photo index, all existing tag routes and album detail now use dedicated editorial templates, replacing the legacy palette bridge for these routes. The selected homepage's black/white/red palette, condensed masthead, outlined numbering and fine rules continue into the photo archive; this is an extension of the direction, not an exact clone of a photo-page mockup.

Evidence in the same directory: `photography-index-final.png` (1448 x 1086, native final capture without normalization), `photography-20-v2.png`, `photography-mobile-v2.png`, `photography-viewer-mobile-v2.png`. Earlier mobile captures retain the capture backend scaling described above.

Verified through the public tunnel: index, 2025 filter returning two albums, album navigation, viewer next/previous including wraparound, close and focus restoration. Local built output additionally verified for the 20-image album, Escape closing, and no horizontal overflow at 320px. Desktop and 390px detail/viewer were visually reviewed. Viewer controls measure 44 x 44px on mobile. Swipe implementation is present but physical touch gestures were not tested.

All four index covers loaded from optimized WebP assets through the public URL. Astro generates 960px thumbnails and up-to-1920px viewer images while keeping original-file links. Intrinsic dimensions reserve photo space; original proportions are retained. The 116MB source album is no longer loaded in full merely to view its contact sheet. No content files or original photographs were changed.

Final build succeeds with 317 pages; pre-existing collection and custom-icon-directory warnings remain. No production-domain deployment or commit. Public preview remains the existing temporary tunnel.

Photography final result: passed
