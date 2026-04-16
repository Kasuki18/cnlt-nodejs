const http = require('http');
const url = require('url');
const fs = require('fs');

// --- TỰ ĐỘNG ĐỔI TÊN FILE NẾU CẦN ---
// if (fs.existsSync('./data/cats.txt')) {
//    fs.rename('./data/cats.txt', './data/những con mèo.txt', (err) => {
//        if (!err) console.log('Đã đổi tên sang: những con mèo.txt');
//    });
//}

const server = http.createServer((req, res) => {
    let urlData = url.parse(req.url, true);
    let pathName = urlData.pathname;
    
    if (pathName === '/view-image') {
        fs.readFile('./data/cat.png', (err, data) => {
            if (err) return res.end('Khong tim thay file anh.');
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.end(data);
        });
        return;
    }

    // 2. XỬ LÝ GIAO DIỆN TRONG THƯ MỤC VIEWS
    // Sửa lỗi: Gõ "/" hoặc "/index.html" đều ra trang chủ
    let fileName = './views' + pathName;
    if (pathName === '/' || pathName === '/index.html') {
        fileName = './views/index.html';
    }

    fs.readFile(fileName, (err, data) => {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
            res.end('<h1>404 Không tìm thấy trang này!</h1>');
            return;
        }
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(data);
    });
});

server.listen(8017, () => {
    console.log('Server chạy tại: http://localhost:8017');
});