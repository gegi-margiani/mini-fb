const jwt = require('jsonwebtoken');

const getTokenFrom = (req) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

exports.isAuth = (req, res, next) => {
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  try {
    if (!decodedToken) {
      res.json('Token is invalid.');
    } else {
      req.userUuid = decodedToken.uuid;
      next();
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
