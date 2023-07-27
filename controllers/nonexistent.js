const Constants = require('../utils/constants');
const NotFoundError = require('../utils/errors/NotFoundError');

exports.checkWay = (req, res, next) => {
  next(new NotFoundError(Constants.PAGE_NOT_FOUND));
};
