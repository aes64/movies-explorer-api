const { celebrate, Joi } = require('celebrate');
const Constants = require('../utils/constants');

module.exports.validateSignin = () => celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validateSignup = () => celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
});

module.exports.validateUserUpdate = () => celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validateMovieCreate = () => celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(Constants.REGEXPHTTP),
    trailerLink: Joi.string().required().pattern(Constants.REGEXPHTTP),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(Constants.REGEXPHTTP),
    movieId: Joi.number().required(),
  }),
});

module.exports.validateMovieDelete = () => celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
});
