// index.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3001;
app.options('*', cors());
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('pre.sqlite');

// Create tables for preferences, budgets, categories, and time spent
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS preferences (
      userId TEXT PRIMARY KEY,
      budget REAL,
      categories TEXT,
      timeSpentClothing REAL,
      timeSpentCars REAL,
      timeSpentElectronics REAL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS budgets (
      userId TEXT PRIMARY KEY,
      amount REAL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      userId TEXT,
      category TEXT,
      PRIMARY KEY(userId, category)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS timeSpent (
      userId TEXT,
      category TEXT,
      time REAL,
      PRIMARY KEY(userId, category)
    )
  `);
});

// Example route for fetching customer preferences
app.get('/api/preferences/:userId', (req, res) => {
  const userId = req.params.userId;

  const query = 'SELECT * FROM preferences WHERE userId = ?';
  db.get(query, [userId], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(row || {}); // Return an empty object if user preferences are not found
    }
  });
});
app.get('/api/budgets/:userId', (req, res) => {
    const userId = req.params.userId;
  
    const query = 'SELECT * FROM budgets WHERE userId = ?';
    db.get(query, [userId], (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(row || {}); // Return an empty object if user budget is not found
      }
    });
  });

// Example route for updating customer preferences
app.post('/api/preferences/:userId', (req, res) => {
  const userId = req.params.userId;
  const updatedPreferences = req.body;

  const query = `
    INSERT OR REPLACE INTO preferences (userId, budget, categories, timeSpentClothing, timeSpentCars, timeSpentElectronics)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    userId,
    updatedPreferences.budget || null,
    updatedPreferences.categories || null,
    updatedPreferences.timeSpent?.clothing || null,
    updatedPreferences.timeSpent?.cars || null,
    updatedPreferences.timeSpent?.electronics || null,
  ];

  db.run(query, values, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ success: true });
    }
  });
});

// Example route for updating user budget
app.post('/api/budgets/:userId', (req, res) => {
  const userId = req.params.userId;
  const amount = req.body.amount;

  const query = 'INSERT OR REPLACE INTO budgets (userId, amount) VALUES (?, ?)';

  db.run(query, [userId, amount], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ success: true });
    }
  });
});

// Example route for updating user categories
app.post('/api/categories/:userId', (req, res) => {
  const userId = req.params.userId;
  const categories = req.body.categories;

  const deleteQuery = 'DELETE FROM categories WHERE userId = ?';
  const insertQuery = 'INSERT INTO categories (userId, category) VALUES (?, ?)';

  db.serialize(() => {
    db.run(deleteQuery, [userId], (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const stmt = db.prepare(insertQuery);
        categories.forEach((category) => stmt.run(userId, category));
        stmt.finalize();
        res.json({ success: true });
      }
    });
  });
});

// Example route for updating time spent on categories
app.post('/api/timeSpent/:userId', (req, res) => {
  const userId = req.params.userId;
  const timeSpentData = req.body;

  const deleteQuery = 'DELETE FROM timeSpent WHERE userId = ?';
  const insertQuery = 'INSERT INTO timeSpent (userId, category, time) VALUES (?, ?, ?)';

  db.serialize(() => {
    db.run(deleteQuery, [userId], (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const stmt = db.prepare(insertQuery);
        timeSpentData.forEach(({ category, time }) => stmt.run(userId, category, time));
        stmt.finalize();
        res.json({ success: true });
      }
    });
  });
});
// Example route for fetching time spent on categories
app.get('/api/timeSpent/:userId', (req, res) => {
    const userId = req.params.userId;
  
    const query = 'SELECT * FROM timeSpent WHERE userId = ?';
    db.all(query, [userId], (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(rows || []); // Return an empty array if time spent data is not found
      }
    });
  });

  // Example route for fetching user categories
app.get('/api/categories/:userId', (req, res) => {
    const userId = req.params.userId;
  
    const query = 'SELECT * FROM categories WHERE userId = ?';
    db.all(query, [userId], (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(rows || []); // Return an empty array if user categories are not found
      }
    });
  });
  
  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
