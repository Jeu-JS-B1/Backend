const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'game.db'));

// Active le respect des clés étrangères (désactivé par défaut dans SQLite)
db.pragma('foreign_keys = ON');

db.exec(`
    CREATE TABLE IF NOT EXISTS "Player" (
        "PlayerID"  INTEGER PRIMARY KEY,
        "Username"  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "Inventory" (
        "InventoryID"   INTEGER PRIMARY KEY,
        "PlayerID"      INTEGER NOT NULL,
        "MaxSlots"      INTEGER NOT NULL DEFAULT 20,
        FOREIGN KEY ("PlayerID") REFERENCES "Player"("PlayerID")
    );

    CREATE TABLE IF NOT EXISTS "Item_Template" (
        "GlobalID"              INTEGER PRIMARY KEY,
        "Name"                  TEXT NOT NULL,
        "Description"           TEXT,
        "Rarity"                TEXT,
        "Type"                  TEXT,
        "PV"                    INTEGER DEFAULT 0,
        "PA"                    INTEGER DEFAULT 0,
        "PM"                    INTEGER DEFAULT 0,
        "Vitality"              INTEGER DEFAULT 0,
        "Wisdom"                INTEGER DEFAULT 0,
        "Strength"              INTEGER DEFAULT 0,
        "Intelligence"          INTEGER DEFAULT 0,
        "Chance"                INTEGER DEFAULT 0,
        "Agility"               INTEGER DEFAULT 0,
        "Field15"               INTEGER DEFAULT 0,
        "Fire Resistance"       INTEGER DEFAULT 0,
        "Water Resistance"      INTEGER DEFAULT 0,
        "Earth Resistance"      INTEGER DEFAULT 0,
        "Air Resistance"        INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS "Item" (
        "UniqueID"      INTEGER PRIMARY KEY,
        "InventoryID"   INTEGER NOT NULL,
        "GlobalID"      INTEGER NOT NULL,
        "Quantity"      INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY ("InventoryID") REFERENCES "Inventory"("InventoryID"),
        FOREIGN KEY ("GlobalID")    REFERENCES "Item_Template"("GlobalID")
    );

    CREATE TABLE IF NOT EXISTS "Achievements" (
        "AchievementsID"    INTEGER PRIMARY KEY,
        "Name"              TEXT NOT NULL,
        "ProgressPlayer"    INTEGER NOT NULL DEFAULT 0,
        "ProgressMax"       INTEGER NOT NULL,
        "State"             INTEGER NOT NULL DEFAULT 0
    );
`);

console.log('Base de données initialisée (game.db)');

module.exports = db;
