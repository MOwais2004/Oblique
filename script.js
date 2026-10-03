const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const CATS = ['Branding', 'Web Design', 'Development', 'Marketing'];
const SANS = '"Inter Tight", system-ui, sans-serif', MONO = '"Geist Mono", ui-monospace, monospace';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(pointer:fine)').matches;

// name, client, year, services, scope, media credit, [stat, bar fill 0-1, stat label], description.
// Media: media/pNN.webp, plus media/pNN.mp4 when the credit is a Pexels clip.
const P = [
  ['Maison Aube','Maison Aube Parfums',2026,['Branding','Web Design'],['Identity','E-commerce'],'FENG HE / Pexels',['2.4×',.6,'Online revenue in the first season after launch.'],'The first fragrance from a Parisian house. We shaped the identity, the crystal-cut packaging story and a shop that reads like a lookbook.'],
  ['Glaze','Glaze Cosmetics',2025,['Branding','Marketing'],['Identity','Campaign'],'Kristo Markou / Unsplash',['11M',.8,'Organic views across the launch campaign in six weeks.'],'Launch identity and campaign for a lip care line. One colour per product, shot close enough to feel.'],
  ['Galet','Galet Parfums',2024,['Branding'],['Identity','Film'],'Mikhail Nilov / Pexels',['40',.5,'Stockists carrying the range within its first year.'],'Identity and launch film for a mineral fragrance, built from river stones, marble and slow light.'],
  ['Argent Lab','Argent',2026,['Branding','Development'],['3D','Web'],'Pavlo Talpa / Unsplash',['3.1×',.65,'Time on site after launching the 3D configurator.'],'Brand world and a WebGL product configurator for a grooming brand made in brushed steel.'],
  ['Nuit','Nuit Skincare',2025,['Web Design','Development'],['Shopify','UX'],'cottonbro studio / Pexels',['38%',.38,'Faster checkout after the store redesign.'],'A calm, conversion-focused store for an overnight skincare brand, rebuilt around one clear routine.'],
  ['Atelier Sève','Atelier Sève Glass',2026,['Marketing'],['Art direction','Social'],'YUFEI LIN / Unsplash',['4.2M',.7,'Impressions across the season campaign.'],'A season campaign for a hand-blown glass atelier: light, curves and not a single hard sell.'],
  ['Lumen Clinic','Lumen',2025,['Web Design','Development'],['Web','Booking'],'Pavlo Talpa / Unsplash',['2',.2,'Taps from landing page to a booked appointment.'],'Website and booking flow for a dermatology clinic. Warm, clear, and quick to use on a phone.'],
  ['Soie','Soie Paris',2024,['Branding','Marketing'],['Motion','Identity'],'Hanna Pad / Pexels',['19',.45,'Motion assets delivered from one flexible identity.'],'A moving identity for a silk house, where the logo drapes and folds with the fabric.'],
  ['Open Field','Open Field Botanicals',2025,['Marketing'],['Campaign','OOH'],'Mikhail Nilov / Pexels',['80k',.75,'People signed up for the 30-day offline challenge.'],'A campaign for a botanical fragrance: soft-focus fields, slow mornings and a month-long offline challenge.'],
  ['Bloom Week','Bloom Week Festival',2026,['Branding','Marketing'],['Identity','Motion'],'Roman Odintsov / Pexels',['7',.7,'Days, seven identities, one festival.'],'Identity for a city flower festival that opens a little more each day of the week.'],
  ['Amber & Oak','Amber & Oak Grooming',2024,['Branding','Development'],['E-commerce','Art direction'],'cottonbro studio / Pexels',['2×',.5,'Online sales in the first year after launch.'],'Identity, product photography and a Shopify store for a small-batch grooming brand.'],
  ['Meridian','Meridian Watches',2025,['Web Design','Development'],['Web','3D'],'Quang Viet Nguyen / Pexels',['0.9s',.9,'Load time for the full 3D launch experience.'],'A launch site for a hand-finished watch, with a scroll-driven 3D movement that loads in under a second.'],
  ['Ambre','Ambre Parfums',2026,['Marketing','Web Design'],['Content','Web'],'MART PRODUCTION / Pexels',['12',.4,'Short films, one for every scent in the collection.'],'Content and a storytelling site for a niche fragrance house.'],
  ['Solace Skin','Solace',2025,['Marketing','Branding'],['Content','Art direction'],'Artem Podrez / Pexels',['64%',.64,'Higher engagement across social after the content shift.'],'Texture-first content for a skincare brand built on patience. Film, stills and social, produced in-house.'],
  ['Hush','Hush Audio',2024,['Marketing','Web Design'],['Campaign','Web'],'Pavel Danilyuk / Pexels',['4',.4,'Markets launched at once with creator partners.'],'A launch campaign and product site for noise-cancelling headphones, built around one idea: quiet.'],
  ['Drop Nº9','Drop Nº9 Serums',2026,['Web Design','Development'],['E-commerce','Web'],'Ron Lach / Pexels',['27%',.27,'Higher average order value after the relaunch.'],'A serum store where every product is shown in the hand, not on a shelf.'],
].map(([name, client, year, cats, tags, credit, stat, desc], i) => {
  const src = 'media/p' + String(i + 1).padStart(2, '0');
  return { name, client, year, cats, tags, credit, stat, desc, i, no: String(i + 1).padStart(2, '0'), poster: src + '.webp', scope: cats.join(', '),
           video: credit.endsWith('Pexels') && src + '.mp4', slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '') };
});
const S = { view: 'space', filter: 'All', paused: false, ready: false };
const match = p => S.filter === 'All' || p.cats.includes(S.filter);

