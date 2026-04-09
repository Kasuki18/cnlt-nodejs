const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Import các module tự tạo
const myEmitter = require('./events/AppEmitter');
const TextTransform = require('./streams/TextTransform');
const EchoDuplex = require('./streams/EchoDuplex');

// --- 1. THIẾT LẬP LẮNG NGHE SỰ KIỆN (ON) ---
// Phải để ở ngoài để nó luôn sẵn sàng chờ tín hiệu
myEmitter.on('userAction', (data) => {
    const timeLog = new Date().toLocaleString();
    console.log(`[${timeLog}] Event: ${data.message}`);

    // Ghi vào file log.txt (Yêu cầu 6)
    const logEntry = `[${timeLog}] ACTION: ${data.message}\n`;
    fs.appendFile(path.join(__dirname, 'data/log.txt'), logEntry, (err) => {
        if (err) console.error("Lỗi ghi log:", err);
    });
});

myEmitter.on('pageView', (page) => {
    console.log(`[LOG]: Người dùng đã xem ${page}`);
});

// --- 2. KHỞI TẠO SERVER ---
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // A. PHỤC VỤ FILE TĨNH (CSS, IMAGE)
    if (pathname.startsWith('/public/')) {
        const filePath = path.join(__dirname, pathname);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end();
            } else {
                const ext = path.extname(pathname);
                const contentType = ext === '.css' ? 'text/css' : 'image/png';
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        });
        return;
    }

    // B. ROUTING CÁC TRANG CHÍNH
    
    // Trang 1: Trang chủ (/)
    if (pathname === '/') {
        myEmitter.emit('pageView', 'Trang chủ');
        fs.readFile(path.join(__dirname, 'views/index.html'), (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        });
    } 

    // Trang 2: Hiển thị giao diện Events (/events)
    else if (pathname === '/events') {
        myEmitter.emit('pageView', 'Trang Sự kiện');
        fs.readFile(path.join(__dirname, 'views/events.html'), (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        });
    }

    // Endpoint xử lý kích hoạt Event (/event) - Nút bấm gọi cái này
    else if (pathname === '/event') {
        // CHỈ PHÁT TÍN HIỆU (EMIT) TẠI ĐÂY
        myEmitter.emit('userAction', { 
            message: 'Người dùng đã nhấn nút Kích hoạt', 
            time: new Date().toLocaleTimeString() 
        });
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end("Đã nhận tín hiệu sự kiện!");
    }

    // Trang 3: Thông tin Request (/request)
    else if (pathname === '/request') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.write('<link rel="stylesheet" href="/public/style.css">');
        res.write('<div class="container"><div class="card">');
        res.write('<h1>Thông tin Request</h1>');
        res.write(`<p><b>URL:</b> ${req.url}</p>`);
        res.write(`<p><b>Method:</b> ${req.method}</p>`);
        res.write(`<p><b>Query:</b> ${JSON.stringify(parsedUrl.query)}</p>`);
        res.write('<h3>Request Headers:</h3>');
        res.write(`<pre>${JSON.stringify(req.headers, null, 2)}</pre>`);
        res.write('<a href="/" class="btn">Quay lại</a>');
        res.write('</div></div>');
        res.end();
    }

    // Trang 4: Tổng hợp Streams (/streams)
    else if (pathname === '/streams') {
        fs.readFile(path.join(__dirname, 'views/streams.html'), (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        });
    }

    // C. CÁC ENDPOINT CHỨC NĂNG
    
    else if (pathname === '/json') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: "success", sv: "Lai", detail: "Yêu cầu số 5" }));
    }

    else if (pathname === '/image') {
        const imgPath = path.join(__dirname, 'public/images/logo.png');
        if (fs.existsSync(imgPath)) {
            res.writeHead(200, { 'Content-Type': 'image/png' });
            fs.createReadStream(imgPath).pipe(res);
        } else {
            res.end("Vui lòng thêm file logo.png vào public/images/");
        }
    }

    else if (pathname === '/read-stream') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        fs.createReadStream(path.join(__dirname, 'data/story.txt')).pipe(res);
    }

    else if (pathname === '/transform-stream') {
        const source = fs.createReadStream(path.join(__dirname, 'data/story.txt'));
        const upperCase = new TextTransform();
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        source.pipe(upperCase).pipe(res);
    }

    else if (pathname === '/write-stream') {
        const content = parsedUrl.query.content || 'Empty Data';
        const writer = fs.createWriteStream(path.join(__dirname, 'data/log.txt'), { flags: 'a' });
        writer.write(`[Stream Write]: ${content} - lúc ${new Date().toLocaleString()}\n`);
        res.end('<script>alert("Đã ghi thành công!"); window.location.href="/streams";</script>');
    }

    else if (pathname === '/download-log') {
        res.writeHead(200, { 
            'Content-Type': 'text/plain',
            'Content-Disposition': 'attachment; filename=log.txt' 
        });
        fs.createReadStream(path.join(__dirname, 'data/log.txt')).pipe(res);
    }

    else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end("Trang bạn tìm không tồn tại!");
    }
});

server.listen(3000, () => {
    console.log('🚀 Server đã sẵn sàng tại http://localhost:3000');
});