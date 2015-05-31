var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:accessCode', function(req, res, next) {
  accessCode = 
  res.render('index', { title: 'judicialwatchmv'});
});

module.exports = router;