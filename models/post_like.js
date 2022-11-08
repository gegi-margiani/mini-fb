'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Post }) {
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
    }
    toJSON() {
      return { ...this.get(), userId: undefined, postId: undefined };
    }
  }
  PostLike.init(
    {
      userUuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      postUuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'postLikes',
      modelName: 'PostLike',
    }
  );
  return PostLike;
};
