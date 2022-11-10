const router = require('express').Router();
const postControllers = require('../controllers/posts');
const postLikeControllers = require('../controllers/postLikes');
const isAuth = require('../middlewares/isAuth');

// router.get('/:id', postControllers.getPost);

router.get('/allPosts/:pages', postControllers.getAllPosts);
router.get('/post/:postUuid', postControllers.getPost);

router.post('/post', isAuth.isAuth, postControllers.postPost);

router.post('/postLike', isAuth.isAuth, postLikeControllers.postLike);
router.delete('/postUnlike', isAuth.isAuth, postLikeControllers.postUnlike);

module.exports = router;
