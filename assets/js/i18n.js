/* =============================================================================
   i18n.js — MOTEUR MULTILINGUE (FR / AR / EN) + RTL
   -----------------------------------------------------------------------------
   Principe :
   - Chaque élément HTML traduisible porte un attribut data-i18n="chemin.de.la.cle"
     (ex: data-i18n="hero.title"). Le texte est injecté depuis locales/<lang>.json.
   - Pour traduire un attribut (placeholder, aria-label...), on utilise
     data-i18n-attr="placeholder:contact.form.name_ph".
   - Le changement de langue est INSTANTANÉ (aucun rechargement de page) et bascule
     automatiquement en RTL pour l'arabe.
   ============================================================================= */

const I18N = {
  current: "fr",
  translations: {},          // cache des 3 langues chargées
  supported: ["fr", "ar", "en"],
  rtlLangs: ["ar"],

  /* Charge les 3 fichiers de langue une seule fois au démarrage */
  async init() {
    // Langue mémorisée, sinon langue du navigateur, sinon FR
    const saved = localStorage.getItem("lang");
    const browser = (navigator.language || "fr").slice(0, 2);
    const initial = saved || (this.supported.includes(browser) ? browser : "fr");

    // Chargement parallèle des 3 locales
    await Promise.all(
      this.supported.map(async (lang) => {
        try {
          const res = await fetch(`assets/locales/${lang}.json`);
          this.translations[lang] = await res.json();
        } catch (e) {
          console.error(`[i18n] Impossible de charger ${lang}.json`, e);
          this.translations[lang] = {};
        }
      })
    );

    this.setLang(initial, false);
  },

  /* Récupère une valeur imbriquée via un chemin "a.b.c" */
  get(lang, path) {
    return path.split(".").reduce((obj, key) => (obj ? obj[key] : undefined), this.translations[lang]);
  },

  /* Traduction publique — utilisée aussi par main.js pour les contenus dynamiques */
  t(path) {
    const val = this.get(this.current, path);
    return val !== undefined ? val : path;
  },

  /* Applique une langue à toute la page */
  setLang(lang, animate = true) {
    if (!this.supported.includes(lang)) lang = "fr";
    this.current = lang;
    localStorage.setItem("lang", lang);

    const isRTL = this.rtlLangs.includes(lang);
    const html = document.documentElement;

    // Direction + attribut lang (déclenche la bascule RTL en CSS)
    html.setAttribute("lang", lang);
    html.setAttribute("dir", isRTL ? "rtl" : "ltr");

    // Petit fondu pour une transition douce
    if (animate) {
      document.body.classList.add("lang-switching");
      setTimeout(() => document.body.classList.remove("lang-switching"), 250);
    }

    this.translate();
    this.updateMeta();
    this.updateSwitcherUI();

    // Événement custom : main.js réagit pour re-render les galeries dans la bonne langue
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
  },

  /* Parcourt le DOM et injecte les traductions */
  translate() {
    // 1. Contenu texte (innerHTML pour autoriser <br> dans les titres)
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const value = this.get(this.current, el.getAttribute("data-i18n"));
      if (value !== undefined) el.innerHTML = value;
    });

    // 2. Attributs (placeholder, aria-label, title, alt...)
    //    Format : data-i18n-attr="placeholder:contact.form.name_ph; aria-label:nav.home"
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.getAttribute("data-i18n-attr").split(";").forEach((pair) => {
        const [attr, path] = pair.split(":").map((s) => s.trim());
        const value = this.get(this.current, path);
        if (attr && value !== undefined) el.setAttribute(attr, value);
      });
    });
  },

  /* Met à jour <title> et la meta description */
  updateMeta() {
    const title = this.get(this.current, "meta.title");
    const desc = this.get(this.current, "meta.description");
    if (title) document.title = title;
    if (desc) {
      let m = document.querySelector('meta[name="description"]');
      if (m) m.setAttribute("content", desc);
    }
  },

  /* Met en surbrillance la langue active dans les sélecteurs */
  updateSwitcherUI() {
    document.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === this.current);
    });
  }
};

/* Branche les boutons de langue au chargement */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => I18N.setLang(btn.getAttribute("data-lang")));
  });
});
