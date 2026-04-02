const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts);
router.get('/posts/create', postController.renderAddForm);
router.post('/posts/create', postController.createPost);
router.get('/posts/:id', postController.getPostById);
router.get('/posts/edit/:id', postController.renderEditForm);
router.post('/posts/edit/:id', postController.updatePost);
router.post('/posts/delete/:id', postController.deletePost);

module.exports = router;