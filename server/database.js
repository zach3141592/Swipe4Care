const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, '../database.sqlite'));
    this.init();
  }

  init() {
    // Create opportunities table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS opportunities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        organization TEXT,
        location TEXT,
        type TEXT, -- 'clinical_trial', 'volunteer', 'research'
        requirements TEXT,
        compensation TEXT,
        url TEXT,
        image_url TEXT,
        date_posted DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create swipes table to track user interactions
    this.db.run(`
      CREATE TABLE IF NOT EXISTS swipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        opportunity_id INTEGER NOT NULL,
        direction TEXT NOT NULL, -- 'left' or 'right'
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (opportunity_id) REFERENCES opportunities (id),
        UNIQUE(user_id, opportunity_id)
      )
    `);

    console.log('✅ Database initialized');
  }

  addOpportunity(opportunity) {
    return new Promise((resolve, reject) => {
      const { title, description, organization, location, type, requirements, compensation, url, image_url } = opportunity;
      
      this.db.run(
        `INSERT INTO opportunities (title, description, organization, location, type, requirements, compensation, url, image_url, date_posted)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
        [title, description, organization, location, type, requirements, compensation, url, image_url],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }

  getUnswipedOpportunities(userId, limit = 10) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT o.* FROM opportunities o
         LEFT JOIN swipes s ON o.id = s.opportunity_id AND s.user_id = ?
         WHERE s.id IS NULL
         ORDER BY o.created_at DESC
         LIMIT ?`,
        [userId, limit],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  recordSwipe(userId, opportunityId, direction) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO swipes (user_id, opportunity_id, direction)
         VALUES (?, ?, ?)`,
        [userId, opportunityId, direction],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }

  getLikedOpportunities(userId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT o.*, s.created_at as liked_at FROM opportunities o
         JOIN swipes s ON o.id = s.opportunity_id
         WHERE s.user_id = ? AND s.direction = 'right'
         ORDER BY s.created_at DESC`,
        [userId],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  removeSwipe(userId, opportunityId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `DELETE FROM swipes WHERE user_id = ? AND opportunity_id = ?`,
        [userId, opportunityId],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }

  close() {
    this.db.close();
  }
}

module.exports = Database;