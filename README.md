# 💎 Crystal Swipe

**Écoute ton ressenti, découvre ta pierre**

Crystal Swipe est une expérience ludique et intuitive qui te connecte à ton énergie du moment grâce aux pierres et cristaux. Swipe les situations et les émotions qui te ressemblent, et découvre les pierres qui résonnent le plus avec toi aujourd'hui. Simple, fun et inspirant !

## 🎯 Concept

Marre des quizz compliqués et des pierres mystérieuses ? Avec Crystal Swipe, il te suffit de swiper tes ressentis et d'obtenir instantanément ton match énergétique. Une façon légère et interactive de découvrir la lithothérapie, sans prise de tête !

## ✨ Fonctionnalités

- 🎮 **Fun & Intuitif** : Swipes simples, rapide, comme un jeu (← / →)
- 💎 **Personnalisé** : Chaque résultat correspond à ton état du moment
- 🔮 **Éducatif** : Découvre les propriétés des pierres de manière ludique
- 📱 **Responsive** : Fonctionne parfaitement sur mobile et desktop

## 🗺️ Parcours

1. **Accueil** : Présentation du concept et lancement du swipe
2. **Swipe** : Réponds aux questions en swipant à gauche (non) ou à droite (oui)
3. **Résultats** : Découvre tes 3 pierres matchées avec pourcentage, propriétés et conseil du jour

## 🚀 Installation

```bash
# Cloner le repo (si besoin)
# git clone <url>
# cd crystal-swipe

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build
npm run preview

# Linter
npm run lint
```

## 📁 Architecture

```
src/
├── components/          # Composants réutilisables
│   ├── Button/
│   ├── Header/
│   ├── SwipeCard/
│   └── StoneCard/
├── pages/
│   ├── Home/
│   ├── Swipe/
│   └── Results/
├── data/                # questions.ts, stones.ts
├── types/               # Types TypeScript (SwipeResult, MatchResult, etc.)
└── utils/               # scoring.ts (calcul des matchs)
```

Chaque composant/page a son dossier avec `.tsx` et `.css`.

## 🎨 Design

- **Ton** : Léger, fun, inspirant
- **Palette** : Violet (#9966cc), bleu (#4a90e2), lavande — ambiance cristaux
- **Style** : Cartes glassmorphism, icônes SVG thématiques, typo moderne

## 🛠️ Stack

- **React 19** + **TypeScript**
- **Vite 7**
- **React Router DOM 7**

## 📝 License

MIT
