var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
	/*hosts: ['https://haveeruexaminer:0998a3407@search.haveeruexaminer.com'],
	ssl: {
		rejectUnauthorized: true
	}*/
	hosts: ['127.0.0.1:9200']
});

module.exports.client = client;