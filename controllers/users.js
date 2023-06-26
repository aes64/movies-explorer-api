const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Constants = require('../utils/constants');
const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');
const AlreadyExistError = require('../utils/errors/AlreadyExistError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundError(Constants.NOT_FOUND_ERROR);
      }
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        next(new NotFoundError(Constants.NOT_FOUND_ERROR));
      }
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new AlreadyExistError(Constants.ALREADY_EXIST));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(Constants.BAD_REQUEST));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((userdata) => res
      .status('201')
      .send({
        name: userdata.name,
        email: userdata.email,
        _id: userdata._id,
      }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new AlreadyExistError(Constants.ALREADY_EXIST));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(Constants.BAD_REQUEST));
      } else {
        next(err);
      }
    });
};
