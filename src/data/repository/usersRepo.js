import db from "../database/db.js";

export class UsersRepo {
  constructor() {
    db.prepare(
      `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'seller',
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );`
    ).run();

    if (this.getAllUsers().length === 0) {
      // Add a default admin user if no users exist
      this.addUser({
        name: "Admin",
        role: "admin",
        username: "admin",
        password: "admin123", // In a real app, hash the password
      });
    }
  }

  getAllUsers() {
    return db.prepare("SELECT * FROM users").all();
  }

  addUser(user) {
    const info = db
      .prepare(
        "INSERT INTO users (name, role, username, password) VALUES (?, ?, ?, ?)"
      )
      .run(user.name, user.role, user.username, user.password);

    return info.lastInsertRowid;
  }
}
