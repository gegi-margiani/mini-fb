const { sequelize, User, Post, Comment, CommentLike } = require('../models');

exports.postComment = async (req, res) => {
  const userUuid = req.userUuid;
  const postUuid = req.body.postUuid;
  const content = req.body.content;
  const replyToUuid = req.body.replyToUuid;
  try {
    const user = await User.findOne({ where: { uuid: userUuid } });
    const post = await Post.findOne({ where: { uuid: postUuid } });
    const body = {
      content,
      userId: user.id,
      postId: post.id,
    };
    if (replyToUuid) {
      const replyToId = await Comment.findOne({ where: { uuid: replyToUuid } });
      if (replyToId) {
        body.replyToId = replyToId.id;
      }
    }
    if (!content) {
      res.json('Comment should contain text');
    } else {
      const comment = await Comment.create(body);

      return res.json(comment);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
exports.getCommentsByPost = async (req, res) => {
  const postUuid = req.params.postUuid;
  try {
    const post = await Post.findOne({
      attributes: { exclude: ['UserId'] },
      where: { uuid: postUuid },
      include: [
        {
          model: Comment,
          as: 'comments',
          attributes: {
            exclude: ['updatedAt', 'PostId', 'UserId'],
          },
          where: { replyToId: null },
          include: [
            {
              model: CommentLike,
              as: 'commentLikes',
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'commentId', 'UserId'],
              },
            },
            {
              model: Comment,
              as: 'CommentReplies',
              attributes: {
                exclude: [
                  'createdAt',
                  'updatedAt',
                  'PostId',
                  'UserId',
                  'replyToId',
                ],
              },
              include: [
                {
                  model: CommentLike,
                  as: 'commentLikes',
                  attributes: {
                    exclude: [
                      'createdAt',
                      'updatedAt',
                      'commentId',
                      'UserId',
                      'PostId',
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
      order: [[{ model: Comment, as: 'comments' }, 'createdAt', 'Desc']],
    });
    if (post) {
      const comments = {
        comments: post.comments,
        commentCurrPage: 1,
        commentCountShow: 15,
        commentCount: post.comments.length,
        commentTotalPages: Math.ceil(post.comments.length / 15),
      };
      return res.json(comments);
    } else {
      return res.json('This post has no comments.');
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.getCommentsByComment = async (req, res) => {
  const commentUuid = req.params.commentUuid;
  try {
    const comment = await Comment.findOne({
      attributes: { exclude: ['createdAt', 'updatedAt', 'PostId', 'UserId'] },
      where: { uuid: commentUuid },
      include: [
        {
          model: Comment,
          as: 'CommentReplies',
          attributes: {
            exclude: ['updatedAt', 'PostId', 'UserId'],
          },
          include: [
            {
              model: CommentLike,
              as: 'commentLikes',
              attributes: {
                exclude: [
                  'createdAt',
                  'updatedAt',
                  'commentId',
                  'PostId',
                  'UserId',
                ],
              },
            },
            {
              model: Comment,
              as: 'CommentReplies',
              attributes: {
                exclude: [
                  'createdAt',
                  'updatedAt',
                  'PostId',
                  'UserId',
                  'replyToId',
                ],
              },
              include: [
                {
                  model: CommentLike,
                  as: 'commentLikes',
                  attributes: {
                    exclude: [
                      'createdAt',
                      'updatedAt',
                      'commentId',
                      'PostId',
                      'UserId',
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
      order: [[{ model: Comment, as: 'CommentReplies' }, 'createdAt', 'Desc']],
    });

    const comments = {
      comments: comment.CommentReplies,
      commentCurrPage: 1,
      commentCountShow: 10,
      commentCount: comment.CommentReplies.length,
      commentTotalPages: Math.ceil(comment.CommentReplies.length / 10),
    };
    return res.json(comments);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
