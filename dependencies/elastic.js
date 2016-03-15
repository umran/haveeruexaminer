var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
	hosts: ['https://haveeruexaminer:0998a3407@search.haveeruexaminer.com'],
	ssl: {
		rejectUnauthorized: true
	}
});

module.exports.client = client;