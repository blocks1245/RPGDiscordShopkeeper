const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite');

fs.readFile('./bulkData.csv', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading CSV file:', err);
        return;
    }

    const lines = data.trim().split('\n');

    lines.forEach((line) => {
        const values = line.split(';').map((value) => value.trim());

        if (values.length === 7) {
            const [name, category, description, price, dminfo, imageUrl, homebrew] = values;

            const query = `INSERT INTO items (name, category, description, price, dminfo, imageurl, homebrew) VALUES (?, ?, ?, ?, ?, ?, ?)`;

            db.run(query, [name.toUpperCase(), category.toUpperCase(), description, price, dminfo, imageUrl, homebrew], (err) => {
                if (err) {
                    console.error('Error inserting data:', err);
                } else {
                    console.log(`Data inserted for item: ${name}`);
                }
            });
        } else {
            console.error('Invalid data format:' + values.length, line);
        }
    });

    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed.');
        }
    });
});