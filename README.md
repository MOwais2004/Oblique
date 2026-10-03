# Oblique®

A free website template for creative studios: a curved, draggable wall of work, a page for every project, and Studio, Careers and Contact pages.

Live: https://mowais2004.github.io/Oblique

https://github.com/MOwais2004/Oblique/blob/main/preview.mp4

Plain HTML, CSS and JavaScript, with no framework, no build step and no dependencies.

---

## Features

- **Curved grid of work.** An endless WebGL grid that bulges toward you at the edges. Drag it with momentum, scroll it, or use the arrow keys.
- **Cards that react.** Hover a card and it lifts, the image pushes in and drifts with the cursor, and the service pills fill in.
- **Filter by service.** Branding, Web Design, Development or Marketing. Cards that don't match fade to grey.
- **List view.** A sortable table of every project, with a preview image that trails and tilts with the cursor.
- **Project pages.** Title, details, media that opens out from the centre, a result stat that counts up, and a "Next project" link.
- **Studio page.** A headline that rises word by word, a belief statement that lights up as you scroll, a services accordion, animated counters and a client ticker.
- **Careers and Contact.** Role rows that invert on hover with a trailing photo, contact details that copy on click, and an enquiry form.
- **Opening sequence.** The logo closes, the letters rise, clips scatter around it, and the grid zooms in.
- **Responsive.** Works on desktop, tablet and phone, down to 390px wide, with touch dragging on mobile.
- **Accessible.** Full keyboard support, visible focus rings and labelled controls, plus a list-view fallback for screen readers. It also respects reduced motion.

## Quick start

**Option 1:** double-click `index.html`. It runs straight from the folder.

**Option 2:** serve it locally:

```bash
npx -y http-server . -p 8129 -c-1
```

Then open `http://localhost:8129`.

## Files

| File | What it holds |
|---|---|
| `index.html` | Markup: header, grid and list views, the four pages, footer, loading screen |
| `style.css` | All styling and animation |
| `script.js` | Project data, the WebGL grid, the list, routing, page behaviour |
| `media/` | Project images (`pNN.webp`) and clips (`pNN.mp4`) |
| `media/inline.js` | Offline copy of the media, used only when you open the file directly |
| `project.md` | Full documentation: design, structure, animation and performance notes |

## Make it yours

**Projects** live in one array near the top of `script.js`. Every project gets a row:

```js
['Maison Aube',             // name
 'Maison Aube Parfums',     // client
 2026,                      // year
 ['Branding','Web Design'], // services (drive the filter and the pills)
 ['Identity','E-commerce'], // scope (project page)
 'FENG HE / Pexels',        // credit (ending in "Pexels" means it has a video)
 ['2.4×', .6, 'Online revenue in the first season after launch.'], // stat, bar fill, caption
 'The first fragrance from…'] // description
```

Add a row, then drop `media/pNN.webp` (plus `pNN.mp4` for a video) in place, where `NN` is the row's position. The grid, list, filter counts, project pages and loading screen all update on their own.

**Media sizes:** images 800×1000 WebP; clips 540×674 MP4, silent, 8 seconds max. After changing media, rebuild `media/inline.js` with the command in `project.md` (section 9).

**Colours and type:** edit the tokens in `:root` at the top of `style.css`. The fonts are Inter Tight and Geist Mono from Google Fonts.

**Studio, Careers and Contact text:** edit directly in `index.html`.

## Before you launch

- The studio, projects, numbers and testimonials are invented. Replace them with your own.
- The imagery is free stock from [Unsplash](https://unsplash.com) and [Pexels](https://pexels.com). Swap in your real work.
- The enquiry form opens the visitor's email app. Connect a form service for real submissions.
- Social links are placeholders.

## Browser support

All current browsers. The grid needs WebGL2; without it the site opens in list view automatically.

## License

Free to use for personal and commercial projects.

---

Made by [MOwais2004](https://github.com/MOwais2004).
