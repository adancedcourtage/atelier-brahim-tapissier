/* =============================================================================
   main.js — Logique du site
   - Rendu des galeries depuis data.js
   - Liens WhatsApp / Téléphone / Instagram (depuis SITE_CONFIG)
   - Envoi du formulaire vers WhatsApp
   - Animations au scroll (IntersectionObserver)
   - Menu mobile
   - Gestion élégante des médias manquants (placeholder au lieu d'image cassée)
   ============================================================================= */

document.addEventListener("DOMContentLoaded", async () => {
  await I18N.init();          // charge FR/AR/EN puis applique la langue
  bindContactLinks();
  renderHero();
  renderAllGalleries();
  renderStories();
  initStoryViewer();
  bindContactForm();
  initMobileMenu();
  initScrollReveal();

  // Re-render des galeries à chaque changement de langue (légendes traduites)
  document.addEventListener("langchange", () => {
    renderAllGalleries();
    renderStories();
    bindContactLinks(); // met à jour le message WhatsApp dans la bonne langue
  });
});

/* -------------------------------------------------------------------------
   Helpers médias : construit une balise img/video avec fallback automatique
   ------------------------------------------------------------------------- */
function mediaTag(path, item, extraClass = "") {
  const src = path + item.file;
  if (item.type === "video") {
    const poster = item.poster ? `poster="${path}${item.poster}"` : "";
    return `<video muted loop playsinline preload="metadata" ${poster} class="${extraClass}"
              onmouseover="this.play()" onmouseout="this.pause()"
              onerror="this.closest('.card-media,.gallery-item')?.classList.add('media-missing')">
              <source src="${src}" type="video/mp4"></video>`;
  }
  return `<img src="${src}" alt="" loading="lazy" class="${extraClass}"
            onerror="this.style.display='none';this.closest('.card-media,.gallery-item')?.classList.add('media-missing')">`;
}

/* -------------------------------------------------------------------------
   HERO
   ------------------------------------------------------------------------- */
function renderHero() {
  const el = document.getElementById("hero-media");
  if (!el) return;
  const h = SITE_CONFIG.hero;
  const p = MEDIA_PATHS.hero;

  if (h.type === "video") {
    el.innerHTML = `<video autoplay muted loop playsinline poster="${p}${h.image}"
        onerror="this.remove()"><source src="${p}${h.video}" type="video/mp4"></video>`;
  } else {
    el.innerHTML = `<img src="${p}${h.image}" alt="" onerror="this.remove()">`;
  }
}

/* -------------------------------------------------------------------------
   GALERIES (produits, prestations, atelier, instagram)
   ------------------------------------------------------------------------- */
function renderAllGalleries() {
  renderCards("grid-literie",     SITE_CONFIG.literie,     MEDIA_PATHS.literie);
  renderCards("grid-canapes",     SITE_CONFIG.canapes,     MEDIA_PATHS.canapes);
  renderCards("grid-fauteuils",   SITE_CONFIG.fauteuils,   MEDIA_PATHS.fauteuils);
  renderCards("grid-prestations", SITE_CONFIG.prestations, MEDIA_PATHS.prestations);
  renderGallery("grid-atelier",   SITE_CONFIG.atelier,     MEDIA_PATHS.atelier);
  renderInstagram();
}

/* Légende : soit une clé i18n ("gallery.xxx"), soit un objet {fr,ar,en}.
   Renvoie "" si l'item n'a pas de légende (rendu épuré, image seule). */
function captionOf(item) {
  if (item.i18n) return I18N.t("gallery." + item.i18n);
  if (item.title) return item.title[I18N.current] || item.title.fr || "";
  return "";
}

/* Cartes format portrait (produits & prestations) */
function renderCards(containerId, items, path) {
  const c = document.getElementById(containerId);
  if (!c) return;
  c.innerHTML = items.map((item) => {
    const cap = captionOf(item);
    return `
    <figure class="card reveal">
      <div class="card-media">
        <div class="card-media-fallback">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
          </svg>
        </div>
        ${mediaTag(path, item)}
      </div>
      ${cap ? `<figcaption class="p-4 text-sm text-muted">${cap}</figcaption>` : ""}
    </figure>`; }).join("");
  observeReveals(c);
}

