# 💎 Crystal Swipe

**Écoute ton ressenti, découvre ta pierre**

Crystal Swipe est une expérience ludique et intuitive qui te connecte à ton énergie du moment grâce aux pierres et cristaux. Swipe les situations et les émotions qui te ressemblent, et découvre les pierres qui résonnent le plus avec toi aujourd'hui. Simple, fun et inspirant !

## 🎯 Concept

Marre des quizz compliqués et des pierres mystérieuses ? Avec Crystal Swipe, il te suffit de swiper tes ressentis et d'obtenir instantanément ton match énergétique. Une façon légère et interactive de découvrir la lithothérapie, sans prise de tête !

## ✨ Fonctionnalités

- 🎮 **Fun & Intuitif** : Swipes simples, rapide, comme un jeu
- 💎 **Personnalisé** : Chaque résultat correspond à ton état du moment
- 🔮 **Éducatif** : Découvre les propriétés des pierres de manière ludique
- 📱 **Responsive** : Fonctionne parfaitement sur mobile et desktop

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build
npm run preview
```

## 📁 Architecture

Le projet suit une architecture modulaire où chaque page et composant a son propre dossier avec ses fichiers `.tsx` et `.css` :

```
src/
├── components/          # Composants réutilisables
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.css
│   ├── Header/
│   ├── SwipeCard/
│   └── StoneCard/
├── pages/              # Pages de l'application
│   ├── Home/
│   │   ├── Home.tsx
│   │   └── Home.css
│   ├── Swipe/
│   └── Results/
├── data/               # Données (questions, pierres)
├── types/              # Types TypeScript
└── utils/              # Utilitaires (scoring, etc.)
```

## 🎨 Design

- **Ton** : Léger, fun, inspirant
- **Style visuel** : Couleurs minérales / cristaux, typographie moderne et épurée
- **Ambiance** : Mystique mais accessible, pas trop "ésotérique"

## 🛠️ Technologies

- React 19
- TypeScript
- Vite
- React Router DOM

## 📝 License

MIT
