const router = require('express').Router();
const student = require('../controllers/studentController');
const stats = require('../controllers/statsController');
const auth = require('../middleware/authMiddleware');

router.use(auth);
router.get('/stats', stats.getGeneralStats);
router.get('/stats/class', stats.getClassStats);
router.get('/', student.getAll);
router.get('/:id', student.getById);
router.post('/', student.create);
router.put('/:id', student.update);
router.delete('/:id', student.softDelete);

module.exports = router;