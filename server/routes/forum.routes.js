const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forum.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', forumController.getPosts);
router.get('/:id', forumController.getPost);
router.post('/', protect, forumController.createPost);
router.post('/:id/comments', protect, forumController.addComment);
router.patch('/:id/vote', protect, forumController.votePost);
router.patch('/:id', protect, forumController.updatePost);
router.delete('/:id', protect, forumController.deletePost);

module.exports = router;
