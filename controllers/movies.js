const mongoose = require('mongoose');
const Movie = require('../models/movie');
const Constants = require('../utils/constants');
const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');
const AccessError = require('../utils/errors/AccessError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res
      .status('201')
      .send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(Constants.BAD_REQUEST));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const movieId = await Movie.findOne({ _id: req.params.movieId });
    const OwnerId = req.user._id;
    if (movieId === null) {
      next(new NotFoundError(Constants.NOT_FOUND_ERROR_MOVIE));
    } else if (movieId.owner.valueOf() === OwnerId) {
      const movie = await Movie.findByIdAndRemove(req.params.movieId);
      res.send(movie);
    } else {
      next(new AccessError(Constants.ACCESS_DENIED));
    }
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError(Constants.BAD_REQUEST));
    } else {
      next(err);
    }
  }
};
