var express = require('express');
var router = express.Router();

/* GET API page. */
router.get('/docs', function(req, res, next) {
  res.render('api', { title: 'API'});
});

module.exports = router;