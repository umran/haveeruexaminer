var mongoose = require('mongoose');

var userHashSchema = new mongoose.Schema({
  questionID: {type: String, required: true},
  userHashList: {type: String, required: false},
}, {
  collection: 'userHashes_collection'
});

var userHashes = mongoose.model('userHashes', userHashSchema);

module.exports = userHashes;