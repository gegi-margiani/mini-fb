const router = require('express').Router();
const postControllers = require('../controllers/posts');
const isAuth = require('../middlewares/isAuth');

// router.get('/:id', postControllers.getPost);

router.get('/allPosts/:pages', postControllers.getAllPosts);

router.post('/post', isAuth.isAuth, postControllers.postPost);

module.exports = router;
