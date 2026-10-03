# Oblique® — project documentation

An independent creative-studio website, built as a single static site with no framework,
no build step and no dependencies. Open `index.html` through any web server and it runs.

Oblique is a fictional studio. All brands, projects, numbers and testimonials are invented;
all imagery is free stock, credited per project.

---

## 1. Running the site

```bash
npx -y http-server oblique -p 8129 -c-1
```

Then open `http://localhost:8129`.

**Double-clicking `index.html` also works.** Browsers refuse to let WebGL read neighbouring
files over `file://`, which used to drop the site into list view. The page now detects that
case and loads `media/inline.js`, a base64 copy of every asset, so the grid runs offline
straight from the folder. Served over http that file is never requested.

In this workspace the same server is registered in `.claude/launch.json` under the name
`oblique`.

---

## 2. Files

| File | Size | What it holds |
|---|---|---|
| `index.html` | 18 KB | Markup only: header, the two Work views, the four pages, the footer template, the loading screen. |
| `style.css` | 23 KB | All styling and animation, organised top to bottom: tokens → motion primitives → header → dock → views → pages → loader → responsive. |
| `script.js` | 32 KB | Project data, the WebGL grid, the list, routing, page behaviour, the loading sequence. |
| `media/` | 2.2 MB | 16 posters (`pNN.webp`) and 12 clips (`pNN.mp4`). File names map to project order. |
| `media/inline.js` | 2.8 MB | Base64 copy of the above, loaded **only** when the page is opened as a file. Rebuild after changing media (command in section 9). |

No build, no bundler, no npm packages. The only external requests are two Google Fonts
stylesheets, and the site still works if those fail.

---

## 3. Design

### 3.1 Direction

Monochrome, editorial, product-led. The work is in colour; everything around it is black,
off-white and grey. The references that shaped it:

- **phantom.land** — the curved, draggable grid of work; frosted-glass controls floating
  over it; the white "Let's talk" pill.
- **bindery.co** — the loading screen where clips scatter around the wordmark.
- **offmenu.design** — rounded, dark, glassy panels.
- **tlb.betteroff.studio** — monospace labels, bold tight headlines.

### 3.2 Tokens (`:root` in `style.css`)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#000` | Page. |
| `--ink` | `#f4f4f0` | Primary text, white pills, the mark. |
| `--ink2` | `#b9b9b3` | Secondary text, inactive nav. |
| `--mute` | `#85857f` | Labels, meta. |
| `--dim` | `#3a3a37` | Alternating words in the client ticker. |
| `--line` | `rgba(244,244,240,.14)` | Hairlines. |
| `--card` | `#0e0e0e` | Stat and description cards. |
| `--glass` | `rgba(38,38,38,.62)` | Header and dock, with a 20px blur. |
| `--ease` | `cubic-bezier(.16,1,.3,1)` | Almost everything: fast out, long settle. |
| `--inout` | `cubic-bezier(.65,0,.35,1)` | Page wipes, bar fills. |

### 3.3 Type

- **Inter Tight** (400/500/600/700) for everything structural. Headlines are 600 with tight
  letter-spacing (`-.05em` at display sizes).
- **Geist Mono** (400/500) for small uppercase labels, meta rows and numbers.
- Sizes are fluid: `clamp(56px, 9.4vw, 168px)` for `.h1`, down to 11px for `.mono`.

### 3.4 Logo

A disc split along one oblique line, drawn as two SVG arcs offset from each other
(`#mk` symbol in `index.html`). It is used at four scales: header, loading screen, the
spinning mark on Contact, and the full-width footer wordmark. Hovering the header logo
nudges the halves apart. The favicon is the same shape inlined as a data URI.

---

## 4. Structure

```
Work  ├── Grid  (the curved WebGL grid; default)
      └── List  (sortable table, hover preview)
Studio   · Careers · Contact · Project pages
```

- **Header** (always visible): logo pill, one-line studio description, Lisbon clock,
  "Let's talk".
