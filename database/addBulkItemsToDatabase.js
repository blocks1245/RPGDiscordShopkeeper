const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Open a SQLite database in the same folder
const db = new sqlite3.Database('./database.sqlite');

// Read CSV file and insert data into the database
fs.readFile('./bulkData.csv', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading CSV file:', err);
    return;
  }

  // Split CSV lines
  const lines = data.trim().split('\n');

  // Prepare and execute INSERT queries for each line in the CSV
  lines.forEach((line) => {
    const values = line.split(';');
    const name = values[0].trim();
    const category = values[1].trim();
    const description = values[2].trim();
    const price = parseFloat(values[3].trim());
    const dminfo = values[4].trim();
    const imageUrl = values[5].trim();
    const homebrew = values[6].trim();

    const query = `INSERT INTO items (name, category, description, price, dminfo, imageurl, homebrew) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [name, category, description, price, dminfo, imageUrl, homebrew], (err) => {
      if (err) {
        console.error('Error inserting data:', err);
      } else {
        console.log(`Data inserted for item: ${name}`);
      }
    });
  });

  // Close the database connection after all queries have been executed
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
  });
});