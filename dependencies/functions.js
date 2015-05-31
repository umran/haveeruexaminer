//Data Dependencies
var Polls = require('../models/polls');
var UserHashes = require('../models/userhashes');

var exports = module.exports = {};

exports.pollIndex = function(req, res, next){
	Polls.find().sort('-_id').limit(5).exec(function(err, polls) {
    if (err){
      // Pass it along to the next error-handling middleware to deal with
      next('Uh oh! Something went wrong when fetching polls from the database.');
    }
    else if (polls) {
      console.log(polls);
      var questions = new Array();
      if(polls.length > 0){
      	for (var i = 0; i < polls.length; i++) {
        	questions.push(polls[i].question);
      	}
      }
      else{
      	questions.push('No polls to show');
      }
      res.render('pollindex', { data: questions });
    }
  });
}