// One media element per project; videos start with play() (not the autoplay attribute) so Chrome keeps them running off-DOM.
const srcOf = f => (window.OBLIQUE_MEDIA && window.OBLIQUE_MEDIA[f.split('/').pop()]) || f;
function loadMedia(p) {
  return new Promise(res => {
    if (p.video) {
      const v = p.el = document.createElement('video');
      Object.assign(v, { muted: true, loop: true, playsInline: true, preload: 'auto', src: srcOf(p.video) });
      v.addEventListener('loadeddata', res, { once: true }); v.addEventListener('error', res, { once: true }); v.play().catch(() => {});
    } else { const im = p.el = new Image(); im.onload = im.onerror = res; im.src = srcOf(p.poster); }
  });
}
const play = p => p.video && p.el.play().catch(() => {});

/* =========================== WORK: the bulge grid (WebGL2) =========================== */
const CARD_W = 800, TOP_H = 78, MEDIA_H = 1000, BOT_H = 86, CARD_H = TOP_H + MEDIA_H + BOT_H, LAB_H = TOP_H + BOT_H; // title row, media, service pills
function label(p, hov) {
  const c = document.createElement('canvas'); c.width = CARD_W; c.height = LAB_H; // two strips stacked: title row, then pills
  const x = c.getContext('2d');
  x.fillStyle = '#f4f4f0'; x.font = `600 38px ${SANS}`; x.letterSpacing = '-1px'; x.fillText(p.name, 0, 48);
  x.font = `500 19px ${MONO}`; x.letterSpacing = '1.5px'; x.fillStyle = '#9d9d97'; x.textAlign = 'right'; x.fillText(p.client.toUpperCase(), CARD_W, 44); x.textAlign = 'left';
  let X = 0; const Y = TOP_H + 24;
  p.cats.forEach(t => { const s = t.toUpperCase(), w = x.measureText(s).width + 30;
    x.strokeStyle = hov ? '#f4f4f0' : 'rgba(244,244,240,.38)'; x.lineWidth = 2; x.beginPath(); x.roundRect(X + 1, Y, w, 40, 20);
    if (hov) { x.fillStyle = '#f4f4f0'; x.fill(); } else x.stroke();
    x.fillStyle = hov ? '#000' : '#e2e2dc'; x.fillText(s, X + 15, Y + 27); X += w + 10; });
  x.fillStyle = hov ? '#f4f4f0' : '#9d9d97'; x.textAlign = 'right'; x.fillText(`${p.year}  (${p.no})`, CARD_W, Y + 27);
  return c;
}
const cvs = $('#gl'), gl = cvs.getContext('webgl2', { antialias: true, alpha: true, premultipliedAlpha: true });
if (!gl) document.documentElement.classList.add('nogl');
const G = { cam: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, drag: null, k: .9, zoom: .55, intro: 0, hover: null, hc: new Map(), mu: { x: .5, y: .5 }, fa: P.map(() => 1), mouse: null };
let vw, vh, cardW, cardH, cellW, cellH, U = {}, nIdx;
const K0 = .32, SEG = 20;

