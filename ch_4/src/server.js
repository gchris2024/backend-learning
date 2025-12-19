import express from 'express' // "type": "module"
import path, { dirname } from 'path'
import { fileURLToPath } from 'url' 
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'

const app = express()
const PORT = process.env.PORT || 7777

// Get the file path from the URL of the curr module
const __filename = fileURLToPath(import.meta.url)

// Get the directory name from the file path
const __dirname = dirname(__filename)

// Middleware
app.use(express.json())
// Serves the HTML from the from the /public directory
// Tells express to serve all files from the public folder as STATIC ASSESTS / files. Any requests for css files will be resolved to to the public directory
app.use(express.static(path.join(__dirname, '../public')))
 
// Serving up the HTML file from the /public directory (not great)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

/* Routes */
app.use('/auth', authRoutes)
// todoRoutes are protected by authMiddleware
app.use('/todos', authMiddleware, todoRoutes) 


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})