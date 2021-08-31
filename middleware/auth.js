const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const db = require('../models');

exports.config = function config() {
  passport.use(
    new JWTstrategy(
      {
        secretOrKey: process.env.SECRET,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      },
      async (jwtPayload, next) => {
        try {
          const user = await db.User.findById(jwtPayload.id);

          return user ? next(null, user) : next({ status: 400, message: 'Invalid Authorization Token' });
        } catch (err) {
          return next({
            status: 400,
            message: 'Invalid Authorization Token',
          });
        }
      },
    ),
  );
};

exports.authenticate = async function authenticate(req, res, next) {
  let errorMessage = 'Error occured while authentication';
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    // If authentication failed, `user` will be set to false.
    // If an exception occurred, `err` will be set.
    if (err) {
      return next(err);
    }
    if (!user || _.isEmpty(user)) {
      switch (info.name) {
        case 'TokenExpiredError':
          errorMessage = 'Authorization token is expired';
          break;
        case 'JsonWebTokenError':
          errorMessage = 'Invalid Authorization token';
          break;
        default:
          errorMessage = info.message;
          break;
      }
      return next({
        status: 401,
        message: errorMessage,
      });
    }
    return next();
  })(req, res, next);
};

exports.authorize = async function authorize(req, res, next) {
  try {
    const jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
    jwt.verify(jwtFromRequest(req), process.env.SECRET, (err, decoded) => {
      if (err) {
        return next(err);
      }
      if (decoded && decoded.id === req.params.userId) {
        return next();
      }
      return next({
        status: 400,
        message: 'You do not have access to perform this action',
      });
    });
  } catch (err) {
    next({
      status: 400,
      message: err.message,
    });
  }
};
