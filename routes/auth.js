var express = require('express');
var router = express.Router();

// load authentication module
var passport = require('../dependencies/auth');

// redirect to twitter for authentication
router.get('/twitter', passport.authenticate('twitter'));

// redirect user after authentication
router.get('/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/users' }));

module.exports = router;