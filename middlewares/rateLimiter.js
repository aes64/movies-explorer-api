const rateLimit = require('express-rate-limit');
const Constants = require('../utils/constants');

module.exports.rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: Constants.OVER_LIMIT,
  standardHeaders: true,
  legacyHeaders: false,
});
