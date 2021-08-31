const jwt = require('jsonwebtoken');
const db = require('../models');

exports.signup = async function signup(req, res, next) {
  try {
    const user = await db.User.create(req.body);
    const { id, username, email } = user;
    const token = jwt.sign({
      id,
      username,
      email,
    }, process.env.SECRET);

    return res.status(200).json({
      id,
      username,
      email,
      token,
    });
  } catch (err) {
    // if validation fails
    if (err.code === 11000) {
      err.message = 'Sorry, that username and/or email is taken';
    }
    return next({
      status: 400,
      message: err.message,
    });
  }
};

exports.signin = async function signin(req, res, next) {
  try {
    const user = await db.User.findOne({
      username: req.body.username,
    });

    const { id, username, email } = user;
    const isMatch = await user.isValidPassword(req.body.password);
    if (isMatch) {
      const token = jwt.sign({
        id,
        username,
        email,
      }, process.env.SECRET);

      return res.status(200).json({
        id,
        username,
        email,
        token,
      });
    }

    return next({
      status: 400,
      message: 'Invalid Username/Password',
    });
  } catch (e) {
    return next({
      status: 400,
      message: 'Invalid Username/Password',
    });
  }
};
