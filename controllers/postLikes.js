const { sequelize, PostLike, User, Post } = require('../models');

exports.postLike = async (req, res) => {
  const userUuid = req.body.userUuid;
  const postUuid = req.body.postUuid;
  try {
    if (userUuid && postUuid) {
      const user = await User.findOne({ where: { uuid: userUuid } });
      const post = await Post.findOne({ where: { uuid: postUuid } });
      const body = {
        userUuid,
        postUuid,
        userId: user.id,
        postId: post.id,
      };
      const postLiked = await PostLike.findOne({
        where: { userUuid, postUuid },
      });
      if (!postLiked) {
        PostLike.create(body);
        return res.json('Post liked.');
      } else {
        return res.json('Error. Post is already liked');
      }
    } else {
      return res.json('Post or user is missing.');
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
exports.postUnlike = async (req, res) => {
  const userUuid = req.body.userUuid;
  const postUuid = req.body.postUuid;
  console.log(userUuid, postUuid);
  try {
    if (userUuid && postUuid) {
      PostLike.destroy({
        where: { userUuid, postUuid },
      });
      return res.json('Post unliked.');
    } else {
      return res.json('Post or user is missing.');
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
