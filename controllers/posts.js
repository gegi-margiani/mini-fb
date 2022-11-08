const {
  sequelize,
  Post,
  User,
  PostLike,
  Comment,
  CommentLike,
} = require('../models');

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
    return res.json({ posts, pages: Math.ceil(allPosts.length / 10) });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
