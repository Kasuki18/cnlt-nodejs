const express = require('express');
const session = require('express-session');
const logger = require('./middleware/loggerMiddleware');
const error = require('./middleware/errorMiddleware');

const app = express();
app.use(express.json());
app.use(logger); // Middleware logging in Method và URL

app.use(session({
    secret: 'secret-key-123',
    resave: false,
    saveUninitialized: true
}));

// Route mặc định: Giao diện Test API chuyên nghiệp
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f7f6; padding: 40px; }
                    .container { max-width: 800px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
                    .btn-group { margin: 20px 0; display: flex; gap: 10px; flex-wrap: wrap; }
                    button { padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; color: white; font-weight: bold; transition: 0.3s; }
                    .btn-blue { background: #007bff; } .btn-red { background: #dc3545; } .btn-green { background: #28a745; }
                    button:hover { opacity: 0.8; }
                    pre { background: #272822; color: #f8f8f2; padding: 15px; border-radius: 5px; min-height: 100px; overflow-x: auto; }
                    .status { font-weight: bold; color: #555; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Hệ thống Quản lý Sinh viên - TH9</h1>
                    <div class="status" id="status">Trạng thái: Sẵn sàng</div>
                    <div class="btn-group">
                        <button class="btn-blue" onclick="call('/login','POST',{username:'admin',password:'123456'})">Đăng nhập</button>
                        <button class="btn-blue" onclick="call('/students')">Danh sách SV</button>
                        <button class="btn-green" onclick="call('/students/stats')">Thống kê Tổng quan</button>
                        <button class="btn-green" onclick="call('/students/stats/class')">Thống kê Lớp</button>
                        <button class="btn-red" onclick="call('/heavy-sync')">Test Sync (Nghẽn)</button>
                        <button class="btn-red" onclick="call('/heavy-async')">Test Async (Không nghẽn)</button>
                    </div>
                    <pre id="output">Dữ liệu JSON sẽ hiển thị ở đây...</pre>
                </div>
                <script>
                    async function call(url, method='GET', body=null) {
                        document.getElementById('status').innerText = "Đang xử lý: " + url + "...";
                        try {
                            const res = await fetch(url, {
                                method: method,
                                headers: {'Content-Type': 'application/json'},
                                body: body ? JSON.stringify(body) : null
                            });
                            const data = await res.json();
                            document.getElementById('output').innerText = JSON.stringify(data, null, 4);
                            document.getElementById('status').innerText = "Hoàn tất: " + url;
                        } catch (e) {
                            document.getElementById('output').innerText = "Lỗi kết nối server!";
                        }
                    }
                </script>
            </body>
        </html>
    `);
});

// Kết nối Routes
app.use('/', require('./routes/authRoutes'));
app.use('/students', require('./routes/studentRoutes'));
app.use('/students', require('./routes/statsRoutes')); // Tách stats theo file mới

// Phần 4: Logic So sánh
app.get('/heavy-sync', (req, res) => {
    console.log("Bắt đầu SYNC...");
    for (let i = 0; i < 1e9; i++) {} // Chạy vòng lặp nặng
    console.log("Xử lý SYNC xong.");
    res.json({ message: "Đồng bộ hoàn tất" });
});

app.get('/heavy-async', async (req, res) => {
    console.log("Bắt đầu ASYNC...");
    await new Promise(r => setTimeout(r, 3000)); // Chờ không nghẽn
    console.log("Xử lý ASYNC xong.");
    res.json({ message: "Bất đồng bộ hoàn tất" });
});

app.use(error);
app.listen(3000, () => console.log("Server running at http://localhost:3000"));