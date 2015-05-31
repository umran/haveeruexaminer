var mongoose = require('mongoose');

var docMetaSchema = new mongoose.Schema({
  title: {type: String, required: true},
  fulltext: {type: String, required: false},
  tags: {type: Array, required: false}
}, {
  collection: 'docsMeta_collection'
});

var polls = mongoose.model('docsMeta', docMetaSchema);

module.exports = polls;