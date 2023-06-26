const router = require('express').Router();
const { validateUserUpdate } = require('./validation');

const {
  getMe,
  updateProfile,
} = require('../controllers/users');

router.get('/me', getMe);

router.patch('/me', validateUserUpdate(), updateProfile);

module.exports = router;
