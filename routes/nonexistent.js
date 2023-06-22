const router = require('express').Router();
const { checkWay } = require('../controllers/nonexistent');

router.all('/*', checkWay);

module.exports = router;