/* Galerie carrée (atelier) */
function renderGallery(containerId, items, path) {
  const c = document.getElementById(containerId);
  if (!c) return;
  c.innerHTML = items.map((item) => `
    <div class="gallery-item reveal">
      <div class="gallery-fallback">${item.type === "video" ? "▶ Vidéo" : "Photo"}</div>
      ${mediaTag(path, item)}
      ${captionOf(item) ? `<div class="gallery-caption">${captionOf(item)}</div>` : ""}
    </div>`).join("");
  observeReveals(c);
}

/* Grille Instagram — chaque vignette pointe vers le profil */
function renderInstagram() {
  const c = document.getElementById("grid-instagram");
  if (!c) return;
  const url = "https://www.instagram.com/" + SITE_CONFIG.contact.instagram + "/";
  c.innerHTML = SITE_CONFIG.instagram.map((item) => `
    <a href="${url}" target="_blank" rel="noopener" class="gallery-item insta-item reveal">
      <div class="gallery-fallback">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
          <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/>
        </svg>
      </div>
      ${mediaTag(MEDIA_PATHS.instagram, { file: item.file, type: "image" })}
    </a>`).join("");
  observeReveals(c);
}

/* -------------------------------------------------------------------------
   LIENS DE CONTACT (WhatsApp, tel, Instagram) — remplis depuis SITE_CONFIG
   ------------------------------------------------------------------------- */
function bindContactLinks() {
  const cfg = SITE_CONFIG.contact;
  const waMsg = encodeURIComponent(cfg.whatsappDefaultMsg[I18N.current] || cfg.whatsappDefaultMsg.fr);
  const waUrl = `https://wa.me/${cfg.phoneIntl}?text=${waMsg}`;
  const telUrl = `tel:+${cfg.phoneIntl}`;
  const igUrl = `https://www.instagram.com/${cfg.instagram}/`;

  document.querySelectorAll("[data-link='whatsapp']").forEach((a) => (a.href = waUrl));
  document.querySelectorAll("[data-link='tel']").forEach((a) => (a.href = telUrl));
  document.querySelectorAll("[data-link='instagram']").forEach((a) => (a.href = igUrl));
  document.querySelectorAll("[data-fill='phone']").forEach((el) => (el.textContent = cfg.phone));
  document.querySelectorAll("[data-fill='email']").forEach((el) => {
    el.textContent = cfg.email; el.href = "mailto:" + cfg.email;
  });
  document.querySelectorAll("[data-fill='address']").forEach((el) => {
    el.textContent = cfg.address[I18N.current] || cfg.address.fr;
  });
  document.querySelectorAll("[data-fill='shop']").forEach((el) => (el.textContent = cfg.shopName || ""));
  // Lien "ouvrir dans Google Maps" vers les coordonnées exactes
  document.querySelectorAll("[data-link='maps']").forEach((a) => {
    a.href = "https://www.google.com/maps/search/?api=1&query=33.69794,-7.36530";
  });
  document.querySelectorAll("[data-fill='instagram']").forEach((el) => (el.textContent = "@" + cfg.instagram));

  const map = document.getElementById("map-frame");
  if (map && cfg.mapEmbed) map.src = cfg.mapEmbed;
}

/* -------------------------------------------------------------------------
   FORMULAIRE → WhatsApp
   Le devis n'a pas de back-end : on compose un message WhatsApp pré-rempli.
   ------------------------------------------------------------------------- */
