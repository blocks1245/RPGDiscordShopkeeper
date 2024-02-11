const sqlite3 = require('sqlite3').verbose();
const database = 'database/database.sqlite';

class Initialise {
    initialise(databasePath) {
        this.createItemsTable();
        this.closeDb();
    }

    createItemsTable() {
        const db = new sqlite3.Database(database);
        db.run(`CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            name TEXT NOT NULL, 
            category TEXT NOT NULL, 
            description TEXT, 
            price INTEGER, 
            dminfo TEXT, 
            imageurl TEXT, 
            homebrew INTEGER NOT NULL)`);
    }

    createShopTable() {
        const db = new sqlite3.Database(database);
        db.run(`CREATE TABLE IF NOT EXISTS shop (
            itemid INTEGER NOT NULL, 
            FOREIGN KEY(itemid) REFERENCES items(id))`);
    }

    createInventoryTable() {
        const db = new sqlite3.Database(database);
        db.run(`CREATE TABLE IF NOT EXISTS inventory (
            userid INTEGER NOT NULL, 
            itemid INTEGER NOT NULL, 
            FOREIGN KEY(userid) REFERENCES players(id), 
            FOREIGN KEY(itemid) REFERENCES items(id))`);
    }

    createPlayersTable() {
        const db = new sqlite3.Database(database);
        db.run(`CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            discordid integer NOT NULL,
            name TEXT NOT NULL, description TEXT,
            description TEXT,
            coppercoin INTEGER DEFAULT 0
            image BLOB)`);
    }

    closeDb() {
        const db = new sqlite3.Database(database);
        db.close();
    }
}

module.exports = Initialise;