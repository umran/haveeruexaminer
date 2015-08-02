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
        pre_tags: ['<strong>'],
        post_tags: ['</strong>'],
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
  	
  	//parse results
  	var pretty = {};
  	
  	//get query meta data
  	pretty.meta = {};
  	pretty.meta.time = response.took;
  	pretty.meta.hits = response.hits.total;
  	
  	pretty.items = [];
  	var results = response.hits.hits;
  	results.forEach(function(result){
  		var item = {};
  		item.title = result._source.r_title;
  		
  		//prepare excerpt
  		if(result.highlight.r_intro && result.highlight.fulltext){
  			var aggregate = result.highlight.r_intro.concat(result.highlight.fulltext);
  			var excerpt = aggregate.join('... ');
  		} else if(result.highlight.r_intro){
  			var excerpt = result.highlight.r_intro.join('... ');
  		} else{
  			var excerpt = result.highlight.fulltext.join('... ');
  		}
  		
  		item.excerpt = excerpt;
  		pretty.items.push(item);
  	});
  	
  	res.setHeader('Content-Type', 'application/json');
  	res.send(JSON.stringify({
  		code: 1,
  		response: pretty
  	}));
	});
});

module.exports = router;