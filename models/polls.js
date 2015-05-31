var mongoose = require('mongoose');

var pollSchema = new mongoose.Schema({
  question: {type: String, required: true},
  choices: [{
    choiceText: String,
    votes: {
      type: Number,
      required: true,
      default: 0
    }
  }]
}, {
  collection: 'polls_collection'
});

var polls = mongoose.model('polls', pollSchema);

module.exports = polls;
