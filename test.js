var mongoose = require('mongoose');

var Polls = require('./models/polls');

mongoose.connect('mongodb://localhost/pollsdb');

newPoll = new Polls({question: 'Do you trust the Government?', choices: [{choiceText: 'yes'}, {choiceText: 'no'}]});
newPoll.save(function (err) {
  if (err) return handleError(err);
  // saved!
})