const router = require('express').Router();
const userControllers = require('../controllers/users');
const userFollowControllers = require('../controllers/userFollow');
const isAuth = require('../middlewares/isAuth');

router.post('/', userControllers.postUser);

router.post('/signIn', userControllers.postUserSignIn);

router.get('/:id', userControllers.getUser);

router.get('/user/ByToken', userControllers.getUserByToken);

router.get('/search/:searchString/:page', userControllers.getUsersByString);

router.post('/follow', isAuth.isAuth, userFollowControllers.userFollow);

router.delete('/unfollow', isAuth.isAuth, userFollowControllers.userUnfollow);

router.get('/user/full-info/:userUuid', userControllers.getFullUserInfo);

router.put(
  '/user/update-profile-picture',
  isAuth.isAuth,
  userControllers.updateProfilePicture
);

module.exports = router;
