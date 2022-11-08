const { sequelize, CommentLike, User, Comment } = require('../models');

exports.commentLike = async (req, res) => {
  const userUuid = req.body.userUuid;
  const commentUuid = req.body.commentUuid;
  try {
    if (userUuid && commentUuid) {
      const user = await User.findOne({ where: { uuid: userUuid } });
      const comment = await Comment.findOne({ where: { uuid: commentUuid } });
      const body = {
        userUuid,
        commentUuid,
        userId: user.id,
        commentId: comment.id,
      };
      const commentLiked = await CommentLike.findOne({
        where: { userUuid, commentUuid },
      });
      if (!commentLiked) {
        CommentLike.create(body);
        return res.json('Comment liked.');
      } else {
        return res.json('Error. Comment is already liked');
      }
    } else {
      return res.json('comment or user is missing.');
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
exports.commentUnlike = async (req, res) => {
  const userUuid = req.body.userUuid;
  const commentUuid = req.body.commentUuid;
  console.log(userUuid, commentUuid);
  try {
    if (userUuid && commentUuid) {
      CommentLike.destroy({
        where: { userUuid, commentUuid },
      });
      return res.json('Comment unliked.');
    } else {
      return res.json('Comment or user is missing.');
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
