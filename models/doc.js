var mongoose = require('mongoose');

var docSchema = new mongoose.Schema({
	url: {type: String, unique: true, required: true},
  r_title: {type: String, required: false},
  r_byline: {type: String, required: false},
  r_date: {type: String, required: false},
  r_intro: {type: String, required: false},
  r_main: {type: String, required: false},
  hash: {type: String, required: true}
});

var doc = mongoose.model('doc', docSchema);

module.exports = doc;