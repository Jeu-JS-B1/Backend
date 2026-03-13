const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ouvre (ou crée) la base de données SQLite
const db = new Database(path.join(__dirname, 'game.db'));

// Active les clés étrangères
db.pragma('foreign_keys = ON');

// Applique le schéma si les tables n'existent pas encore
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
db.exec(schema);

module.exports = db;
