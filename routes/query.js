var express = require('express');
var router = express.Router();
var elastic = require('../dependencies/elastic.js');
var client = elastic.client;
var perPage = 15;

/* GET users listing. */
router.get('/:query/:page', function(req, res, next) {
  var userQuery = req.params.query;
  var pageNum = req.params.page;
  
  //do search op
	client.search({
  	index: 'docs',
  	from: (pageNum - 1) * perPage,
  	size: perPage,
  	body: {
    	query: {
        match: {
          // match the query against all of
          // the fields in the docs index
          _all: userQuery
        }
      },
      highlight: {
        order: 'score',
        fields: {
          r_intro: {fragment_size: 150, number_of_fragments: 0},
          fulltext: {fragment_size: 150, number_of_fragments: 3}
        }
    	}
    }
  },
  function (err, response) {
    if(err){
    	console.log(err);
    	return;
  	}
  	res.setHeader('Content-Type', 'application/json');
  	res.send(JSON.stringify(response));
	});
});

module.exports = router;