const router = require('express').Router();
const isAuth = require('../middlewares/isAuth');
const commentControllers = require('../controllers/comments');
const commentLikeControllers = require('../controllers/commentLike');

router.post('/', isAuth.isAuth, commentControllers.postComment);
router.get(
  '/commentsByPost/:postUuid/:pages',
  commentControllers.getCommentsByPost
);
router.get(
  '/commentsByComment/:commentUuid/:pages',
  commentControllers.getCommentsByComment
);
router.get('/commentByUuid/:commentUuid', commentControllers.getCommentByUuid);

router.post('/commentLike', isAuth.isAuth, commentLikeControllers.commentLike);
router.delete(
  '/commentUnlike/:commentUuid',
  isAuth.isAuth,
  commentLikeControllers.commentUnlike
);
router.delete(
  '/comment/delete/:commentUuid',
  isAuth.isAuth,
  commentControllers.deleteCommentByUuid
);
module.exports = router;
