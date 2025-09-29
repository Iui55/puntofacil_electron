import db from "./database/db.js";

export class UsersRepo {

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
