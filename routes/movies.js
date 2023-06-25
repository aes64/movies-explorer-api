const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const Constants = require('../utils/constants');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().min(2).pattern(Constants.REGEXPHTTP),
    trailerLink: Joi.string().required().min(2).pattern(Constants.REGEXPHTTP),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().min(2).pattern(Constants.REGEXPHTTP),
    movieId: Joi.number().hex().required(),
  }),
}), createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().max(7).required(),
  }),
}), deleteMovie);

module.exports = router;
