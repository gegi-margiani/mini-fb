const { sequelize, User, Post, UserFollower, PostLike } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const getTokenFrom = (req) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

exports.postUser = async (req, res) => {
  const { first_name, last_name, email, password, password_confirm } = req.body;
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  try {
    if (!first_name) {
      return res.json('First name is required.');
    } else if (!last_name) {
      return res.json('Last name is required.');
    } else if (!email) {
      return res.json('Email is required.');
    } else if (!validateEmail(email)) {
      return res.json('Email is not valid.');
    } else if (!password) {
      return res.json('Password is required.');
    } else if (password.length < 4) {
      return res.json('Password should be at least 4 characters long.');
    } else if (password !== password_confirm) {
      return res.json('Passwords do not match.');
    } else {
      const userByEmail = await User.findOne({
        where: { email },
      });
      if (!userByEmail) {
        const passwordHash = await bcrypt.hash(
          password,
          +process.env.SALT_ROUNDS
        );
        const user = await User.create({
          first_name,
          last_name,
          email,
          password: passwordHash,
        });
        return res.json(user);
      } else {
        return res.json(`User with email: ${email} already exists`);
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.postUserSignIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email && password) {
      const user = await User.findOne({
        where: { email },
      });
      const passwordCheck = bcrypt.compareSync(password, user.password);
      if (!user || !passwordCheck) {
        return res.json('Email or password is incorrect.');
      } else {
        const userForToken = {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          uuid: user.uuid,
        };
        const token = jwt.sign(userForToken, process.env.SECRET);
        return res.json({ ...userForToken, token });
      }
    } else {
      return res.json('Email or password is missing.');
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ where: { uuid: req.params.id } });
    return res.json(users);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.updateProfilePicture = async (req, res) => {
  try {
    const user = await User.findOne({ where: { uuid: req.userUuid } });
    if (
      user.profile_picture_URL !== 'images/default-user-profile-picture.png'
    ) {
      fs.unlink(user.profile_picture_URL, (err) => {
        if (err) throw err;
      });
    }
    const updatedUser = { ...user, profile_picture_URL: req.file.path };
    user.update(updatedUser);

    return res.json(req.file.path);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.getFullUserInfo = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { uuid: req.params.userUuid },
      attributes: { exclude: ['createdAt', 'updatedAt', 'email', 'password'] },
      include: [
        {
          model: User,
          through: UserFollower,
          as: 'follows',
          attributes: [
            'first_name',
            'last_name',
            'profile_picture_URL',
            'uuid',
          ],
        },
        {
          model: User,
          through: UserFollower,
          as: 'followedBy',
          attributes: [
            'first_name',
            'last_name',
            'profile_picture_URL',
            'uuid',
          ],
        },
        {
          model: Post,
          as: 'posts',
          attributes: { exclude: ['UserId', 'updatedAt'] },
          include: [
            {
              model: PostLike,
              as: 'postLikes',
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'PostId', 'UserId'],
              },
            },
          ],
        },
      ],
    });
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
exports.getUserByToken = async (req, res) => {
  try {
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (decodedToken) {
      const user = await User.findOne({ where: { email: decodedToken.email } });
      if (user) {
        const data = {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          uuid: user.uuid,
          profile_picture_URL: user.profile_picture_URL,
        };
        return res.json(data);
      } else {
        return res.json(`User couldn't be found.`);
      }
    } else {
      res.json('Token is invalid.');
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.getUsersByString = async (req, res) => {
  try {
    const searchString = req.params.searchString;
    const searchArr = searchString.split(' ');
    const page = req.params.page;
    const token = getTokenFrom(req);
    let decodedToken = { email: null };
    if (token && token !== 'null') {
      decodedToken = jwt.verify(token, process.env.SECRET);
    }
    let users = { users: null, allPages: null };
    if (searchArr.length <= 2) {
      users.users = await User.findAll({
        where: {
          [Op.and]: [
            { email: { [Op.ne]: decodedToken.email } },
            {
              [Op.and]: [
                {
                  [Op.or]: [
                    { first_name: { [Op.like]: `%${searchArr[0]}%` } },
                    { first_name: { [Op.like]: `%${searchArr[1]}%` } },
                  ],
                },
                {
                  [Op.or]: [
                    { last_name: { [Op.like]: `%${searchArr[0]}%` } },
                    { last_name: { [Op.like]: `%${searchArr[1]}%` } },
                  ],
                },
              ],
            },
          ],
        },
        order: [['first_name', 'Desc']],
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'password', 'email'],
        },
        offset: (page - 1) * 5,
        limit: 5,
      });
      count = await User.findAndCountAll({
        where: {
          [Op.and]: [
            { email: { [Op.ne]: decodedToken.email } },
            {
              [Op.and]: [
                {
                  [Op.or]: [
                    { first_name: { [Op.like]: `%${searchArr[0]}%` } },
                    { first_name: { [Op.like]: `%${searchArr[1]}%` } },
                  ],
                },
                {
                  [Op.or]: [
                    { last_name: { [Op.like]: `%${searchArr[0]}%` } },
                    { last_name: { [Op.like]: `%${searchArr[1]}%` } },
                  ],
                },
              ],
            },
          ],
        },
      });
      users.allPages = Math.ceil(count.count / 5);
    }
    if (users.users.length > 0) {
      return res.json(users);
    } else {
      return res.json(`Users couldn't be found.`);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
