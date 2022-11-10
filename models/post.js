'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Comment, PostLike }) {
      this.belongsTo(User, {
        foreignKey: 'userId',
        allowNull: false,
        as: 'user',
      });
      this.hasMany(Comment, {
        as: 'comments',
        onDelete: 'cascade',
        hooks: true,
      });
      this.hasMany(PostLike, {
        as: 'postLikes',
        onDelete: 'cascade',
        hooks: true,
      });
    }
    toJSON() {
      return { ...this.get(), id: undefined, userId: undefined };
    }
  }
  Post.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      text: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      imageURL: {
        type: DataTypes.STRING,
        defaultValue: null,
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
    },
    {
      sequelize,
      tableName: 'posts',
      modelName: 'Post',
    }
  );
  return Post;
};
