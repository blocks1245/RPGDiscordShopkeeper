const { resolve } = require('path');
const Initialise = require('../database/db-initialiser.js');
const sqlite3 = require('sqlite3').verbose();
const database = 'database/database.sqlite';

const dbInit = new Initialise();
dbInit.initialise(database);


class Items {
    fetchAll() {
        const db = new sqlite3.Database(database);
        db.execute('SELECT * FROM items')
            .then(([rows, fieldData]) => {
                console.log(rows); //giving the required data
                return rows;
            })
    }

    fetchAvailable() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(database);
            db.all('SELECT name, category, price FROM items', (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    let availableItems = [];
                    for (const row of rows) {
                        availableItems.push(row);
                    }
                    resolve(availableItems);
                }
                db.close();
            });
        });
    }

    fetchItem(name) {
        const localName = name.toUpperCase();
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(database);
            db.get('SELECT * FROM items WHERE name = ? COLLATE NOCASE', [localName], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    let items = [];
                    items.push(row);
                    resolve(items);
                }
                db.close();
            });
        });
    }

    nameCheck(name) {
        const localName = name.toUpperCase();
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(database);
            db.get('SELECT name FROM items WHERE name = ? COLLATE NOCASE', [localName], (err, row) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    if (row) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
                db.close();
            });
        });
    }


    putItem(name, category, description, price, dminfo, imageurl, homebrew) {
        const db = new sqlite3.Database(database);
        if (homebrew === true) {
            homebrew = 1;
        } else {
            homebrew = 0;
        }
        db.run('INSERT INTO items (name,category,description,price,dminfo,imageurl, homebrew) VALUES (?,?,?,?,?,?,?)', [name, category, description, price, dminfo, imageurl, homebrew], (err) => {
            console.log('test');
            if (err) {
                console.log(err);
            } else {
                console.log('Item added');
            }
            db.close();
        });
    }

    deleteItem(name) {
        const localName = name.toUpperCase();
        const db = new sqlite3.Database(database);
        db.run('DELETE FROM items WHERE name = ? COLLATE NOCASE', [localName], (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Item deleted');
            }
            db.close();
        });
    }

    updateItem(name, category, description, price, dminfo, imageurl, homebrew) {
        const db = new sqlite3.Database(database);
        if (homebrew === true) {
            homebrew = 1;
        } else {
            homebrew = 0;
        }
        db.run('UPDATE items SET category= ?, description = ?, price = ?, dminfo = ?, imageurl = ?, homebrew = ? WHERE name = ? COLLATE NOCASE', [category, description, price, dminfo, imageurl, homebrew, name], (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Item updated');
            }
            db.close();
        });
    }

    buyItem(name, userid) {

    }
}

class Player {
    fetchAllNames() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(database);
            db.all('SELECT name FROM players', (err, rows) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    const names = rows.map(row => row.name);
                    resolve(names);
                }
                db.close();
            });
        });
    }

    async fetchPlayerByName(name) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(database);
            db.get('SELECT * FROM players WHERE name = ? COLLATE NOCASE', [name], (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(row);
                }
                db.close();
            });
        });
    }

    async fetchPlayerByDiscordId(id) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(database);
            db.get('SELECT * FROM players WHERE discordid = ?', [id], (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(row);
                }
                db.close();
            });
        });
    }

    async putPlayer(name, discordid) {
        const db = new sqlite3.Database(database);
        db.run('INSERT INTO players (name, discordid) VALUES (?,?)', [name, discordid], (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Player added');
            }
            db.close();
        });
    }

    async updatePlayer(discordid, name, description, coppercoin, image) {
        const db = new sqlite3.Database(database);
        db.run('UPDATE players SET name = ?, description = ?, coppercoin = ?, image = ? WHERE discordid = ?', [name, description, coppercoin, image, discordid], (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Player updated');
            }
            db.close();
        });
    }
}

module.exports = { Items, Player };