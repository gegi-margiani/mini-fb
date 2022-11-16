const router = require('express').Router();
const postControllers = require('../controllers/posts');
const postLikeControllers = require('../controllers/postLike');
const isAuth = require('../middlewares/isAuth');

// router.get('/:id', postControllers.getPost);

router.get('/allPosts/:pages', postControllers.getAllPosts);
router.get(
  '/followedPosts/:pages',
  isAuth.isAuth,
  postControllers.getFollowedPosts
);
router.get('/userPosts/:userUuid/:pages', postControllers.getUserPosts);

router.get('/post/:postUuid', postControllers.getPost);

router.post('/post', isAuth.isAuth, postControllers.postPost);
router.post('/post/share', isAuth.isAuth, postControllers.sharePost);

router.post('/postLike', isAuth.isAuth, postLikeControllers.postLike);
router.delete(
  '/postUnlike/:postUuid',
  isAuth.isAuth,
  postLikeControllers.postUnlike
);
router.delete(
  '/post/delete/:postUuid',
  isAuth.isAuth,
  postControllers.deletePostByUuid
);

module.exports = router;