- **Dock** (always visible): Work · Studio · Careers · Contact, with a white highlight that
  slides to the current page. Grid/list switch bottom-left, filter bottom-right.
- **Routing** is hash-based: `#studio`, `#careers`, `#contact`, `#work/<slug>`. The browser
  back button, deep links and Escape all work, and the tab title follows the page.

---

## 5. The grid (the main view)

### 5.1 The bulge

Cards sit on a flat, infinite grid. The vertex shader pushes that plane outward:

```glsl
s = p * sqrt(1.0 + k * dot(q, q));   // p = flat position, q = aspect-corrected
```

so the middle stays put and the edges swell toward the viewer. `k` rests at `0.32`, rises
with drag speed (up to `+0.2`) and starts high during the opening zoom, which is what makes
the grid feel elastic. `pick()` inverts the same formula to turn a cursor position back into
a card, so hit-testing matches what you see.

### 5.2 Infinite repetition

The grid is endless. The project at cell `(i, j)` is `P[(i + 4j) mod 16]`, chosen so no two
touching cards repeat and the nearest repeat is about four cells away.

### 5.3 Card composition

Each card is drawn as three quads: a title strip, the media, and a strip of service pills.
Both text strips live in one 800×164 canvas texture (they used to be full card-height
canvases that were mostly empty — packing them cut that memory by about 7×).

### 5.4 Interactions

- **Drag** with momentum; **scroll** and **arrow keys** also pan.
- **Hover**: the card lifts ~3.5%, the image pushes in and drifts toward the cursor, the
  pills fill white, and the cursor becomes a "View" pill. Each card eases out on its own,
  so sweeping across several cards leaves a trail of fades.
- **Click** opens the project; a drag never counts as a click.
- **Filter** fades non-matching cards to 12% and desaturates them.
- Speed also drives a slight RGB split, and the outer edges fade into the black.

---

## 6. Pages

Each page wipes up over the grid and gives its content a staggered entrance.

- **Studio** — headline, facts, three black-and-white photos, then a belief statement that
  lights up word by word as it scrolls past, services as an accordion, stat cards whose
  numbers count up while a bar fills, and a client ticker that pauses on hover.
- **Careers** — five roles; hovering one inverts the row to white and shows a black-and-white
  photo that trails the cursor.
- **Contact** — a full-width "Let's talk" with the spinning mark, details that copy to the
  clipboard with a toast, a drifting image strip, and the enquiry form.
- **Project** — title, four meta columns, the media opening out of a centre crop, a result
  card, the description, and a "Next project" row.
- **Footer** (same on every page) — call to action, five columns, the giant wordmark sized to
  the exact page width, and the legal line.

Images on these pages are deliberately black and white so the work in the grid stays the only
colour on the site.

---

## 7. Animation inventory

| Where | What happens |
|---|---|
| Loading | Mark halves slide together, letters rise, seven clips appear around them, then everything flies outward and the grid zooms in. |
| "Let's talk" | The dark disc rolls across the pill, spinning as it goes; the label slides into the space it leaves. |
| Dock | White highlight slides and resizes between items. |
| Pages | Wipe up (0.9s), content fades up in sequence. |
| Headlines | Rise word by word out of a mask. |
| Numbers | Count up with a bar that fills beside them. |
| Buttons/links | Text rolls; buttons drift toward the cursor. |
| Cards | Lift, push-in, parallax drift, pills fill. |
| List | Hovered row brightens while the rest dim; preview image trails and tilts with the cursor. |

`prefers-reduced-motion` disables all of it.

---

## 8. Data

One array near the top of `script.js`; everything else is derived from it.

```js
['Maison Aube',            // 1 name
 'Maison Aube Parfums',    // 2 client
 2026,                     // 3 year
 ['Branding','Web Design'],// 4 services (drive the filter and the pills)
 ['Identity','E-commerce'],// 5 scope (project page only)
 'FENG HE / Pexels',       // 6 credit — ending in "Pexels" marks it as a video
 ['2.4×', .6, 'Online revenue in the first season after launch.'], // stat, bar fill, caption
 'The first fragrance from…'] // description
```

