const { app } = require("electron");
const Database = require("better-sqlite3");
const path = require("path");

// Path define
const dbPath = path.join(app.getPath("userData"), "puntofacil.sqlite");

const db = new Database(dbPath);
module.exports = db;
