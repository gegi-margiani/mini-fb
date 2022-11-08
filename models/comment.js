'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Post, CommentLike, Comment, CommentReply }) {
      this.belongsTo(User, {
        foreignKey: 'userId',
        allowNull: false,
        as: 'user',
      });
      this.belongsTo(Post, {
        foreignKey: 'postId',
        allowNull: false,
        as: 'post',
      });
      this.hasMany(CommentLike, {
        as: 'commentLikes',
      });
      this.hasMany(Comment, {
        foreignKey: 'replyToId',
        allowNull: true,
        as: 'CommentReplies',
      });
    }
    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        userId: undefined,
        postId: undefined,
        replyToId: undefined,
      };
    }
  }
  Comment.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      replyToId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'comments',
      modelName: 'Comment',
    }
  );
  return Comment;
};
