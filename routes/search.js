var express = require('express');
var router = express.Router();
var elastic = require('../dependencies/elastic.js');
var client = elastic.client;
var perPage = 15;
var Utilities = require('../dependencies/utilities.js');
var utilities = new Utilities;

/* GET users listing. */
router.get('/:query/:page?', function(req, res, next) {
  var userQuery = decodeURIComponent(req.params.query);
  
  //debugging
  console.log(userQuery);
  
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
        query_string: {
          query: userQuery,
          fields: ["r_title", "r_intro", "fulltext"]
        }
      },
      highlight: {
        order: 'score',
        pre_tags: ['<strong>'],
        post_tags: ['</strong>'],
        fields: {
          r_intro: {fragment_size: 150, number_of_fragments: 1},
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
  		item.score = result._score;
  		item.title = result._source.r_title;
  		item.url = result._source.url;
  		item.byline = result._source.r_byline;
  		item.hash = result._source.hash;
  		item.date = result._source.date;
  		
  		//prepare excerpt
  		if(typeof result.highlight !== 'undefined'){
  			
  			var highlights = result.highlight;
  			var aggregate = [];
  			
  			//iterate through all highlight fields
  			for(var field in highlights){
					if(highlights.hasOwnProperty(field)){
						highlights[field].forEach(function(highlight){
							aggregate.push(highlight);
						});
					}
				}
				
				var excerpt = aggregate.join('... ');
				
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