function compile(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(s); return s; }
function texture(src, mip) {
  const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mip ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
  if (src) { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src); if (mip) gl.generateMipmap(gl.TEXTURE_2D); }
  else { gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([20, 20, 20, 255])); }
  return t;
}
function initGL() {
  const prog = gl.createProgram();
  // Flat grid position p (NDC) bulges outward: s = p * sqrt(1 + k|q|^2), so edges swell toward the viewer. pick() inverts it.
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, `#version 300 es
    in vec2 aPos; uniform vec4 uRect; uniform vec2 uAsp; uniform float uK; out vec2 vUv; out vec2 vS;
    void main(){ vec2 p = uRect.xy + aPos * uRect.zw; vec2 q = p * uAsp; vec2 s = p * sqrt(1. + uK * dot(q, q));
      vUv = aPos; vS = s * uAsp; gl_Position = vec4(s, 0., 1.); }`));
  // uUV crops media to "cover", uZoom = hover push-in, uGray = filtered-out amount, uCA = speed-driven RGB split; edges fade out.
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, `#version 300 es
    precision highp float; in vec2 vUv; in vec2 vS; uniform sampler2D uTex; uniform float uA, uCA, uZoom, uGray, uRip; uniform vec2 uMouse; uniform vec4 uUV; out vec4 o;
    void main(){ vec2 st = vUv + (uMouse - .5) * .07 * uRip; // image drifts toward the cursor inside its frame
      vec2 uv = uUV.xy + (.5 + (st - .5) * uZoom) * uUV.zw, d = vS * uCA;
      vec4 c = texture(uTex, uv); c.r = texture(uTex, uv - d).r; c.b = texture(uTex, uv + d).b;
      c.rgb = mix(c.rgb, vec3(dot(c.rgb, vec3(.299, .587, .114))), clamp(uGray, 0., 1.));
      c.rgb *= 1. + .06 * uRip;
      o = c * uA * smoothstep(1.32, .55, length(vS)); }`));
  gl.linkProgram(prog); gl.useProgram(prog);
  ['uRect', 'uAsp', 'uK', 'uA', 'uCA', 'uZoom', 'uUV', 'uGray', 'uRip', 'uMouse'].forEach(n => U[n] = gl.getUniformLocation(prog, n));
  const pos = [], idx = [];
  for (let j = 0; j <= SEG; j++) for (let i = 0; i <= SEG; i++) pos.push(i / SEG, j / SEG);
  for (let j = 0; j < SEG; j++) for (let i = 0; i < SEG; i++) { const a = j * (SEG + 1) + i, b = a + SEG + 1; idx.push(a, b, a + 1, a + 1, b, b + 1); }
  nIdx = idx.length; gl.bindVertexArray(gl.createVertexArray());
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'aPos'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.clearColor(0, 0, 0, 0);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  P.forEach(p => {
    p.labelTex = texture(label(p), true); p.labelTexH = texture(label(p, true), true);
    p.tex = texture((p.video ? p.el.readyState >= 2 : p.el.naturalWidth) ? p.el : null, !p.video);
    if (!p.video && !p.el.naturalWidth) p.el.addEventListener('load', () => { p.tex = texture(p.el, true); }, { once: true });
    const w = p.el.videoWidth || p.el.naturalWidth || 4, h = p.el.videoHeight || p.el.naturalHeight || 5, a = w / h, T = CARD_W / MEDIA_H;
    p.uv = a > T ? [(1 - T / a) / 2, 0, T / a, 1] : [0, (1 - a / T) / 2, 1, a / T];
  });
}
function measureTalk() { $$('.talk').forEach(b => b.style.setProperty('--tw', $('.roll', b).offsetWidth + 'px')); }
function resize() {
  vw = innerWidth; vh = innerHeight; const dpr = Math.min(devicePixelRatio || 1, 2);
  cvs.width = vw * dpr; cvs.height = vh * dpr; gl && gl.viewport(0, 0, cvs.width, cvs.height);
  cardW = vw < 700 ? vw * .5 : Math.max(200, Math.min(300, vw * .18));
  cardH = cardW * CARD_H / CARD_W; cellW = cardW * 1.12; cellH = cardH * 1.06;
  moveInd(); fitAll(); measureTalk();
}
const asp = () => { const a = vw / vh, l = Math.hypot(a, 1); return [a / l, 1 / l]; };
const cell = (i, j) => (((i + 4 * j) % 16) + 16) % 16; // neighbours never repeat; nearest repeat is ~4 cells away
function pick(mx, my) { // screen px -> world, inverting the lens
  const [ax, ay] = asp(), sx = mx / vw * 2 - 1, sy = 1 - my / vh * 2;
  const v = (sx * ax) ** 2 + (sy * ay) ** 2, u = (Math.sqrt(1 + 4 * G.k * v) - 1) / (2 * G.k), f = 1 / Math.sqrt(1 + G.k * u);
  const wx = G.cam.x + sx * f * vw / 2 / G.zoom, wy = G.cam.y - sy * f * vh / 2 / G.zoom;
  const i = Math.round(wx / cellW), j = Math.round(wy / cellH), p = P[cell(i, j)];
  const lx = (wx - i * cellW) / cardW + .5, ly = ((wy - j * cellH) / cardH + .5) * CARD_H;
  return match(p) && lx > 0 && lx < 1 && ly > 0 && ly < CARD_H ? { i, j, p, u: lx, v: (ly - TOP_H) / MEDIA_H } : null;
}
function spaceFrame() {
  const now = performance.now();
  const { cam, vel } = G;
  if (!G.drag) { cam.x += vel.x; cam.y += vel.y; vel.x *= .94; vel.y *= .94; }
  const speed = Math.hypot(vel.x, vel.y);
  G.intro += (1 - G.intro) * (reduce ? 1 : .05);
  const e = G.intro;
  G.k += (K0 + (1 - e) * .5 + Math.min(speed * .008, .2) - G.k) * .08;
  G.zoom += (((G.drag ? .92 : 1) - (1 - e) * .4) - G.zoom) * .08;
  if (G.hover) { G.mu.x += (G.hover.u - G.mu.x) * .08; G.mu.y += (G.hover.v - G.mu.y) * .08; }
  const hk = G.hover && !G.drag ? G.hover.i + ',' + G.hover.j : null;
  if (hk && !G.hc.has(hk)) G.hc.set(hk, 0);
  G.hc.forEach((v, k) => { const t = k === hk ? 1 : 0, nv = v + (t - v) * (t ? .12 : .075); if (!t && nv < .002) G.hc.delete(k); else G.hc.set(k, nv); });
  P.forEach((p, n) => G.fa[n] += ((match(p) ? 1 : .12) - G.fa[n]) * .08);
  if (G.mouse && !G.drag && speed > .3) setHover(pick(G.mouse.x, G.mouse.y));

  gl.clear(gl.COLOR_BUFFER_BIT);
  const [ax, ay] = asp(), F = 1.15, hw = vw / 2, hh = vh / 2, z = G.zoom, cw = cardW * z, ch = cardH * z;
  gl.uniform2f(U.uAsp, ax, ay); gl.uniform1f(U.uK, G.k); gl.uniform2f(U.uMouse, G.mu.x, G.mu.y); gl.uniform1f(U.uCA, Math.min(speed * .001, .015));
  const i0 = Math.floor((cam.x - F * hw / z) / cellW), i1 = Math.ceil((cam.x + F * hw / z) / cellW);
  const j0 = Math.floor((cam.y - F * hh / z) / cellH), j1 = Math.ceil((cam.y + F * hh / z) / cellH);
  for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) {
    const n = cell(i, j), p = P[n], px = (i * cellW - cardW / 2 - cam.x) * z, py = (j * cellH - cardH / 2 - cam.y) * z;
    const h0 = G.hc.get(i + ',' + j) || 0, hm = h0 * h0 * (3 - 2 * h0), sc = 1 + .035 * hm; // eased 0..1
    const qx = px - cw * (sc - 1) / 2, qy = py - ch * (sc - 1) / 2, qw = cw * sc, qh = ch * sc; // hovered card lifts toward the viewer
    gl.uniform1f(U.uZoom, 1); gl.uniform1f(U.uGray, 0); gl.uniform1f(U.uRip, 0);
    const lt = qh * TOP_H / CARD_H, lb = qh * BOT_H / CARD_H, by = qy + qh * (TOP_H + MEDIA_H) / CARD_H;
    for (const [tex, a] of [[p.labelTex, 1 - hm], [p.labelTexH, hm]]) { // plain labels crossfade into the hover state
      if (a < .01) continue;
      gl.uniform1f(U.uA, e * G.fa[n] * a); gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform4f(U.uRect, qx / hw, -qy / hh, qw / hw, -lt / hh); gl.uniform4f(U.uUV, 0, 0, 1, TOP_H / LAB_H);
      gl.drawElements(gl.TRIANGLES, nIdx, gl.UNSIGNED_SHORT, 0);
      gl.uniform4f(U.uRect, qx / hw, -by / hh, qw / hw, -lb / hh); gl.uniform4f(U.uUV, 0, TOP_H / LAB_H, 1, BOT_H / LAB_H);
      gl.drawElements(gl.TRIANGLES, nIdx, gl.UNSIGNED_SHORT, 0);
    }
    gl.uniform1f(U.uA, e * G.fa[n]);
    gl.uniform4f(U.uRect, qx / hw, -(qy + qh * TOP_H / CARD_H) / hh, qw / hw, -(qh * MEDIA_H / CARD_H) / hh); gl.uniform4f(U.uUV, ...p.uv);
    gl.uniform1f(U.uZoom, 1 - .08 * hm); gl.uniform1f(U.uGray, (1 - G.fa[n]) * 1.2); gl.uniform1f(U.uRip, hm);
    gl.bindTexture(gl.TEXTURE_2D, p.tex);
    if (p.video && p.el.readyState >= 2 && p.el.currentTime !== p.t) { // upload only the frames on screen
      p.t = p.el.currentTime; p.seen = now; gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, p.el);
    } else if (p.video) p.seen = now;
    gl.drawElements(gl.TRIANGLES, nIdx, gl.UNSIGNED_SHORT, 0);
  }
  if (now - lastCull > 1000) { lastCull = now; // pause clips that have been off screen for a while
    P.forEach(p => { if (!p.video) return; const off = now - (p.seen || 0) > 1500;
      if (off && !p.el.paused) p.el.pause(); else if (!off && p.el.paused) play(p); });
  }
}
let lastCull = 0;
function setHover(h) { if ((h?.i !== G.hover?.i || h?.j !== G.hover?.j) && h && !G.hc.has(h.i + ',' + h.j)) G.mu = { x: .5, y: .5 }; G.hover = h; cur.set(h && !G.drag ? 'View' : 'Drag'); }
cvs.addEventListener('pointerdown', e => { G.drag = { moved: 0, lx: e.clientX, ly: e.clientY }; G.vel.x = G.vel.y = 0; cvs.setPointerCapture(e.pointerId); P.forEach(play); });
cvs.addEventListener('pointermove', e => {
  G.mouse = { x: e.clientX, y: e.clientY };
  const d = G.drag;
  if (!d) return setHover(pick(e.clientX, e.clientY));
  const dx = e.clientX - d.lx, dy = e.clientY - d.ly; d.lx = e.clientX; d.ly = e.clientY; d.moved += Math.abs(dx) + Math.abs(dy);
  G.cam.x -= dx / G.zoom; G.cam.y -= dy / G.zoom; G.vel.x = -dx / G.zoom; G.vel.y = -dy / G.zoom;
  if (d.moved > 6) setHover(null);
});
const endDrag = e => {
  const d = G.drag; if (!d) return; G.drag = null;
  if (d.moved < 6) { const h = pick(e.clientX, e.clientY); if (h) location.hash = 'work/' + h.p.slug; G.vel.x = G.vel.y = 0; }
  else setHover(pick(e.clientX, e.clientY));
};
cvs.addEventListener('pointerup', endDrag); cvs.addEventListener('pointercancel', endDrag);
cvs.addEventListener('pointerleave', () => { G.mouse = null; setHover(null); });
cvs.addEventListener('wheel', e => { e.preventDefault(); G.vel.x += e.deltaX * .05; G.vel.y += e.deltaY * .05; }, { passive: false });

