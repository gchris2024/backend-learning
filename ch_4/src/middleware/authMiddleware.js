import jwt from 'jsonwebtoken'

function authMiddleware(req, res, next) {
  const token = req.headers['authorization']

  if (!token) { return res.status(401).json({message: "no token provided"}) }

  // "Synchronously verify given token using a secret or a public key to get a decoded token"
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) { return res.status(401).json({message: "invalid token"})}

    // new field to easily store user id (from decoded JWT)
    req.userId = decoded.id

    next() // passed this checkpoint, head to the endpoint
  })
}

export default authMiddleware