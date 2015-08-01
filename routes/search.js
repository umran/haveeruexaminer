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
      aggs: {
      	r_title: {
        	terms: {
          	field: 'r_title'
          },
          aggs: {
          	r_intro: {
            	terms: {
              	field: 'r_intro'
              }
          	}
          }
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
  function (error, response) {
    if(error){
    	res.setHeader('Content-Type', 'application/json');
    	res.send(JSON.stringify({
    		code: 0,
    		response: 'Search Server Unavailable'
    	}));
    	return;
  	}
  	res.setHeader('Content-Type', 'application/json');
  	res.send(JSON.stringify({
  		code: 1,
  		response: response
  	}));
	});
});

module.exports = router;