# Gestion des Heures Supplémentaires

Application de gestion des heures supplémentaires avec Node.js, React et MySQL.

## Fonctionnalités

- Gestion des employés (CRUD)
- Gestion des heures supplémentaires
- Calcul automatique des montants selon les tarifs
- Interface utilisateur moderne avec React et Material-UI

## Prérequis

- Node.js (v14 ou supérieur)
- MySQL (v8.0 ou supérieur)
- npm ou yarn

## Installation

1. Cloner le repository :
```bash
git clone [URL_DU_REPO]
```

2. Installer les dépendances du backend :
```bash
cd backend
npm install
```

3. Installer les dépendances du frontend :
```bash
cd ../frontend
npm install
```

4. Configurer la base de données :
- Créer une base de données MySQL nommée 'overtime_db'
- Copier le fichier `.env.example` vers `.env` et configurer les variables d'environnement

5. Démarrer l'application :
```bash
# Backend
cd backend
npm run dev

# Frontend (dans un autre terminal)
cd frontend
npm start
```

## Structure du Projet

```
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── config/
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── services/
    │   └── pages/
    └── package.json
```

## API Endpoints

### Employés
- GET /api/employes - Liste des employés
- GET /api/employes/:id - Détails d'un employé
- POST /api/employes - Créer un employé
- PUT /api/employes/:id - Mettre à jour un employé
- DELETE /api/employes/:id - Supprimer un employé

### Heures Supplémentaires
- GET /api/heures-sup - Liste des heures supplémentaires
- POST /api/heures-sup - Créer une heure supplémentaire
- PUT /api/heures-sup/:id - Mettre à jour une heure supplémentaire
- DELETE /api/heures-sup/:id - Supprimer une heure supplémentaire
- GET /api/heures-sup/calculer/:employeId/:dateDebut/:dateFin - Calculer le montant

### Tarifs
- GET /api/tarifs - Liste des tarifs
- POST /api/tarifs - Créer un tarif
- PUT /api/tarifs/:id - Mettre à jour un tarif
- DELETE /api/tarifs/:id - Supprimer un tarif

## Technologies Utilisées

- Backend : Node.js, Express, Sequelize
- Frontend : React, Material-UI
- Base de données : MySQL
- Outils de développement : Git, Docker 