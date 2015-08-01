var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: '10.129.253.159:9200'
});

module.exports.client = client;