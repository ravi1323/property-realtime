require('dotenv').config();
const express = require('express')
const cors = require('cors')
const http = require('http')
const {Server} = require('socket.io')
const {db_connect} = require('./config/db')

// database connection
db_connect();

const app = express()

app.use(express.json())
app.use(cors())

const httpServer = http.createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
})

const {
  signin,
  signup
} = require('./routes/AuthRoute')

io.on('connection', (socket) => {
  console.log(socket.id)
  socket.on('user:signin', (payload) => signin(io, socket, payload))
  socket.on('user:signup', (payload) => signup(io, socket, payload))
})

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is in development for property solution.'
  })
})


httpServer.listen(3001, () => console.log('server is running on port: 3001✅'));
