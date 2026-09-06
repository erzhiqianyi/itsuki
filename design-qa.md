# Profile integration — 2026-09-06

## Scope and visual reference

The accepted direction is an extension of the existing editorial site: paper background, black text, vermillion links, fine rules, and a narrow reading column. The original résumé supplies public career content, not a separate visual theme. About now introduces the person; Resume presents career evidence; Projects retains product detail.

Source screenshots:
- `/Users/itsuki/.codex/visualizations/2026/09/06/01a0757f-d13c-76b3-8674-dc7cc5e97a5d/profile-review/01-home.png`
- `/Users/itsuki/.codex/visualizations/2026/09/06/01a0757f-d13c-76b3-8674-dc7cc5e97a5d/profile-review/02-about.png`
- `/Users/itsuki/.codex/visualizations/2026/09/06/01a0757f-d13c-76b3-8674-dc7cc5e97a5d/profile-review/03-resume.png`

Implementation screenshots are in `/Users/itsuki/.codex/visualizations/2026/09/06/01a0757f-d13c-76b3-8674-dc7cc5e97a5d/profile-implementation/`:
- `home-desktop.png`, `about-desktop.png`, `resume-desktop.png`
- `about-mobile.png`, `resume-en-mobile.png`, `resume-en-cases-mobile.png`

Desktop source and implementation captures use the same browser surface, 1280 × 720 CSS viewport. The CUA screenshot surface exports 1265 × 712 pixels; the current browser reports devicePixelRatio 2. Images were compared at the same exported size, without resampling. Mobile uses a 390 × 844 CSS viewport and exports 375 × 812 pixels. No original mobile reference was supplied; mobile was checked for readability and working navigation. Browser viewport overrides were reset after testing.

## Comparison and findings

- Typography: existing Noto Sans JP body and Barlow Condensed display fonts retained. Resume uses 16px body text and 1.9 line height; name, section titles, metadata and results have distinct hierarchy.
- Layout: the 960px page and approximately 720px text column follow the accepted reading direction. Desktop section labels sit beside the text; mobile sections become one column. The smaller About avatar and removal of its card sidebar are intentional changes.
- Colors: existing paper, ink, muted, rule and vermillion tokens reused. Language selection has an underline in addition to color. Keyboard focus outlines come from the existing layout.
- Assets: the original cat avatar is reused at its natural square aspect ratio. No generated or placeholder assets were introduced.
- Content: three localized résumé variants use the supplied public résumé, with iSoftStone identified separately from its HSBC project. Three selected projects refer to existing project records and anchors. Private career files remain outside this repository.

Full-view comparisons covered the original and revised desktop About and homepage. The mobile case-section screenshot is the focused reading check: body text, outcome labels and rules remain legible without overflow.

Iteration history:
1. P2: About greeting broke mid-phrase beside the mobile avatar. Moved the avatar beside the kicker, gave the title full width, and grouped its phrases. `about-mobile.png` shows the corrected wrap.
2. P2: English numbered navigation wrapped onto a second line. Hid the numbers only on narrow English résumé pages; `resume-en-mobile.png` shows five readable labels on one row.
3. No remaining P0/P1/P2 visual findings in the inspected states.

## Verification

- Production build: passed, 396 generated pages.
- Static output: six relevant pages, 204 internal links/anchors, one H1 per page, language attributes, canonical links and reciprocal language alternatives passed.
- Browser: homepage → About → Resume; Japanese → Chinese → English; résumé directory jump; Resume → Nyashiki project anchor → Resume; About timeline click to open and Space to close all passed.
- Timeline retains all 15 existing records in a native disclosure.
- Desktop and mobile overflow checks passed; browser error log was empty in the inspected session.
- `astro check`: 49 errors remain. Every diagnostic points to an unchanged line in HEAD. No diagnostic in the new résumé page, shared résumé data, rewritten About or modified layout.
- `git diff --check`: passed.

Limits: print styles have not been visually checked. No screen-reader certification or production deployment was performed. Career metrics and availability were migrated from the user-provided résumé, not independently verified.

final result: passed
