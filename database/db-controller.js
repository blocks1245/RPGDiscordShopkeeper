const Initialise = require('../database/db-initialiser.js');
const sqlite3 = require('sqlite3').verbose();
const database = 'database/database.sqlite';

const dbInit = new Initialise();

class Items {
    constructor() {
        dbInit.initialise(database);
    }

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
            db.get('SELECT * FROM items WHERE name = ?', [localName], (err, row) => {
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
            db.get('SELECT name FROM items WHERE name = ?', [localName], (err, row) => {
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
        db.run('DELETE FROM items WHERE name = ?', [localName], (err) => {
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
        db.run('UPDATE items SET category= ?, description = ?, price = ?, dminfo = ?, imageurl = ?, homebrew = ? WHERE name = ?', [category, description, price, dminfo, imageurl, homebrew, name], (err) => {
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

module.exports = { Items };