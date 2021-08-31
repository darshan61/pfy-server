const db = require('../models');

exports.get = async function get(req, res, next) {
  try {
    const user = await db.User.findById(req.params.userId, '-password');
    if (!user) {
      return next({
        status: 400,
        message: 'User Not Found',
      });
    }
    return res.status(200).json(user);
  } catch (err) {
    return next({
      status: 400,
      message: err.message,
    });
  }
};

exports.update = async function update(req, res, next) {
  try {
    const updatedUser = await db.User.findByIdAndUpdate(
      req.params.userId,
      { ...req.body, updatedOn: Date.now() },
      {
        projection: { password: false },
      },
    );
    if (!updatedUser) {
      return next({
        status: 400,
        message: 'User Not Found',
      });
    }

    return res.status(200).json(updatedUser);
  } catch (err) {
    return next({
      status: 400,
      message: err.message,
    });
  }
};

exports.remove = async function remove(req, res, next) {
  try {
    const removedUser = await db.User.findByIdAndDelete(req.params.userId, {
      projection: { password: false },
    });
    if (!removedUser) {
      return next({
        status: 400,
        message: 'User Not Found',
      });
    }

    return res.status(200).json(removedUser);
  } catch (err) {
    return next({
      status: 400,
      message: err.message,
    });
  }
};