function bindContactForm() {
  const form = document.getElementById("quote-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const cfg = SITE_CONFIG.contact;
    const data = new FormData(form);
    const L = I18N.t("contact.form"); // labels dans la langue courante

    const lines = [
      `${L.name}: ${data.get("name") || "-"}`,
      `${L.phone}: ${data.get("phone") || "-"}`,
      `${L.type}: ${data.get("type") || "-"}`,
      `${L.message}: ${data.get("message") || "-"}`
    ];
    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${cfg.phoneIntl}?text=${text}`, "_blank", "noopener");
  });
}

/* -------------------------------------------------------------------------
   MENU MOBILE
   ------------------------------------------------------------------------- */
function initMobileMenu() {
  const btn = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!btn || !menu) return;
  const toggle = () => menu.classList.toggle("hidden-menu");
  btn.addEventListener("click", toggle);
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => menu.classList.add("hidden-menu")));
}

/* -------------------------------------------------------------------------
   ANIMATIONS AU SCROLL
   ------------------------------------------------------------------------- */
let _observer;
function initScrollReveal() {
  _observer = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-visible"); _observer.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  observeReveals(document);
}
function observeReveals(scope) {
  if (!_observer) return;
  scope.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => _observer.observe(el));
}

/* =========================================================================
   STORIES — bulles + visionneuse plein écran (style Instagram)
   -------------------------------------------------------------------------
   PERFORMANCE : les bulles n'affichent qu'une IMAGE de couverture (poster).
   Aucune vidéo n'est chargée tant que l'utilisateur n'a pas cliqué.
   La vidéo HD n'est injectée dans le DOM (preload="auto") qu'à l'ouverture.
   ========================================================================= */

const STORY = { list: [], index: 0, video: null, raf: 0, seen: new Set() };

/* Rendu de la rangée de bulles */
function renderStories() {
  const row = document.getElementById("stories-row");
  if (!row) return;
  STORY.list = SITE_CONFIG.stories || [];
  const p = MEDIA_PATHS.stories;
  row.innerHTML = STORY.list.map((s, i) => {
    const label = s.i18n ? I18N.t("gallery." + s.i18n) : (s.label || "");
    const seen = STORY.seen.has(i) ? " seen" : "";
    return `
      <button class="story-bubble${seen}" role="listitem" data-idx="${i}"
              aria-label="${label || ("Story " + (i + 1))}">
        <span class="story-ring">
          <img class="story-thumb" src="${p}${s.poster}" alt="" loading="lazy"
               onerror="this.style.visibility='hidden'">
          ${i === 0 ? `<span class="story-live" data-i18n="stories.badge">Live</span>` : ""}
        </span>
        ${label ? `<span class="story-label">${label}</span>` : ""}
      </button>`;
  }).join("");
  row.querySelectorAll(".story-bubble").forEach((b) =>
    b.addEventListener("click", () => openStory(parseInt(b.dataset.idx, 10)))
  );
  // Re-traduit le badge "Live"
  I18N.translate();
  observeReveals(row);
}

/* Initialise les contrôles de la visionneuse (une seule fois) */
function initStoryViewer() {
  const v = document.getElementById("story-viewer");
  if (!v) return;
  const isRTL = () => document.documentElement.getAttribute("dir") === "rtl";

  document.getElementById("sv-close").addEventListener("click", closeStory);
  document.getElementById("sv-arrow-prev").addEventListener("click", (e) => { e.stopPropagation(); prevStory(); });
  document.getElementById("sv-arrow-next").addEventListener("click", (e) => { e.stopPropagation(); nextStory(); });

  // Zones de tap : en RTL, on inverse (droite = précédent)
  document.getElementById("sv-tap-left").addEventListener("click", () => (isRTL() ? nextStory() : prevStory()));
  document.getElementById("sv-tap-right").addEventListener("click", () => (isRTL() ? prevStory() : nextStory()));

  // Fond cliqué (hors cadre) = fermer
  v.addEventListener("click", (e) => { if (e.target === v) closeStory(); });

  // Clavier
  document.addEventListener("keydown", (e) => {
    if (!v.classList.contains("open")) return;
    if (e.key === "Escape") closeStory();
    else if (e.key === "ArrowLeft") isRTL() ? nextStory() : prevStory();
    else if (e.key === "ArrowRight") isRTL() ? prevStory() : nextStory();
    else if (e.key === " ") { e.preventDefault(); toggleStoryPause(); }
  });
}

/* Ouvre la visionneuse sur la story i */
function openStory(i) {
  const v = document.getElementById("story-viewer");
  buildProgress();
  v.classList.add("open");
  v.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  loadStory(i);
}

/* Construit les segments de progression (1 par story) */
function buildProgress() {
  const prog = document.getElementById("sv-progress");
  prog.innerHTML = STORY.list.map(() => `<span class="sv-seg"><i></i></span>`).join("");
}

/* Charge et lit la story i (injecte la vidéo HD ici seulement) */
function loadStory(i) {
  if (i < 0) i = 0;
  if (i >= STORY.list.length) { closeStory(); return; }
  STORY.index = i;
  STORY.seen.add(i);
  const s = STORY.list[i];
  const stage = document.getElementById("sv-stage");
  const p = MEDIA_PATHS.stories;

  // Segments : avant = pleins, après = vides
  const segs = document.querySelectorAll("#sv-progress .sv-seg");
  segs.forEach((seg, k) => {
    seg.classList.toggle("done", k < i);
    seg.querySelector("i").style.width = k < i ? "100%" : "0%";
  });

  // Légende
  const cap = s.i18n ? I18N.t("gallery." + s.i18n) : (s.label || "");
  document.getElementById("sv-cap").textContent = cap;
  // Avatar = poster de la 1re story
  const av = document.getElementById("sv-avatar");
  if (STORY.list[0]) av.src = p + STORY.list[0].poster;

  // (Re)crée la vidéo HD — chargée dynamiquement uniquement maintenant.
  // Poster NET affiché avant lecture (aucun fond flouté).
  cancelAnimationFrame(STORY.raf);
  stage.innerHTML =
    `<video playsinline autoplay muted preload="auto" poster="${p}${s.poster}"></video>`;
  const video = stage.querySelector("video");
  STORY.video = video;
  const source = document.createElement("source");
  source.src = p + s.video; source.type = "video/mp4";
  video.appendChild(source);
  video.muted = true; video.volume = 0;   // Vidéos sans son

  video.addEventListener("ended", nextStory);
  video.addEventListener("timeupdate", () => tickProgress(i));
  video.play().catch(() => {});
  // Barre de progression fluide
  const loop = () => {
    if (STORY.video === video && video.duration) tickProgress(i);
    STORY.raf = requestAnimationFrame(loop);
  };
  STORY.raf = requestAnimationFrame(loop);

  updateStoryBubbleSeen();
}

function tickProgress(i) {
  const video = STORY.video;
  const seg = document.querySelectorAll("#sv-progress .sv-seg")[i];
  if (!video || !seg || !video.duration) return;
  const pct = Math.min(100, (video.currentTime / video.duration) * 100);
  seg.querySelector("i").style.width = pct + "%";
}

function nextStory() { loadStory(STORY.index + 1); }
function prevStory() { loadStory(STORY.index - 1); }

function toggleStoryPause() {
  const v = STORY.video; if (!v) return;
  v.paused ? v.play().catch(() => {}) : v.pause();
}

function closeStory() {
  const v = document.getElementById("story-viewer");
  cancelAnimationFrame(STORY.raf);
  if (STORY.video) { STORY.video.pause(); STORY.video.removeAttribute("src"); STORY.video.load(); STORY.video = null; }
  document.getElementById("sv-stage").innerHTML = "";
  v.classList.remove("open");
  v.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  updateStoryBubbleSeen();
}

/* Marque visuellement les bulles déjà vues */
function updateStoryBubbleSeen() {
  document.querySelectorAll(".story-bubble").forEach((b) => {
    b.classList.toggle("seen", STORY.seen.has(parseInt(b.dataset.idx, 10)));
  });
}
