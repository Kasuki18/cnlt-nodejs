const socket = io();
let myName = "";
let currentReceiver = "";
let chatHistory = {}; // Nơi lưu trữ tin nhắn tạm thời để không bị mất khi chuyển người

// 1. Hàm đăng nhập
function login() {
    const input = document.getElementById('username');
    myName = input.value.trim();
    
    if (myName) {
        // Gửi tên lên server để đăng ký
        socket.emit('register user', myName);
        
        // Chuyển đổi giao diện
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('chat-container').style.display = 'flex';
    } else {
        alert("Vui lòng nhập tên!");
    }
}

// 2. Lắng nghe danh sách người dùng online từ Server
socket.on('update user list', (users) => {
    const userList = document.getElementById('user-list');
    userList.innerHTML = ""; // Xóa danh sách cũ để vẽ lại

    users.forEach(user => {
        // Chỉ hiện những người khác (không hiện chính mình)
        if (user !== myName) {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="user-item-info">
                    <strong>${user}</strong>
                    <small style="color: #2ecc71; display: block;">• Đang hoạt động</small>
                </div>
            `;
            
            // Highlight người đang được chọn chat
            if (user === currentReceiver) li.style.background = "#eef5ff";

            li.onclick = () => selectUser(user);
            userList.appendChild(li);
        }
    });
});

// 3. Hàm chọn người để chat
function selectUser(user) {
    currentReceiver = user;
    document.getElementById('chat-with-title').textContent = "Đang chat với: " + user;
    
    // Sau khi chọn người, vẽ lại lịch sử tin nhắn của người đó
    renderMessages();
}

// 4. Hàm vẽ tin nhắn ra màn hình
function renderMessages() {
    const msgList = document.getElementById('messages');
    msgList.innerHTML = ""; // Xóa màn hình chat hiện tại

    // Lấy lịch sử chat với người đang chọn (nếu chưa có thì là mảng rỗng)
    const history = chatHistory[currentReceiver] || [];
    
    history.forEach(data => {
        const msgDiv = document.createElement('div');
        const isMe = data.sender === myName;
        
        // Thêm class để phân biệt trái/phải (đẹp hơn)
        msgDiv.className = `msg-item ${isMe ? 'msg-sent' : 'msg-received'}`;
        msgDiv.innerHTML = `
            <div class="content">${data.message}</div>
            <span class="msg-time">${data.time}</span>
        `;
        msgList.appendChild(msgDiv);
    });
    
    // Tự động cuộn xuống tin nhắn mới nhất
    msgList.scrollTop = msgList.scrollHeight;
}

// 5. Gửi tin nhắn
function sendMessage() {
    const input = document.getElementById('msg-input');
    const message = input.value.trim();

    if (!currentReceiver) {
        alert("Hãy chọn một người trong danh sách online để chat!");
        return;
    }

    if (message) {
        socket.emit('private message', {
            receiverName: currentReceiver,
            message: message
        });
        input.value = ""; // Xóa ô nhập sau khi gửi
    }
}

// 6. Lắng nghe tin nhắn từ Server (cả tin mình gửi đi và tin người khác gửi đến)
socket.on('receive message', (data) => {
    // Xác định xem tin nhắn này thuộc về cuộc hội thoại với ai
    const partner = (data.sender === myName) ? currentReceiver : data.sender;

    // Lưu vào bộ nhớ tạm chatHistory
    if (!chatHistory[partner]) {
        chatHistory[partner] = [];
    }
    chatHistory[partner].push(data);

    // Nếu mình đang mở cửa sổ chat với người đó thì mới vẽ lại màn hình
    if (partner === currentReceiver) {
        renderMessages();
    }
});

// Hỗ trợ nhấn phím Enter để gửi tin nhắn
document.getElementById('msg-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});