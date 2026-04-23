const router = require('express').Router();
const stats = require('../controllers/statsController');
const auth = require('../middleware/authMiddleware');

router.get('/stats', auth, stats.getGeneralStats);
router.get('/stats/class', auth, stats.getClassStats);

module.exports = router;