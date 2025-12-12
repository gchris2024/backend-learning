/* swapped out for Postgres */

import {DatabaseSync} from 'node:sqlite'

// this db ceases to exist when db connection is closed--for quick prototyping
const db = new DatabaseSync(':memory:')

/* Execute SQL statements from strings */
db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`)

db.exec(`
  CREATE TABLE todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    task TEXT,
    completed BOOLEAN DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )  
  
`)

export default db