const http = require('http')
const PORT = 8080
const serverHeader = require('../app')
http.createServer(serverHeader).listen(PORT)

console.log('node port http://localhost:8080')
