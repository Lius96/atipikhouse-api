const express = require('express')
const https = require('https')
const http = require('http')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')
const fileUpload = require('express-fileupload')
const fs = require('fs')
const path = require('path');


const app = express()
var cors = require('cors')
app.use(cors())
// app.use(express.static('public'))
app.use('/images', express.static(path.resolve(__dirname + '/uploads')))
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
const booking = require('./routes/booking')
const pages = require('./routes/pages')
const mail = require('./routes/mailler')
const equip = require('./routes/equipment')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(errorHandler)

app.use('/api/v1/login/', login);
app.use('/api/v1/users/', users);
app.use('/api/v1/houses/', houses);
app.use('/api/v1/comments/', comments);
app.use('/api/v1/booking/', booking);
app.use('/api/v1/pages/', pages);
app.use('/api/v1/mail/', mail);
app.use('/api/v1/equipment/', equip);

const port = process.env.PORT || 4000


if(process.env.ENV === 'development'){
  app.listen(port, () => {
    console.log(`We are live on port ${port}`.yellow) 
  })
}else{
  const httpsServer = https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/f2i-dev26-dj.fr//privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/f2i-dev26-dj.fr//fullchain.pem'),
  }, app);
  
  httpsServer.listen(port, () => {
    console.log(`We are live on port ${port}`.yellow)
  })
}

