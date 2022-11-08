'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommentLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Comment }) {
      this.belongsTo(User, {
        foreignKey: 'userId',
        allowNull: false,
        as: 'user',
      });
      this.belongsTo(Comment, {
        foreignKey: 'commentId',
        allowNull: false,
        as: 'comment',
      });
    }
    toJSON() {
      return { ...this.get(), userId: undefined, postId: undefined };
    }
  }
  CommentLike.init(
    {
      userUuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      commentUuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      commentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'commentLikes',
      modelName: 'CommentLike',
    }
  );
  return CommentLike;
};
