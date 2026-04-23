const express = require('express'); // Đảm bảo dùng express
const router = express.Router();
const authController = require('../controllers/authController');

// Kiểm tra kỹ tên hàm sau dấu chấm (.)
router.post('/login', authController.login); 
router.post('/logout', authController.logout);

module.exports = router;