/* =========================== WORK: list =========================== */
const IX = { k: 'i', dir: 1 }, pv = $('#preview'), PV = { x: 0, y: 0 };
function renderIndex() {
  const rows = [...P].sort((a, b) => (a[IX.k] > b[IX.k] ? 1 : a[IX.k] < b[IX.k] ? -1 : 0) * IX.dir);
  $('#ibody').innerHTML = rows.map(p => `<a class="irow${match(p) ? '' : ' hide'}" href="#work/${p.slug}" data-i="${p.i}"><span class="mono">${p.no}</span><strong>${p.name}</strong><span>${p.client}</span><span class="tags">${p.cats.map(c => `<span>${c}</span>`).join('')}</span><span class="mono">${p.year}</span></a>`).join('');
  $$('#ihd button').forEach(b => { b.classList.toggle('on', b.dataset.k === IX.k); b.classList.toggle('asc', b.dataset.k === IX.k && IX.dir < 0); });
  $('#icount').textContent = P.filter(match).length;
}
$('#ihd').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; IX.dir = IX.k === b.dataset.k ? -IX.dir : 1; IX.k = b.dataset.k; renderIndex(); });
// hover preview that trails the cursor (list rows in colour, careers roles in black & white)
function showPreview(src, gray) { if (!fine) return; if (pv.getAttribute('src') !== src) pv.src = src; pv.classList.toggle('gs', gray); pv.classList.add('on'); }
$('#ibody').addEventListener('pointerover', e => { const a = e.target.closest('.irow'); if (a) showPreview(P[a.dataset.i].poster, false); });
$('#ibody').addEventListener('pointerleave', () => pv.classList.remove('on'));
$('#roles').addEventListener('pointerover', e => { const a = e.target.closest('a'); if (a) showPreview(a.dataset.img, true); });
$('#roles').addEventListener('pointerleave', () => pv.classList.remove('on'));
function previewFrame() {
  const dx = cur.x + 160 - PV.x; PV.x += dx * .14; PV.y += (cur.y - PV.y) * .14;
  pv.style.transform = `translate(${PV.x - 130}px,${PV.y - 162}px) rotate(${Math.max(-10, Math.min(10, dx * .08))}deg) scale(${pv.classList.contains('on') ? 1 : .85})`;
}

