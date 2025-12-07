import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'


// "subsection"
const router = express.Router()

// Register a new user endpoint /auth/register
router.post('/register', (req, res) => {

  const { username, password } = req.body

  // encrypt the password
  const hashedPassword = bcrypt.hashSync(password, 8)

  // save the new user and hashed password to the db
  try {
    // creates compile SQL statement
    const insertUser = db.prepare(`INSERT INTO users(username, password)
      VALUES (?, ?)`)

    // execute with params `username` && `hashedPassword`
    const result = insertUser.run(username, hashedPassword)

    // now that we have a user, add their first TODO for them
    const defaultTodo = `Hello! Add your first todo! :)`
    const insertTodo = db.prepare(`INSERT INTO todos ()`)

  } catch (err) {
    console.log(err.message)
    res.sendStatus(503) // 'internal issue'
  }

})

router.post('/login', (req, res) => {
  // get the email, lookup password associated with that email in the db
  // get it back and see it's encrypted --> cannot compare it to the one sent in the POST
  // need to one-way encrypt the password the user just entered (again)



})

export default router