**To add or change a project:** add a row, then drop `media/pNN.webp` (and `pNN.mp4` if the
credit ends in "Pexels") in place, where `NN` is its position in the array. Slugs, numbering,
filter counts, the list and the loading screen all follow automatically.

---

## 9. Media pipeline

Sources: [Unsplash](https://unsplash.com) and [Pexels](https://pexels.com), both free to use.
Every project page credits its photographer or filmmaker.

```bash
# posters — 800×1000 WebP
ffmpeg -i in.jpg -vf "scale=800:1000" -c:v libwebp -quality 72 out.webp

# clips — 8s max, silent, 540×674, poster frame from the clip itself
ffmpeg -ss 1 -i raw.mp4 -t 8 -an -vf "scale=540:-2,crop=540:674,fps=30" \
       -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p -movflags +faststart out.mp4
ffmpeg -ss 0.5 -i out.mp4 -frames:v 1 -q:v 3 poster.jpg
```

After adding or replacing anything in `media/`, rebuild the offline bundle:

```bash
node -e "const f=require('fs'),d='media/',t={webp:'image/webp',mp4:'video/mp4'};f.writeFileSync(d+'inline.js','window.OBLIQUE_MEDIA={'+f.readdirSync(d).filter(x=>/.(webp|mp4)$/.test(x)).sort().map(x=>JSON.stringify(x)+':\"data:'+t[x.split('.').pop()]+';base64,'+f.readFileSync(d+x).toString('base64')+'\"').join(',
')+'};
')"
```

Heights are even numbers because H.264 requires it, and the texture size must match the file
exactly or the upload fails.

---

## 10. Performance

- **Loading screen: ~2.4s**, down from 5–8s.
- **Images: 284 KB** total (716 KB as JPEG).
- **Whole site: 2.3 MB**, of which 1.9 MB is video that streams in the background.

How:

- The loading progress tracks what has actually arrived; the site appears as soon as the
  first images are ready and the rest continue behind it.
- Only clips visible on screen send frames to the GPU. Clips off screen for 1.5s pause, and
  everything pauses when the tab is hidden.
- Label textures are packed strips rather than card-sized canvases.
- Images are mipmapped; the grid only draws the cells inside the viewport.

### The "stuck at 99%" bug

The old loading code waited on Google Fonts with no fallback, so a slow, blocked or offline
font request froze the counter at 99 forever. Now font loading cannot block the sequence
(0.9s cap), any failure falls back to the list view, and a 7s failsafe always dismisses the
loader. Verified by blocking `fonts.googleapis.com` outright: the site still loads in 2.2s.

---

## 11. Accessibility and support

- Full keyboard use: the dock, filter, accordion, list and forms are all reachable, Escape
  closes any page, and focus moves into a page when it opens.
- The grid is a canvas, so the **list view is its accessible equivalent** — same projects,
  same links, sortable, screen-reader friendly.
- Visible focus rings, labelled controls, `aria-expanded`/`aria-selected` where relevant.
- Needs WebGL2 (all current browsers). Without it the site opens in list view automatically
  and the grid button is hidden.
- Touch: drag works, the custom cursor and hover effects are disabled, and the layout stacks
  down to 390px wide.

---

## 12. Still placeholder

- The studio, its projects, numbers and awards are invented.
- The enquiry form opens the visitor's email app via `mailto:`; it needs a form service or
  endpoint before launch.
- Social links point back to the Contact page.
- Imagery is stock. Replace it with real work before this goes live, keeping the sizes in
  section 9.

## 13. Possible next steps

- Real form handling, analytics, and a sitemap/robots file.
- Open Graph image and richer meta tags for sharing.
- A per-project detail page with more than one image.
- Self-host the two fonts to drop the external requests entirely.
