const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'notesmarketplace.db');
const db = new sqlite3.Database(dbPath);

// Helper wrappers for clean async/await
const dbAsync = {
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  },
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
  exec(sql) {
    return new Promise((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
};

async function initDb() {
  await dbAsync.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'member', -- member, admin, superadmin
      is_verified INTEGER DEFAULT 0,
      verification_token TEXT,
      dob TEXT,
      phone TEXT,
      college TEXT,
      address_line_1 TEXT,
      address_line_2 TEXT,
      city TEXT,
      state TEXT,
      country TEXT,
      zip_code TEXT,
      profile_picture TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS note_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS countries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seller_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      category_id INTEGER NOT NULL,
      type_id INTEGER,
      pages INTEGER DEFAULT 1,
      description TEXT,
      institution TEXT,
      country_id INTEGER,
      course_name TEXT,
      course_code TEXT,
      professor TEXT,
      sell_type TEXT DEFAULT 'Free', -- 'Free' or 'Paid'
      price REAL DEFAULT 0.0,
      display_picture TEXT,
      file_path TEXT,
      file_size TEXT DEFAULT '1 MB',
      preview_path TEXT,
      status TEXT DEFAULT 'Draft', -- 'Draft', 'InReview', 'Published', 'Rejected'
      rejection_remarks TEXT,
      inappropriate_reports INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      published_at DATETIME,
      FOREIGN KEY (seller_id) REFERENCES users(id),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS downloads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      note_id INTEGER NOT NULL,
      buyer_id INTEGER NOT NULL,
      seller_id INTEGER NOT NULL,
      sell_type TEXT DEFAULT 'Free',
      purchased_price REAL DEFAULT 0.0,
      is_paid INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (note_id) REFERENCES notes(id),
      FOREIGN KEY (buyer_id) REFERENCES users(id),
      FOREIGN KEY (seller_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      note_id INTEGER NOT NULL,
      reviewer_id INTEGER NOT NULL,
      rating INTEGER NOT NULL,
      comments TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (note_id) REFERENCES notes(id),
      FOREIGN KEY (reviewer_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS simulated_emails (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipient_email TEXT NOT NULL,
      recipient_name TEXT,
      subject TEXT NOT NULL,
      body_html TEXT NOT NULL,
      email_type TEXT NOT NULL, -- 'verification', 'reset_password', 'note_status', 'purchase'
      action_link TEXT,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS buyer_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      note_id INTEGER NOT NULL,
      buyer_id INTEGER NOT NULL,
      seller_id INTEGER NOT NULL,
      phone TEXT,
      status TEXT DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (note_id) REFERENCES notes(id),
      FOREIGN KEY (buyer_id) REFERENCES users(id),
      FOREIGN KEY (seller_id) REFERENCES users(id)
    );
  `);
}

module.exports = {
  db,
  dbAsync,
  initDb
};
