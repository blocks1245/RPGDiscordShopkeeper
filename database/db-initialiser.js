const sqlite3 = require('sqlite3').verbose();
const database = 'database/database.sqlite';

const db = new sqlite3.Database(database);

class Initialise {
    initialise(databasePath) {
        this.createItemsTable();
        this.createShopTable();
        this.createInventoryTable();
        this.createPlayersTable();
        db.close();
    }

    createItemsTable() {
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
        db.run(`CREATE TABLE IF NOT EXISTS shop (
            itemid INTEGER NOT NULL, 
            FOREIGN KEY(itemid) REFERENCES items(id))`);
    }

    createInventoryTable() {
        db.run(`CREATE TABLE IF NOT EXISTS inventory (
            userid INTEGER NOT NULL, 
            itemid INTEGER NOT NULL, 
            FOREIGN KEY(userid) REFERENCES players(id), 
            FOREIGN KEY(itemid) REFERENCES items(id))`);
    }

    createPlayersTable() {
        db.run(`CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            discordid integer NOT NULL,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            coppercoin INTEGER DEFAULT 0,
            image TEXT)`);
    }
}

module.exports = Initialise;