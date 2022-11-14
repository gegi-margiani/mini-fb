const { sequelize, User, UserFollower } = require('../models');

exports.userFollow = async (req, res) => {
  const userUuid = req.body.userUuid;
  const followerUuid = req.userUuid;
  try {
    if (userUuid && followerUuid) {
      const user = await User.findOne({ where: { uuid: userUuid } });
      const follower = await User.findOne({ where: { uuid: followerUuid } });
      const body = {
        followsId: follower.id,
        followedById: user.id,
      };
      const userFollower = await UserFollower.findOne({
        where: { followsId: follower.id, followedById: user.id },
      });
      if (!userFollower) {
        UserFollower.create(body);
        return res.json('User followed.');
      } else {
        return res.json('Error. User is already followed.');
      }
    } else {
      return res.json('User is missing');
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.userUnfollow = async (req, res) => {
  const userUuid = req.body.userUuid;
  const followerUuid = req.userUuid;
  try {
    const user = await User.findOne({ where: { uuid: userUuid } });
    const follower = await User.findOne({ where: { uuid: followerUuid } });
    if (user.id && follower.id) {
      UserFollower.destroy({
        where: { followsId: follower.id, followedById: user.id },
      });
      return res.json('User unfollowed.');
    } else {
      return res.json('User is missing.');
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
