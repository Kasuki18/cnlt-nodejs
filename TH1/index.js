const http = require('http')
const server = http.createServer((req, res) => {
console.log(req.url)
res.writeHead(200, {
'Content-Type': 'text/plain; charset=utf-8'
})
res.end('Xin chào Node.js')
})
server.listen(3000)