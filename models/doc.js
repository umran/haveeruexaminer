var mongoose = require('mongoose');

var docSchema = new mongoose.Schema({
	url: {type: String, unique: true, required: true},
  r_title: {type: String, required: false},
  r_byline: {type: String, required: false},
  r_date: {type: String, required: false},
  r_intro: {type: String, required: false},
  r_main: {type: String, required: false},
  fulltext: {type: String, required: false},
  hash: {type: String, required: true},
  dup_filter: {type: String, required: true}
});

var Doc = mongoose.model('Doc', docSchema);

module.exports = Doc;