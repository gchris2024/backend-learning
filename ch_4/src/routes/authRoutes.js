import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

// "subsection"
const router = express.Router();

// Register a new user endpoint /auth/register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // encrypt the password
  const hashedPassword = bcrypt.hashSync(password, 8);

  // save the new user and hashed password to the db
  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // now that we have a user, add their first TODO for them
    const defaultTodo = `Hello! Add your first todo! :)`;

    // create new todo
    await prisma.todo.create({
      data: {
        task: defaultTodo,
        userId: user.id,
      },
    });

    // create a token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503); // 'internal issue'
  }
});

router.post("/login", async (req, res) => {
  // get the email, lookup password associated with that email in the db
  // get it back and see it's encrypted --> cannot compare it to the one sent in the POST
  // need to one-way encrypt the password the user just entered (again)
  const { username, password } = req.body;

  try {
    // find unique user
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    // exit if we have no user with that username
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    // exit if the passwowrd does not match
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid Password" });
    }
    // console.log(user)

    // then we have a successful auth
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

export default router;
