'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserFollower extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      this.belongsTo(User, {
        foreignKey: 'followsId',
        allowNull: false,
        as: 'follows',
      });
      this.belongsTo(User, {
        foreignKey: 'followedById',
        allowNull: false,
        as: 'followedBy',
      });
    }
    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        followsId: undefined,
        followedById: undefined,
      };
    }
  }
  UserFollower.init(
    {
      followsId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      followedById: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'userFollower',
      modelName: 'UserFollower',
    }
  );
  return UserFollower;
};
