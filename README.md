# Fabric Stock Management System

Un système de gestion de stock de tissus moderne avec une interface utilisateur sombre professionnelle, développé avec React et Tailwind CSS.

## 🚀 Fonctionnalités

### 6 Pages Principales

1. **Dashboard** - Vue d'ensemble avec statistiques
   - Nombre d'articles stockés et déstockés
   - Activité récente
   - Taux de rotation

2. **Stockage** - Ajouter des articles au stock
   - Formulaire avec code article et emplacement (0101-1099)
   - Affichage des 6 derniers articles stockés
   - Logique +1 par échantillon

3. **Déstockage** - Déplacer ou sortir des articles
   - Formulaire avec code article, emplacement actuel et nouveau
   - Support pour SORTIE, RETOUR, MAINTENANCE
   - Historique des 6 derniers déstockages

4. **Recherche par Emplacement** - Rechercher des articles
   - Recherche par emplacement ou code article
   - Affichage des résultats avec détails

5. **Bon de Sortie** - Gestion des bons de sortie
   - Liste des bons avec statuts (Brouillon, Confirmé, Annulé)
   - Génération PDF
   - Actions de confirmation et suppression

6. **Ajouter Article** - Créer de nouveaux articles
   - Formulaire simple avec code et libellé
   - Liste des articles existants
   - Validation des doublons

## 🎨 Design

- **Interface sombre** inspirée du style Manus UI
- **Navigation latérale** avec icônes Lucide React
- **Composants UI** modernes avec shadcn/ui
- **Responsive design** compatible mobile et desktop
- **Animations fluides** avec Framer Motion

## 🛠️ Technologies

- **React 19.1.0** - Framework frontend
- **Tailwind CSS 4.1.7** - Framework CSS utilitaire
- **React Router DOM 7.6.1** - Routage
- **Lucide React 0.510.0** - Icônes
- **shadcn/ui** - Composants UI
- **Vite 6.3.5** - Build tool

## 📁 Structure du Projet

```
src/
├── components/
│   ├── layout/
│   │   ├── Layout.jsx      # Layout principal
│   │   └── Sidebar.jsx     # Navigation latérale
│   └── ui/                 # Composants UI shadcn
├── pages/
│   ├── Dashboard.jsx       # Page d'accueil
│   ├── Stockage.jsx        # Page de stockage
│   ├── Destockage.jsx      # Page de déstockage
│   ├── RechercheEmplacement.jsx  # Page de recherche
│   ├── BonSortie.jsx       # Page des bons de sortie
│   └── AjouterArticle.jsx  # Page d'ajout d'articles
├── lib/
│   └── utils.js            # Utilitaires
├── App.jsx                 # Composant principal
└── main.jsx                # Point d'entrée
```

## 🚀 Installation et Démarrage

1. **Installer les dépendances**
   ```bash
   cd fabric-stock-management
   pnpm install
   ```

2. **Démarrer le serveur de développement**
   ```bash
   pnpm run dev
   ```

3. **Construire pour la production**
   ```bash
   pnpm run build
   ```

## 📋 Fonctionnalités Techniques

### Gestion d'État
- État local React avec hooks useState
- Données simulées (mock data) pour la démonstration
- Logique métier intégrée dans les composants

### Validation
- Validation des emplacements (format 0101-1099)
- Vérification des doublons pour les codes articles
- Formulaires avec validation HTML5

### Interface Utilisateur
- Mode sombre activé par défaut
- Navigation intuitive avec indicateurs visuels
- Cartes et composants modulaires
- Feedback utilisateur avec alertes

## 🎯 Logique Métier

### Stockage
- Chaque article a un emplacement unique
- Format d'emplacement: 4 chiffres (0101 à 1099)
- Ajout unitaire (+1 logique) par échantillon

### Déstockage
- Déplacement d'un emplacement à un autre
- Support des emplacements spéciaux (SORTIE, RETOUR, MAINTENANCE)
- Traçabilité complète des mouvements

### Recherche
- Recherche par emplacement ou code article
- Résultats avec informations détaillées
- Interface de recherche intuitive

## 🔧 Personnalisation

Le système utilise des variables CSS personnalisées pour les couleurs, permettant une personnalisation facile du thème sombre. Les couleurs principales sont définies dans `src/App.css`.

## 📱 Compatibilité

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Mobile et tablette (responsive design)
- ✅ Mode sombre optimisé
- ✅ Accessibilité (ARIA labels, navigation clavier)

## 🚀 Déploiement

Le projet est prêt pour le déploiement sur toute plateforme supportant les applications React statiques (Vercel, Netlify, GitHub Pages, etc.).

---

**Version:** 1.0.0  
**Développé avec:** React + Tailwind CSS  
**Style:** Manus UI Dark Theme