/* =========================== layout toggle, dock, filter =========================== */
function setView(v) {
  S.view = v; document.body.dataset.view = v;
  $$('.view').forEach(el => el.classList.toggle('on', el.dataset.view === v));
  $$('#views button').forEach(b => { b.classList.toggle('on', b.dataset.v === v); b.setAttribute('aria-selected', b.dataset.v === v); });
  setHover(null); cursorEl.classList.remove('on');
  if (v === 'space') G.intro = .35;
}
$('#views').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { if (location.hash.length > 1) location.hash = ''; setView(b.dataset.v); } });
function moveInd() { const a = $('#dock a.on'), ind = $('#dock .ind'); if (!a) return; ind.style.width = a.offsetWidth + 'px'; ind.style.transform = `translateX(${a.offsetLeft}px)`; }
const fil = $('#filter'), fbtn = $('.fbtn', fil);
$('#fmenu').innerHTML = ['All', ...CATS].map(c => `<button data-cat="${c}" class="${c === 'All' ? 'on' : ''}">${c}<span>${c === 'All' ? P.length : P.filter(p => p.cats.includes(c)).length}</span></button>`).join('');
const toggleFilter = o => { fil.classList.toggle('open', o); fbtn.setAttribute('aria-expanded', o); };
fbtn.addEventListener('click', () => toggleFilter(!fil.classList.contains('open')));
$('#fmenu').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
  S.filter = b.dataset.cat; $('#fcur').textContent = S.filter;
  $$('#fmenu button').forEach(x => x.classList.toggle('on', x === b)); renderIndex(); toggleFilter(false); });
