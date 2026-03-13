BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Achievements" (
    "AchievementsID"    INTEGER,
    "Name"    TEXT,
    "ProgressPlayer"    INTEGER,
    "ProgressMax"    INTEGER,
    "State"    INTEGER,
    PRIMARY KEY("AchievementsID")
);
CREATE TABLE IF NOT EXISTS "Inventory" (
    "InventoryID"    INTEGER,
    "PlayerID"    INTEGER,
    "MaxSlots"    INTEGER,
    PRIMARY KEY("InventoryID")
);
CREATE TABLE IF NOT EXISTS "Item" (
    "UniqueID"    INTEGER,
    "InventoryID"    INTEGER,
    "GlobalID"    INTEGER,
    "Quantity"    INTEGER,
    PRIMARY KEY("UniqueID")
);
CREATE TABLE IF NOT EXISTS "Item_Template" (
    "GlobalID"    INTEGER,
    "Name"    TEXT,
    "Description"    TEXT,
    "QuantityMax"    INTEGER,
    "Rarity"    TEXT,
    "Type"    TEXT,
    PRIMARY KEY("GlobalID")
);
CREATE TABLE IF NOT EXISTS "Player" (
    "PlayerID"    INTEGER,
    "Username"    TEXT,
    PRIMARY KEY("PlayerID")
);
COMMIT;