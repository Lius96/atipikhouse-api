const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')
const fileUpload = require('express-fileupload')
const pg = require('pg')

const app = express()
var cors = require('cors')
app.use(cors())
// app.use(express.static('public'))
app.use('/images', express.static(__dirname + '/uploads/'))
app.use(fileUpload())

app.post('/test', (req, res, next) => {
  console.log(req.headers)
  res.json({ success: 'ok' })
})

// Load env vars
dotenv.config({ path: './config/config.env' })

if (process.env.ENV === 'development') {
  app.use(morgan('dev'))
}

const errorHandler = require('./middleware/error')

const login = require('./routes/login')
const users = require('./routes/users')
const houses = require('./routes/houses')
const comments = require('./routes/comments')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(errorHandler)

app.use('/api/v1/login/', login);
app.use('/api/v1/users/', users);
app.use('/api/v1/houses/', houses);
app.use('/api/v1/comments/', comments);

const port = process.env.PORT || 4000

app.listen(port, () => {
  console.log(`We are live on port ${port}`.yellow)
})
