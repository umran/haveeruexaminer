var express = require('express');
var router = express.Router();

//Data and Function Dependencies
var pollFunctions = require('../dependencies/functions');

/* Display polls page. */
router.get('/', pollFunctions.pollIndex);

/* Display specific polls. */
router.get('/:poll_id', function(req, res, next) {
	poll_id = req.params.poll_id;
  res.send("You're looking at poll " + poll_id);
});

/* Display specific poll results. */
router.get('/:poll_id/results', function(req, res, next) {
	poll_id = req.params.poll_id;
  res.send("You're looking at the results of poll " + poll_id);
});

/* Display voting page */
router.get('/:poll_id/vote', function(req, res, next) {
	poll_id = req.params.poll_id;
  res.send("You're voting on poll " + poll_id);
});

router.post('/:poll_id/vote', function(req, res, next) {
	poll_id = req.params.poll_id;
	res.send("You just voted on poll" + poll_id);
});

module.exports = router;