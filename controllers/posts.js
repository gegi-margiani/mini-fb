const { sequelize, Post, User } = require('../models');

exports.postPost = async (req, res) => {
  console.log(req.body);
  const userUuid = req.body.userUuid;
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