addEventListener('pointerdown', e => { if (!e.target.closest('#filter')) toggleFilter(false); });

/* =========================== cursor, magnetic buttons =========================== */
const cursorEl = $('#cursor'), cur = { x: -300, y: -300, cx: -300, cy: -300, txt: null,
  set(t) { if (t !== this.txt) { this.txt = t; cursorEl.textContent = t; } } };
addEventListener('pointermove', e => {
  cur.x = e.clientX; cur.y = e.clientY;
  cursorEl.classList.toggle('on', !S.paused && e.target === cvs);
  const m = e.target.closest?.('.mag'); $$('.mag.pull').forEach(x => x !== m && (x.classList.remove('pull'), x.style.transform = ''));
  if (m && fine) { const r = m.getBoundingClientRect(); m.classList.add('pull');
    m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .2}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; }
});
function cursorFrame() { cur.cx += (cur.x - cur.cx) * .22; cur.cy += (cur.y - cur.cy) * .22; cursorEl.style.left = cur.cx + 'px'; cursorEl.style.top = cur.cy + 'px'; }

/* =========================== pages: reveals, split headings, counters, manifesto, accordion =========================== */
function split(el) { let i = 0; const walk = n => [...n.childNodes].forEach(c => {
  if (c.nodeType === 3) { const f = document.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach(t => { if (!t) return;
      if (/^\s+$/.test(t)) f.append(t); else { const w = document.createElement('span'); w.className = 'w'; w.innerHTML = `<span style="--i:${i++}">${t}</span>`; f.append(w); } });
    c.replaceWith(f); } else walk(c); }); walk(el); }
