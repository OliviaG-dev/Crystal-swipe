# Crystal Swipe

**Écoute ton ressenti, découvre ta pierre**

Crystal Swipe est une expérience ludique et intuitive qui te connecte à ton énergie du moment grâce aux pierres et cristaux. Swipe les situations et les émotions qui te ressemblent, et découvre les pierres qui résonnent le plus avec toi aujourd'hui.

## Concept

Marre des quizz compliqués et des pierres mystérieuses ? Il te suffit de swiper tes ressentis pour obtenir instantanément ton **match énergétique** : une façon légère et interactive de découvrir la lithothérapie, sans prise de tête.

## Fonctionnalités

- **Swipe intuitif** : gauche = non, droite = oui (souris, trackpad ou tactile)
- **Questions mélangées** à chaque session pour varier l’expérience
- **3 pierres matchées** : principale, secondaire et complémentaire, avec barre de pourcentage
- **Fiches détaillées** : description, propriétés et conseil du jour par pierre
- **Historique local** : jusqu’à 10 tirages sauvegardés (`localStorage`), aperçu sur l’accueil et liste complète sur les résultats
- **Responsive** : interface adaptée mobile, tablette et desktop

## Parcours utilisateur

| Étape | Route | Description |
|-------|--------|-------------|
| Accueil | `/` | Présentation, CTA et derniers tirages (3 max.) |
| Swipe | `/swipe` | 20 questions avec barre de progression |
| Résultats | `/results` | Top 3 pierres, actions et historique |

## Données

- **20 questions** (`src/data/questions.ts`) — texte, icône (`/icons/`) et points par pierre
- **11 pierres** (`src/data/stones.ts`) — nom, visuel (`/pierres/`), propriétés, usage et couleur du match

Le score est calculé dans `src/utils/scoring.ts` à partir des réponses « oui ».

## Installation

**Prérequis** : Node.js 18+

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build production
npm run preview  # prévisualiser le build
npm run lint     # ESLint
```

## Architecture

```
crystal-swipe/
├── public/
│   ├── logo.png
│   ├── icons/          # icônes des questions + swipe
│   └── pierres/        # visuels des pierres
├── src/
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   ├── index.css
│   ├── components/
│   │   ├── Button/
│   │   ├── Header/
│   │   ├── SwipeCard/
│   │   └── StoneCard/
│   ├── pages/
│   │   ├── Home/
│   │   ├── Swipe/
│   │   └── Results/
│   ├── data/
│   │   ├── questions.ts
│   │   └── stones.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       ├── scoring.ts
│       └── history.ts
├── index.html
└── package.json
```

Chaque composant et chaque page a son dossier avec `.tsx` et `.css`.

## Stockage local

| Clé | Rôle |
|-----|------|
| `swipeResults` | Réponses de la session en cours |
| `swipeSession` | Métadonnées (id, date, résultats) |
| `swipeHistory` | Historique des tirages (max. 10 entrées) |

## Design

- **Ton** : léger, fun, inspirant
- **Palette** : violet `#9966cc`, bleu `#4a90e2`, lavande
- **UI** : cartes glassmorphism, icônes SVG, dégradés type cristal

## Stack

- React 19 · TypeScript · Vite 7 · React Router DOM 7

## License

MIT
