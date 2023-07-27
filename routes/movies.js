const router = require('express').Router();
const { validateMovieDelete, validateMovieCreate } = require('./validation');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validateMovieCreate(), createMovie);

router.delete('/:movieId', validateMovieDelete(), deleteMovie);

module.exports = router;
