require('express-async-errors')
require('dotenv').config({ path: `./config/${process.env.NODE_ENV}.env` })
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const fs = require('fs')
const compression = require('compression')
const { connectDB } = require('./config/db')
const errorMid = require('./middleware/errorMid')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload');
const NodeCache = require('node-cache')
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const { initLeadsJob } = require('./jobs/notifyLeads')

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Seven Lake Project",
      version: "1.0.0"
    },
    servers: [{
      url: process.env.FRONTEND_URL
    }]
  },
  apis: ['./server.js', './routes/*.js']
}

const swaggerSpec = swaggerJSDoc(options);
module.exports.myCache = new NodeCache({
  stdTTL: 3600,
})

connectDB()

if (!fs.existsSync('./tempFiles')) {
  fs.mkdirSync('./tempFiles')
}

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

// parse application/json
app.use(
  bodyParser.json({
    limit: '5mb',
  })
)
app.use(fileUpload());
const whitelist = [
  'http://localhost:4200',
  process.env.FRONTEND_DEV_URL,
  process.env.FRONTEND_URL,
  'https://accounts.zoho.com',
  process.env.BACKEND_URL,
]
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS '))
    }
  },
}

// app.use(cors(corsOptions))
app.use(cors({ origin: '*' }));
app.use(helmet())
app.use(compression())
app.use(cookieParser())

const limiter = rateLimit({
  windowMs: 5 * 60,
  max: 300,
})
app.use(limiter)

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'))
}
app.use('/api/auth', require('./routes/authRoutes'))

app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/leads', require('./routes/leadRoutes'))
app.use('/api/formManager', require('./routes/formManage'));
app.use('/api', require('./routes/settingColorCodeRoute'))
app.use('/api', require('./routes/landingPage'));
app.use('/api', require('./routes/urlRoutes'));
app.use('/api', require('./routes/paymentsRoutes'));
app.use('/api', require('./routes/editleadrouter'));
app.use('/api', require('./routes/MainSearchrouter'));
const PORT = process.env.PORT || 17001

app.use(errorMid)

initLeadsJob()

app.listen(PORT, () => console.log(`Server is listening on ${PORT}`))
