const router = require('express').Router();
const userControllers = require('../controllers/users');

router.post('/', userControllers.postUser);

router.post('/signIn', userControllers.postUserSignIn);

router.get('/:id', userControllers.getUser);

router.get('/user/ByToken', userControllers.getUserByToken);

router.get('/search/:searchString/:page', userControllers.getUsersByString);

module.exports = router;
