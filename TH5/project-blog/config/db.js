const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Sử dụng 0.0.0.0 để khớp với --bind_ip_all bạn vừa chạy
        await mongoose.connect('mongodb://0.0.0.0:27017/blogDB');
        console.log('✅ KẾT NỐI MONGODB THÀNH CÔNG!');
    } catch (err) {
        console.error('❌ Lỗi kết nối:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;