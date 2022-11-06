const router = require('express').Router();
const postControllers = require('../controllers/posts');

// router.get('/', postControllers.getAllPosts);

// router.get('/:id', postControllers.getPost);

router.post('/post', postControllers.postPost);

module.exports = router;