$$('[data-split]').forEach(split);
function countUp(el) {
  const m = el.dataset.count.match(/^([^\d]*)([\d.]+)(.*)$/); if (!m) return;
  const [, pre, num, suf] = m, end = parseFloat(num), dec = (num.split('.')[1] || '').length, t0 = performance.now();
  const step = t => { const k = Math.min(1, (t - t0) / 1500), v = end * (1 - Math.pow(1 - k, 4));
    el.innerHTML = `${pre}${v.toFixed(dec)}${suf ? `<sup>${suf}</sup>` : ''}`; if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
const rio = new IntersectionObserver(es => es.forEach(en => { if (!en.isIntersecting) return; const el = en.target;
  if (!el.closest('.panel.open')) return;
  el.classList.add('in'); rio.unobserve(el);
  $$('[data-count]', el).forEach(countUp); $$('.bars', el).forEach(b => b.classList.add('in')); }), { threshold: .12 });
function arm(root) { // restart every reveal inside a page that just opened
  const els = $$('[data-r],[data-split]', root);
  els.forEach(el => { el.classList.remove('in'); $$('.bars', el).forEach(b => b.classList.remove('in')); rio.unobserve(el); });
  setTimeout(() => els.forEach(el => rio.observe(el)), 260);
}
const mani = $('#mani');
mani.innerHTML = mani.textContent.split(' ').map(w => `<span>${w}</span>`).join(' ');
$('#studio').addEventListener('scroll', () => { // manifesto lights up word by word as it scrolls through the viewport
  const r = mani.getBoundingClientRect(), k = Math.min(1, Math.max(0, (innerHeight * .8 - r.top) / (r.height + innerHeight * .25)));
  const n = Math.round(k * mani.children.length); [...mani.children].forEach((s, i) => s.classList.toggle('lit', i < n));
}, { passive: true });
$$('.acc-h').forEach(h => h.addEventListener('click', () => { const a = h.parentElement, o = !a.classList.contains('open');
  $$('.acc').forEach(x => { x.classList.remove('open'); $('.acc-h', x).setAttribute('aria-expanded', false); });
  a.classList.toggle('open', o); h.setAttribute('aria-expanded', o); }));
$$('#studio,#careers,#contact,#project').forEach(el => el.appendChild($('#foot').content.cloneNode(true)));
document.addEventListener('click', e => { if (e.target.closest('.totop')) e.target.closest('.panel').scrollTo({ top: 0, behavior: 'smooth' }); });
// scale each .fit line so it spans its container exactly
function fitAll() { $$('.fit').forEach(el => { el.style.fontSize = '100px'; const w = el.firstElementChild.offsetWidth; if (w) el.style.fontSize = (100 * el.clientWidth / w * .99) + 'px'; }); }

/* copy-to-clipboard with toast */
const toastEl = $('#toast'); let toastT;
function toast(t) { toastEl.textContent = t; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), 2200); }
document.addEventListener('click', e => { const a = e.target.closest('.copy'); if (!a || !navigator.clipboard) return;
  e.preventDefault(); navigator.clipboard.writeText(a.dataset.copy).then(() => toast(`Copied ${a.dataset.copy}`), () => location.href = a.href); });

/* contact image strip */
const ASPECTS = [.8, 1.35, .75, 1.5, .9, 1.2, .8, 1.4];
$('#strip').innerHTML = `<div>${[...P, ...P].map((p, j) => `<figure style="--a:${ASPECTS[j % 8]}"><img src="${p.poster}" alt="" loading="lazy"></figure>`).join('')}</div>`;

/* =========================== project page + routing =========================== */
function renderProject(p) {
  const nx = P[(p.i + 1) % P.length], [sv, sf, sl] = p.stat;
  $('#proj').innerHTML = `
    <div class="eyebrow mono" data-r><span>(${p.no})</span><span>${p.cats.join(' · ')}</span></div>
    <h1 class="h1" id="proj-h" data-split>${p.name}</h1>
    <div class="pmeta mono">
      <div data-r>Client<b>${p.client}</b></div><div data-r style="--d:1">Year<b>${p.year}</b></div>
      <div data-r style="--d:2">Scope<b>${p.tags.join(', ')}</b></div><div data-r style="--d:3">${p.video ? 'Film' : 'Photo'}<b>${p.credit}</b></div>
    </div>
    <div class="pbody">
      ${p.video ? `<video class="hero gs" src="${p.video}" poster="${p.poster}" autoplay muted loop playsinline></video>` : `<img class="hero gs" src="${p.poster}" alt="${p.name} key visual">`}
      <div class="pside">
        <div class="stat" data-r><div><b data-count="${sv}">${sv}</b><p>${sl}</p></div><div class="bars" style="--f:${sf}"></div></div>
        <div class="pdesc" data-r style="--d:1">${p.desc}<ul class="tags" style="margin-top:22px">${p.cats.map(c => `<li>${c}</li>`).join('')}</ul></div>
      </div>
    </div>
    <a class="next" href="#work/${nx.slug}"><span><span class="mono muted" style="display:block;margin-bottom:12px">Next project (${nx.no})</span><span class="h2">${nx.name}</span></span><img class="gs" src="${nx.poster}" alt=""></a>`;
  split($('#proj-h'));
  $('#project').scrollTop = 0;
}
const TITLES = { studio: 'Studio', careers: 'Careers', contact: 'Contact' };
function route() {
  const h = location.hash.slice(1), p = h.startsWith('work/') && P.find(x => x.slug === h.slice(5));
  if (p) renderProject(p);
  const id = p ? 'project' : TITLES[h] ? h : null;
  $$('.panel').forEach(el => el.classList.toggle('open', el.id === id));
  document.body.classList.toggle('panel-open', !!id);
  $$('#dock a').forEach(a => a.classList.toggle('on', a.dataset.nav === (p || !id ? 'work' : h))); moveInd();
  document.title = (p ? p.name : TITLES[h] || 'Independent Creative Studio') + ' — Oblique®';
  S.paused = !!id; pv.classList.remove('on'); setHover(null); cursorEl.classList.remove('on'); toggleFilter(false);
  P.forEach(q => q.video && (id ? q.el.pause() : play(q)));
  if (id) { const el = $('#' + id); arm(el); if (!p) el.scrollTop = 0; fitAll(); setTimeout(() => el.focus({ preventScroll: true }), 60); }
}
addEventListener('hashchange', route);
addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (fil.classList.contains('open')) toggleFilter(false); else if (location.hash.length > 1) location.hash = ''; return; }
  if (S.paused || S.view !== 'space') return;
  const a = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
  if (a) { G.vel.x += a[0] * 12; G.vel.y += a[1] * 12; }
});
addEventListener('resize', resize);
document.addEventListener('visibilitychange', () => P.forEach(p => p.video && (document.hidden ? p.el.pause() : !S.paused && play(p))));

