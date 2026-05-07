const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

// Lưu trữ danh sách user online: { socketId: username }
let onlineUsers = {};

io.on('connection', (socket) => {
    // 1. Khi user nhập tên và tham gia
    socket.on('register user', (username) => {
        onlineUsers[socket.id] = username;
        // Cập nhật danh sách online cho tất cả mọi người
        io.emit('update user list', Object.values(onlineUsers));
    });

    // 2. Gửi và nhận tin nhắn realtime (Chat riêng)
    socket.on('private message', ({ receiverName, message }) => {
        const receiverSocketId = Object.keys(onlineUsers).find(
            key => onlineUsers[key] === receiverName
        );

        const msgData = {
            sender: onlineUsers[socket.id],
            message: message,
            time: new Date().toLocaleTimeString()
        };

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('receive message', msgData);
        }
        // Gửi ngược lại cho chính người gửi để hiển thị lên màn hình chat
        socket.emit('receive message', msgData);
    });

    // 3. Tự động cập nhật khi user thoát/mất kết nối
    socket.on('disconnect', () => {
        delete onlineUsers[socket.id];
        io.emit('update user list', Object.values(onlineUsers));
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});