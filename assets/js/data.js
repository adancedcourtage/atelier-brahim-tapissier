/* =============================================================================
   data.js — CONFIGURATION CENTRALE DU SITE
   -----------------------------------------------------------------------------
   ⭐ C'EST LE SEUL FICHIER (avec les locales/*.json) QUE TU AS BESOIN DE MODIFIER.

   Ici tu déclares :
   1. Tes coordonnées (téléphone, WhatsApp, Instagram, email, adresse)
   2. Tes médias (photos / vidéos) rangés par section

   COMMENT AJOUTER UNE PHOTO ?
   - Dépose ton fichier dans assets/media/<dossier>/  (ex: assets/media/canapes/)
   - Ajoute une ligne dans le tableau correspondant ci-dessous avec le nom du fichier.
   - Le titre/description s'affiche automatiquement dans les 3 langues via une clé
     de traduction (voir assets/locales/*.json). Tu peux aussi mettre du texte brut.

   COMMENT AJOUTER UNE VIDÉO ?
   - Même principe, avec "type: 'video'".
   ============================================================================= */

const SITE_CONFIG = {

  /* ---------------------------------------------------------------------------
     1. COORDONNÉES — modifie ici tes informations de contact
     --------------------------------------------------------------------------- */
  contact: {
    phone: "0661975574",              // Numéro affiché
    phoneIntl: "212661975574",        // Format international SANS le "+" ni le "0" initial (Maroc = 212) -> pour WhatsApp / tel:
    whatsappDefaultMsg: {             // Message pré-rempli du bouton WhatsApp, par langue
      fr: "Bonjour, je souhaite un devis pour une prestation de tapisserie.",
      ar: "مرحبا، أرغب في الحصول على عرض سعر لخدمة التنجيد.",
      en: "Hello, I would like a quote for an upholstery service."
    },
    instagram: "Brahim_ait_soussi",   // Sans le "@"
    email: "contact@atelier-brahim.ma",
    // Nom de la boutique (affiché dans la section contact et le pied de page)
    shopName: "ريحانة",
    address: {
      fr: "Boutique ريحانة — Boulevard Mohamed VI, 28820 Mohammédia, Maroc",
      ar: "متجر ريحانة — شارع محمد السادس، 28820 المحمدية، المغرب",
      en: "Rihana Store — Boulevard Mohamed VI, 28820 Mohammedia, Morocco"
    },
    // Carte Google Maps centrée sur les coordonnées exactes (33.69794, -7.36530)
    mapEmbed: "https://www.google.com/maps?q=33.69794,-7.36530&z=17&output=embed"
  },

  /* ---------------------------------------------------------------------------
     2. MÉDIAS DU HERO (Accueil) — vidéo de fond OU image de fond
     --------------------------------------------------------------------------- */
  hero: {
    // Mets "video" pour une vidéo de fond, ou "image" pour une photo.
    type: "image",
    // Si type = "video" : dépose ta vidéo dans assets/media/hero/ et mets le nom ici
    video: "atelier-loop.mp4",
    // Image de fond (ou poster de la vidéo). Placeholder gradient si le fichier est absent.
    image: "hero-atelier.jpg"
  },

  /* ---------------------------------------------------------------------------
     3. GALERIES PAR SECTION
     Chaque entrée :
       { file: "nom-du-fichier.jpg", type: "image"|"video", i18n: "cle_de_traduction" }
     - "i18n" pointe vers une clé dans locales/*.json (objet "gallery").
       Si tu préfères du texte direct, remplace par: title:{fr:"..",ar:"..",en:".."}
     --------------------------------------------------------------------------- */
  literie: [
    { file: "literie-1.jpg",  type: "image" },
    { file: "literie-2.jpg",  type: "image" },
    { file: "literie-3.jpg",  type: "image" },
    { file: "literie-4.jpg",  type: "image" },
    { file: "literie-5.jpg",  type: "image" },
    { file: "literie-6.jpg",  type: "image" },
    { file: "literie-7.jpg",  type: "image" },
    { file: "literie-8.jpg",  type: "image" },
    { file: "literie-9.jpg",  type: "image" },
    { file: "literie-10.jpg", type: "image" }
  ],

  canapes: [
    { file: "canape-1.jpg",  type: "image" },
    { file: "canape-2.jpg",  type: "image" },
    { file: "canape-3.jpg",  type: "image" },
    { file: "canape-4.jpg",  type: "image" },
    { file: "canape-5.jpg",  type: "image" },
    { file: "canape-6.jpg",  type: "image" },
    { file: "canape-7.jpg",  type: "image" },
    { file: "canape-8.jpg",  type: "image" },
    { file: "canape-9.jpg",  type: "image" },
    { file: "canape-10.jpg", type: "image" },
    { file: "canape-11.jpg", type: "image" },
    { file: "canape-12.jpg", type: "image" }
  ],

  fauteuils: [
    { file: "fauteuil-1.jpg", type: "image" },
    { file: "fauteuil-2.jpg", type: "image" },
    { file: "fauteuil-3.jpg", type: "image" }
  ],

  // Les 3 prestations gardent une légende (LED / agencement / ambiance)
  prestations: [
    { file: "presta-1.jpg", type: "image", i18n: "presta_led" },
    { file: "presta-2.jpg", type: "image", i18n: "presta_agencement" },
    { file: "presta-3.jpg", type: "image", i18n: "presta_ambiance" }
  ],

  /* ---------------------------------------------------------------------------
     4. ATELIER — vidéos de salons finis + photos du magasin / savoir-faire
     Les vidéos se lancent au survol (poster affiché au repos).
     --------------------------------------------------------------------------- */
  atelier: [
    { file: "atelier-video-1.mp4", type: "video", poster: "atelier-video-1.jpg", i18n: "atelier_video" },
    { file: "atelier-video-2.mp4", type: "video", poster: "atelier-video-2.jpg" },
    { file: "atelier-video-3.mp4", type: "video", poster: "atelier-video-3.jpg" },
    { file: "atelier-video-4.mp4", type: "video", poster: "atelier-video-4.jpg" },
    { file: "atelier-1.jpg", type: "image", i18n: "atelier_1" },
    { file: "atelier-2.jpg", type: "image", i18n: "atelier_2" },
    { file: "atelier-3.jpg", type: "image" },
    { file: "atelier-4.jpg", type: "image" },
    { file: "atelier-5.jpg", type: "image" }
  ],

  /* ---------------------------------------------------------------------------
     5. INSTAGRAM — visuels du feed (@Brahim_ait_soussi)
     Chaque vignette renvoie vers ton profil Instagram au clic.
     --------------------------------------------------------------------------- */
  instagram: [
    { file: "insta-1.jpg" },
    { file: "insta-2.jpg" },
    { file: "insta-3.jpg" },
    { file: "insta-4.jpg" },
    { file: "insta-5.jpg" },
    { file: "insta-6.jpg" }
  ]
};

// Chemins de base des médias (ne pas modifier sauf si tu réorganises les dossiers)
const MEDIA_PATHS = {
  hero: "assets/media/hero/",
  literie: "assets/media/literie/",
  canapes: "assets/media/canapes/",
  fauteuils: "assets/media/fauteuils/",
  prestations: "assets/media/prestations/",
  atelier: "assets/media/atelier/",
  instagram: "assets/media/instagram/"
};
