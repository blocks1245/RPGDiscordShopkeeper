const sqlite3 = require('sqlite3').verbose();
const database = 'database/database.sqlite';

class Initialise {
    initialise(databasePath) {
        this.createItemsTable();
        this.closeDb();
    }

    createItemsTable() {
        const db = new sqlite3.Database(database);
        db.run('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, category TEXT NOT NULL, description TEXT, price varchar(32), dminfo TEXT, imageurl TEXT, homebrew INTEGER NOT NULL)');
    }

    closeDb() {
        const db = new sqlite3.Database(database);
        db.close();
    }
}

module.exports = Initialise;