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
    // creates compiled SQL statement
    const insertUser = db.prepare(`INSERT INTO users(username, password)
      VALUES (?, ?)`)

    // execute with params `username` && `hashedPassword`
    const result = insertUser.run(username, hashedPassword)

    // now that we have a user, add their first TODO for them
    const defaultTodo = `Hello! Add your first todo! :)`
    const insertTodo = db.prepare(`INSERT INTO todos (user_id, task)
      VALUES (?, ?)`)
    insertTodo.run(result.lastInsertRowid, defaultTodo)

    // create a token
    const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, {expiresIn: '24h'})
    res.json({ token })

  } catch (err) {
    console.log(err.message)
    res.sendStatus(503) // 'internal issue'
  }

})

router.post('/login', (req, res) => {
  // get the email, lookup password associated with that email in the db
  // get it back and see it's encrypted --> cannot compare it to the one sent in the POST
  // need to one-way encrypt the password the user just entered (again)
  const {username, password} = req.body

  try {

    const getUser = db.prepare(`SELECT * from users WHERE username = ?`)
    const user = getUser.get(username) // `get` like `run` in /register

    // exit if we have no user with that username
    if (!user) { return res.status(404)
                           .send({message: "User not found"}) }
      
    const passwordIsValid = bcrypt.compareSync(password, user.password)

    // exit if the passwowrd does not match
    if (!passwordIsValid) { return res.status(401)
                                      .send({message: "Invalid Password"})}
    // console.log(user)

    // then we have a successful auth
    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h' })
    res.json({token})


  } catch (err) {
    console.log(err.message)
    res.sendStatus(503)
  }


})

export default router