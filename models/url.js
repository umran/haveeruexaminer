var mongoose = require('mongoose');

var urlSchema = new mongoose.Schema({
	url: {type: String, unique: true, required: true}
});

var url = mongoose.model('url', urlSchema);

module.exports = url;