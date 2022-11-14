const {
  sequelize,
  Post,
  User,
  PostLike,
  Comment,
  CommentLike,
} = require('../models');
const fs = require('fs');

exports.postPost = async (req, res) => {
  const userUuid = req.userUuid;
  let text = null;
  let imageURL = null;
  if (req.body.text) text = req.body.text;
  if (req.file) imageURL = req.file.path;

  try {
    const user = await User.findOne({ where: { uuid: userUuid } });
    const body = {
      text,
      imageURL,
      userId: user.id,
    };
    if (!body.text && !imageURL) {
      res.json('Post should contain at least text or image');
    } else {
      const post = await Post.create(body);

      return res.json(post);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.getAllPosts = async (req, res) => {
  const pages = +req.params.pages;
  try {
    const posts = await Post.findAll({
      attributes: { exclude: ['UserId'] },
      order: [['createdAt', 'Desc']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: ['email', 'password', 'createdAt', 'updatedAt'],
          },
        },
        {
          model: PostLike,
          as: 'postLikes',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'PostId', 'UserId'],
          },
        },
      ],
      limit: 15 * pages,
    });
    const allPosts = await Post.findAll({
      attributes: { exclude: ['UserId'] },
    });
    return res.json({ posts, pages: Math.ceil(allPosts.length / 15) });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
exports.getFollowedPosts = async (req, res) => {
  const pages = +req.params.pages;
  const userUuid = req.userUuid;
  try {
    const userFollows = await User.findAll({
      where: { uuid: userUuid },
      attributes: ['uuid', 'first_name', 'last_name'],
      include: [
        {
          model: User,
          as: 'follows',
          attributes: ['uuid'],
        },
      ],
    });
    const userUuids = userFollows[0].follows.map((user) => user.uuid);

    const posts = await Post.findAll({
      attributes: { exclude: ['UserId'] },
      order: [['createdAt', 'Desc']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: ['email', 'password', 'createdAt', 'updatedAt'],
          },
          where: { uuid: userUuids },
        },
        {
          model: PostLike,
          as: 'postLikes',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'PostId', 'UserId'],
          },
        },
      ],
      limit: 15 * pages,
    });
    const allPosts = await Post.findAll({
      attributes: { exclude: ['UserId'] },
      order: [['createdAt', 'Desc']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: ['email', 'password', 'createdAt', 'updatedAt'],
          },
          where: { uuid: userUuids },
        },
      ],
    });
    return res.json({ posts, pages: Math.ceil(allPosts.length / 15) });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findOne({
      attributes: { exclude: ['UserId'] },
      where: { uuid: req.params.postUuid },
      order: [['createdAt', 'Desc']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: ['email', 'password', 'createdAt', 'updatedAt'],
          },
        },
        {
          model: PostLike,
          as: 'postLikes',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'PostId', 'UserId'],
          },
        },
      ],
    });
    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.deletePostByUuid = async (req, res) => {
  try {
    const postUuid = req.params.postUuid;
    if (postUuid) {
      const post = await Post.findOne({
        where: { uuid: postUuid },
      });
      if (post.imageURL) {
        fs.unlink(post.imageURL, (err) => {
          if (err) throw err;
        });
      }
      await post.destroy();
      return res.json('Post deleted');
    } else {
      return res.json('Post or user is missing.');
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