/* =========================== form + clock =========================== */
$('#form').addEventListener('submit', e => {
  e.preventDefault(); const f = new FormData(e.target);
  const body = `Name: ${f.get('name')}\nEmail: ${f.get('email')}\nCompany: ${f.get('company') || '-'}\nServices: ${f.getAll('svc').join(', ') || '-'}\nBudget: ${f.get('budget') || '-'}\n\n${f.get('msg')}`;
  location.href = `mailto:hello@oblique.studio?subject=${encodeURIComponent('New project — ' + f.get('name'))}&body=${encodeURIComponent(body)}`;
  toast('Opening your email app');
});
const tick = () => $('#clock').textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Europe/Lisbon', hour: '2-digit', minute: '2-digit' });
tick(); setInterval(tick, 10000);

/* =========================== boot =========================== */
function loop() {
  requestAnimationFrame(loop); cursorFrame(); previewFrame();
  if (S.ready && !S.paused && S.view === 'space' && gl) spaceFrame();
}
(async () => {
  const count = $('#count'), loader = $('#loader'), t0 = performance.now();
  let done = false;
  const finish = () => { // always runs, even if a font or the GPU context fails
    if (done) return; done = true;
    count.textContent = 100; loader.style.setProperty('--p', 100);
    loader.classList.add('done'); S.ready = true; route(); loop();
  };
  setTimeout(finish, 7000); // hard failsafe
  $('#lword').innerHTML = [...'Oblique'].map((c, i) => `<b style="--i:${i}">${c}</b>`).join('');
  const SPOTS = [[22, 7], [60, 6], [3, 36], [79, 34], [9, 69], [41, 72], [70, 67]];
  $('#clips').innerHTML = SPOTS.map(([x, y], i) => { const p = P[[6, 3, 8, 0, 14, 9, 15][i]], dx = (x + 9 - 50) * 1.4, dy = (y + 6 - 50) * 1.6;
    return `<div class="clip" style="--x:${x}vw;--y:${y}vh;--i:${i};--dx:${dx}vw;--dy:${dy}vh"><img src="${p.poster}" alt=""></div>`; }).join('');
  const wait = ms => new Promise(r => setTimeout(r, ms));
  if (location.protocol === 'file:') await new Promise(r => { // double-clicked, not served: load the inlined media
    const t = document.createElement('script'); t.src = 'media/inline.js'; t.onload = t.onerror = r; document.head.append(t);
  });
  const fonts = [`700 60px ${SANS}`, `600 38px ${SANS}`, `500 19px ${MONO}`].map(f => document.fonts.load(f).catch(() => {}));
  await Promise.race([Promise.allSettled(fonts), wait(900)]);
  requestAnimationFrame(() => requestAnimationFrame(() => loader.classList.add('ready')));

  // progress follows what has actually arrived; media keeps loading in the background after the site appears
  let loaded = 0; const total = P.length + 1;
  const bump = () => { const n = Math.min(99, Math.round(++loaded / total * 100)); count.textContent = n; loader.style.setProperty('--p', n); };
  const media = P.map(p => loadMedia(p).then(bump));
  bump();
  await Promise.race([Promise.allSettled(media), wait(2600)]);

  try { renderIndex(); resize(); if (gl) initGL(); } catch (e) { console.error(e); document.documentElement.classList.add('nogl'); }
  setView(gl && !document.documentElement.classList.contains('nogl') ? 'space' : 'index');
  await wait(Math.max(0, 1700 - (performance.now() - t0)));
  finish();
})();
