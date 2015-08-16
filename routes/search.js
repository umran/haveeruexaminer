var express = require('express');
var router = express.Router();
var elastic = require('../dependencies/elastic.js');
var client = elastic.client;
var perPage = 15;
var Utilities = require('../dependencies/utilities.js');
var utilities = new Utilities;

/* GET users listing. */
router.get('/:query/:page?', function(req, res, next) {
  var userQuery = req.params.query;
  var pageNum = req.params.page;
  
  if(!pageNum){
  	pageNum = 1;
  }
  
  //do search
	client.search({
  	index: 'docs',
  	from: (pageNum - 1) * perPage,
  	size: perPage,
  	body: {
    	query: {
        multi_match: {
        	query: userQuery,
          fields: ["r_title", "r_intro", "fulltext"]
        }
      },
      highlight: {
        order: 'score',
        pre_tags: ['<mark>'],
        post_tags: ['</mark>'],
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
  	
  	//debugging
  	if(!response){
  		res.setHeader('Content-Type', 'application/json');
    	res.send(JSON.stringify({
    		code: 2,
    		response: 'Something weird is going on'
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
  		if(typeof result.highlight.r_intro !== 'undefined' && typeof result.highlight.fulltext !== 'undefined'){
  			var aggregate = result.highlight.r_intro.concat(result.highlight.fulltext);
  			var excerpt = aggregate.join('... ');
  		} else if(typeof result.highlight.r_intro !== 'undefined'){
  			var excerpt = result.highlight.r_intro.join('... ');
  		} else if(typeof result.highlight.fulltext !== 'undefined'){
  			var excerpt = result.highlight.fulltext.join('... ');
  		} else{
  			var excerpt = '[Excerpt Unavailable]';
  		}
  		
  		item.excerpt = excerpt;
  		
  		//determine language
			item.lang = utilities.getLang(result._source.r_title);  		
  		
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