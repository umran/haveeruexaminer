var express = require('express');
var router = express.Router();

/* Display specific polls. */
router.get('/:poll_id', function(req, res, next) {
	poll_id = req.params.poll_id
  res.send("You're looking at poll " + poll_id);
});

module.exports = router;