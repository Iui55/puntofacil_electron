const db = require("./db");

function runMigrations() {
  const migrations = [
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'seller',
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      stock INTEGER NOT NULL,
      cost REAL NOT NULL,
      price REAL NOT NULL,
      created_at INTEGER DEFAULT (strftime('%s','now')),
      updated_at INTEGER DEFAULT (strftime('%s','now'))
    );`,
    `CREATE TABLE IF NOT EXISTS audit_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      timestamp INTEGER DEFAULT (strftime('%s','now')),
      FOREIGN KEY (product_id) REFERENCES products (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    );`,
    // `CREATE TABLE IF NOT EXISTS sales (
    //   id INTEGER PRIMARY KEY AUTOINCREMENT,
    //   sale_number INTEGER NOT NULL UNIQUE,
    //   user_id INTEGER NOT NULL,
    //   quantity INTEGER NOT NULL,
    //   total_price REAL NOT NULL,
    //   created_at INTEGER DEFAULT (strftime('%s','now')),
    //   updated_at INTEGER DEFAULT (strftime('%s','now')),
    //   FOREIGN KEY (user_id) REFERENCES users (id),
    //   FOREIGN KEY (product_id) REFERENCES products (id)
    // );`,
  ];

  migrations.forEach((migration) => {
    db.exec(migration);
  });
}

module.exports = { runMigrations };
