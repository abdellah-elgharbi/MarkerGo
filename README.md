# MarketGo

MarketGo est une application mobile moderne développée avec Expo et React Native, offrant une expérience utilisateur fluide et intuitive pour la gestion et la découverte de marchés.

## 🚀 Technologies Utilisées

- **Expo** (v53.0.4) - Framework pour le développement d'applications React Native
- **React Native** (v0.79.1) - Framework mobile cross-platform
- **TypeScript** - Pour un développement plus robuste et maintenable
- **NativeWind** - Pour le styling avec Tailwind CSS
- **Zustand** - Pour la gestion d'état
- **Expo Router** - Pour la navigation
- **Expo Vector Icons** - Pour les icônes
- **Expo Location** - Pour les fonctionnalités de géolocalisation
- **Expo Image Picker** - Pour la gestion des images
- **Async Storage** - Pour le stockage local

## 📋 Prérequis

- Node.js (version recommandée : LTS)
- npm ou yarn
- Expo CLI
- Un appareil mobile ou un émulateur pour le test

## 🛠 Installation

1. Clonez le repository :
```bash
git clone [URL_DU_REPO]
cd marketGo
```

2. Installez les dépendances :
```bash
npm install
# ou
yarn install
```

3. Lancez l'application :
```bash
# Pour le développement mobile
npm run start
# ou
yarn start

# Pour le développement web
npm run start-web
# ou
yarn start-web
```

## 🏗 Structure du Projet

```
marketGo/
├── app/              # Pages et routes de l'application
├── assets/           # Images, fonts et autres ressources
├── components/       # Composants réutilisables
├── constants/        # Constantes et configurations
├── services/         # Services et API
├── stores/          # État global (Zustand)
└── types/           # Types TypeScript
```

## 🚀 Scripts Disponibles

- `npm start` : Lance l'application en mode développement mobile
- `npm run start-web` : Lance l'application en mode web
- `npm run start-web-dev` : Lance l'application en mode web avec le debug activé

## 🔧 Configuration

Le projet utilise plusieurs fichiers de configuration :
- `babel.config.js` : Configuration de Babel
- `tsconfig.json` : Configuration TypeScript
- `webpack.config.js` : Configuration Webpack
- `metro.config.js` : Configuration Metro bundler
- `app.json` : Configuration Expo

## 📱 Fonctionnalités

- Interface utilisateur moderne et responsive
- Navigation fluide avec Expo Router
- Gestion d'état avec Zustand
- Support du stockage local
- Intégration de la géolocalisation
- Gestion des images
- Support multi-plateforme (iOS, Android, Web)

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence privée. Tous droits réservés.

## 👥 Auteurs

- [Votre Nom] - Développeur principal

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue dans le repository. 
