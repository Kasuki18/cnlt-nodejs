const http = require('http')
const server = http.createServer((req, res) => {
    console.log(req.url)
    if (req.url === "/") {
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        })
        res.end("<h1>Trang chủ</h1>")
    }
    else if (req.url === "/about") {
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        })
        res.end("<h1>Trang giới thiệu</h1>")
    }
    else if (req.url === "/contact") {
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        })
        res.end("<h1>Trang liên hệ</h1>")
    }
    else {
        res.writeHead(404, {
            'Content-Type': 'text/html; charset=utf-8'
        })
        res.end("<h1>404</h1>")
    }
})
server.listen(3000, () => {
    console.log("Server running at http://localhost:3000")
})