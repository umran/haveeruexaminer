var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('v2', { title: 'Home'});
});

module.exports = router;