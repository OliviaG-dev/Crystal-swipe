# Crystal Swipe

**Écoute ton ressenti, découvre ta pierre**

Crystal Swipe est une expérience ludique et intuitive qui te connecte à ton énergie du moment grâce aux pierres et cristaux. Swipe les situations et les émotions qui te ressemblent, et découvre les pierres qui résonnent le plus avec toi aujourd'hui.

## Concept

Marre des quizz compliqués et des pierres mystérieuses ? Il te suffit de swiper tes ressentis pour obtenir instantanément ton **match énergétique** : une façon légère et interactive de découvrir la lithothérapie, sans prise de tête.

## Fonctionnalités

- **Swipe intuitif** : gauche = non, droite = oui (souris, trackpad ou tactile)
- **Passer & retour** : ignorer une question ou revenir en arrière ; les questions passées ne comptent pas dans le score
- **Gestes tactiles** (≤ 1024px) : horizontal pour non/oui, vertical pour passer/retour ; boutons dédiés sur desktop
- **Questions mélangées** à chaque session pour varier l’expérience
- **3 pierres matchées** : principale, secondaire et complémentaire, avec pourcentage relatif au meilleur score
- **Fiches pierre** (`/stones/:stoneId`) : sens, chakra, rituel, associations et lien depuis les cartes résultats
- **Historique local** : jusqu’à 10 tirages (`localStorage`), dernier tirage sur l’accueil, liste paginée (2 par page) sur les résultats
- **Responsive** : interface adaptée mobile, tablette et desktop

## Parcours utilisateur

| Étape | Route | Description |
|-------|--------|-------------|
| Accueil | `/` | Présentation, CTA et carte du **dernier** tirage (lien vers la fiche pierre) |
| Swipe | `/swipe` | 20 questions avec barre de progression |
| Résultats | `/results` | Top 3 pierres, actions, section **Historique** (pagination, effacement) |
| Fiche pierre | `/stones/:stoneId` | Détail complet d’une pierre |

## Données

- **20 questions** (`src/data/questions.ts`) — texte, icône (`/icons/`) et points par pierre
- **11 pierres** (`src/data/stones.ts`) — nom, visuel (`/pierres/`), propriétés, usage, couleur du match et contenu fiche détaillée

Le score est calculé dans `src/utils/scoring.ts` à partir des réponses « oui » uniquement. Les pourcentages affichés sont **relatifs** au pierre la mieux classée (100 % = score max de la session).

## Installation

**Prérequis** : Node.js 18+

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build production
npm run preview  # prévisualiser le build
npm run lint          # ESLint
npm run test          # Vitest (mode watch)
npm run test:run      # Vitest (une passe)
npm run test:coverage # couverture unit/integration (Vitest)
npm run test:e2e      # Playwright E2E (headless)
npm run test:e2e:ui   # Playwright E2E (UI)
```

Les tests couvrent les utils, composants (`Button`, `Header`, `StoneCard`, `SwipeCard`) et les pages (`Home`, `Swipe`, `Results`, `StoneDetail`) — Vitest + Testing Library.

Les scénarios E2E Playwright couvrent les parcours critiques : quiz complet (`/` → `/swipe` → `/results`), pagination/effacement d'historique et ouverture d'une fiche pierre.

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
│   │   ├── Results/
│   │   └── StoneDetail/
│   ├── data/
│   │   ├── questions.ts
│   │   └── stones.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       ├── scoring.ts
│       ├── history.ts
│       ├── dateFormat.ts
│       ├── historyPagination.ts
│       ├── sessionStorage.ts
│       ├── swipeResults.ts
│       └── swipeSession.ts
├── tests/
│   └── e2e/
│       └── app.spec.ts
├── playwright.config.ts
├── index.html
└── package.json
```

Chaque composant et chaque page a son dossier avec `.tsx` et `.css`.

## Stockage local

| Clé | Rôle |
|-----|------|
| `swipeResults` | Réponses de la session en cours |
| `swipeSession` | Métadonnées (id, date, résultats) |
| `swipeHistory` | Historique des tirages (max. 10 entrées, plus récent en premier) |

## Interface responsive

| Zone | Comportement |
|------|----------------|
| Swipe ≤ 1024px | Gestes tactiles, indices colorés, pas de boutons PASSER/RETOUR |
| Swipe > 1024px | Boutons PASSER / RETOUR, indices avec icônes |
| Historique (résultats) ≤ 1024px | Titre **Historique** sur une ligne, bouton effacer en croix |
| Historique (résultats) | Pagination 2 entrées par page si plus de 2 tirages |

## Design

- **Ton** : léger, fun, inspirant
- **Palette** : violet `#9966cc`, bleu `#4a90e2`, lavande ; indices swipe (rouge / vert / or / violet)
- **UI** : cartes glassmorphism, icônes SVG, dégradés type cristal

## Stack

- React 19 · TypeScript · Vite 7 · React Router DOM 7

## License

MIT
