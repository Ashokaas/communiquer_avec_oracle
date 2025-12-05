# L'Oracle - Site de Contact Mystique

Un site web immersif et mystique permettant aux visiteurs de communiquer avec l'Oracle à travers un formulaire de contact interactif enrichi d'effets visuels et sonores.

## 🎨 Caractéristiques

- **Design mystique** avec vidéo en arrière-plan qui boucle en avant/arrière
- **Particules ambiantes** (tsParticles) pour une ambiance magique
- **Effets sonores** immersifs (musique d'ambiance, transitions, validation)
- **Animations fluides** avec Framer Motion
- **Formulaire multi-étapes** :
  - Nom du visiteur
  - Email (avec validation)
  - Sujet de la quête
  - Message/révélation
- **Envoi vers Discord** via webhook
- **Navigation** avec boutons retour à chaque étape
- **Popup finale** avec explosion de particules

## 🛠️ Technologies utilisées

- **Astro 5.16.4** - Framework web moderne
- **React 19.2.1** - Composants interactifs
- **TypeScript** - Typage statique
- **Framer Motion 12.23.25** - Animations
- **Howler.js 2.2.4** - Gestion audio
- **tsParticles** - Effets de particules
- **Polices Google Fonts** :
  - Uncial Antiqua (titre)
  - Cinzel Decorative (labels)
  - Cormorant Garamond (inputs)

## 📦 Installation

### Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn

### Étapes

1. Cloner le repository :
  ```bash
  git clone https://github.com/Ashokaas/communiquer_avec_oracle
  cd oracle-site
  ```

2. Installer les dépendances :
  ```bash
  npm install
  ```

3. Configurer les variables d'environnement :
  - Créer un fichier `.env.local`
  - Ajouter votre webhook Discord :
    ```
    PUBLIC_DISCORD_WEBHOOK=https://discord.com/api/webhooks/...
    ```

4. Lancer le serveur de développement :
  ```bash
  npm run dev
  ```

5. Ouvrir `http://localhost:3000` dans votre navigateur

en cas de problème ou autre, contactez-nous à : antonin.moreau-2@etu.univ-tours.fr ou romain.blaquart@etu.univ-tours.fr
