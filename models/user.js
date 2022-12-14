'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post, Comment, PostLike, CommentLike, UserFollower }) {
      this.hasMany(Post, {
        as: 'posts',
        onDelete: 'cascade',
        hooks: true,
      });
      this.hasMany(Comment, {
        as: 'comments',
        onDelete: 'cascade',
        hooks: true,
      });
      this.hasMany(PostLike, {
        as: 'postLike',
        onDelete: 'cascade',
        hooks: true,
      });
      this.hasMany(CommentLike, {
        as: 'commentLike',
        onDelete: 'cascade',
        hooks: true,
      });
      this.belongsToMany(User, {
        through: UserFollower,
        as: 'follows',
        foreignKey: 'followsId',
        onDelete: 'cascade',
        hooks: true,
      });
      this.belongsToMany(User, {
        through: UserFollower,
        as: 'followedBy',
        foreignKey: 'followedById',
        onDelete: 'cascade',
        hooks: true,
      });
    }
    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }
  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profile_picture_URL: {
        type: DataTypes.STRING,
        defaultValue: 'images/default-user-profile-picture.png',
      },
    },
    {
      sequelize,
      tableName: 'users',
      modelName: 'User',
    }
  );
  return User;
};
