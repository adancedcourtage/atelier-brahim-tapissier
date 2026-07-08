# Atelier Brahim — Site vitrine (Tapissier d'art)

Site vitrine statique, ultra-rapide, multilingue (FR / AR-RTL / EN).
**HTML + Tailwind (CDN) + JavaScript natif. Aucun build, aucune dépendance à installer.**

## 🚀 Lancer le site en local

Le site utilise `fetch()` pour charger les traductions : il faut un petit serveur
local (ouvrir le fichier en double-clic ne suffit pas).

```bash
cd Atelier_Brahim_Tapissier
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## 🖼️ Ajouter tes photos et vidéos

1. Dépose tes fichiers dans le bon dossier :

| Section              | Dossier                        |
|----------------------|--------------------------------|
| Accueil (hero)       | `assets/media/hero/`           |
| Literie              | `assets/media/literie/`        |
| Canapés              | `assets/media/canapes/`        |
| Fauteuils            | `assets/media/fauteuils/`      |
| Prestations / Salons | `assets/media/prestations/`    |
| Atelier (vidéos)     | `assets/media/atelier/`        |
| Instagram            | `assets/media/instagram/`      |

2. Déclare-les dans **`assets/js/data.js`** (le seul fichier à toucher pour les médias).
   Exemple pour ajouter un canapé :

```js
canapes: [
  { file: "mon-canape.jpg", type: "image", i18n: "canape_1" },
  // ...
]
```

- `type: "image"` ou `type: "video"` (mp4 recommandé).
- Si un fichier est absent, un joli placeholder s'affiche automatiquement
  (aucune image cassée).

> Astuce performance : compresse tes images en **.webp** ou **.jpg** (< 300 Ko),
> et tes vidéos en **.mp4** (H.264, < 5 Mo pour la boucle du hero).

## ✏️ Modifier les textes

Tout le contenu est dans **`assets/locales/`** :
- `fr.json` — Français
- `ar.json` — Arabe
- `en.json` — Anglais

Modifie la même clé dans les 3 fichiers pour garder la cohérence multilingue.

## 📞 Modifier tes coordonnées

Dans **`assets/js/data.js`**, section `contact` :
- `phone` / `phoneIntl` — téléphone affiché + format WhatsApp (Maroc = `212...`)
- `instagram` — ton pseudo (sans le `@`)
- `email`, `address`, `mapEmbed` (lien Google Maps de ton atelier)

Le bouton WhatsApp, le formulaire de devis et le bouton d'appel se mettent à jour
automatiquement.

## 🌍 Multilingue & RTL

- 3 langues commutables sans rechargement (boutons FR / ع / EN en haut à droite).
- L'arabe bascule automatiquement en **RTL** (`dir="rtl"`) et change de police (Cairo).
- La langue est mémorisée dans le navigateur du visiteur.

## 🌐 Mettre en ligne (gratuit)

- **Netlify** : glisse-dépose le dossier sur app.netlify.com/drop.
- **GitHub Pages** : pousse le dossier dans un repo, active Pages sur la branche `main`.

## 📁 Structure

```
Atelier_Brahim_Tapissier/
├── index.html              # Page unique
├── assets/
│   ├── css/style.css       # Styles, animations, RTL
│   ├── js/
│   │   ├── data.js         # ⭐ Médias + coordonnées
│   │   ├── i18n.js         # Moteur multilingue
│   │   └── main.js         # Galeries, scroll, WhatsApp
│   ├── locales/            # fr.json / ar.json / en.json
│   └── media/              # ⭐ Tes photos & vidéos
└── README.md
```

## 🔧 Passer en production (optionnel)

Tailwind est chargé via CDN pour la simplicité. Pour un poids optimal, tu peux
compiler Tailwind en CSS statique plus tard — mais ce n'est pas nécessaire pour
un site vitrine : le CDN reste très rapide.
