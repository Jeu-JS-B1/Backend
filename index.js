const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// CORS nécessaire car le frontend tourne sur un port différent (8080)
app.use(cors());
app.use(express.json());

// Initialise la base de données au démarrage (crée les tables si elles n'existent pas)
require('./database');

const combatRoutes = require('./routes/combat');
app.use('/api/combat', combatRoutes);

app.listen(PORT, () => {
    console.log(`Backend disponible sur http://localhost:${PORT}`);
});
