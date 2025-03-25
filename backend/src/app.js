const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const employeRoutes = require('./routes/employeRoutes');
const heuresSupRoutes = require('./routes/heuresSupRoutes');
const tarifRoutes = require('./routes/tarifRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/employes', employeRoutes);
app.use('/api/heures-sup', heuresSupRoutes);
app.use('/api/tarifs', tarifRoutes);

// Synchronisation de la base de données
sequelize.sync({ force: false })
    .then(() => {
        console.log('Base de données synchronisée');
    })
    .catch(err => {
        console.error('Erreur de synchronisation de la base de données:', err);
    });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
}); 