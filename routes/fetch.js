express = require('express');
var router = express.Router();
var Doc = require('../models/doc.js');
var sanitize = require('mongo-sanitize');
var Utilities = require('../dependencies/utilities.js');
var utilities = new Utilities();

router.get('/:hash', function(req, response, next) {

	Doc.findOne({hash:sanitize(req.params.hash)}, {url:1, hash:1, r_title:1, r_intro:1, r_byline:1, r_main:1, date:1, _id:1}).exec(function(err, res){
		if(err){
			response.setHeader('Content-Type', 'application/json');
			response.send(JSON.stringify({
				code: 0,
				response: err
			}));
			return;
		}
		
		//parse response
		var pretty = {};
		pretty.id = res._id;
		pretty.date = Date.parse(res.date);
		pretty.hash = res.hash;
		pretty.timestamp = Date.parse(res._id.getTimestamp());
		pretty.url = res.url;
		pretty.byline = res.r_byline;
		pretty.title = res.r_title;
		pretty.intro = res.r_intro;
		pretty.main = utilities.cutTrailing(utilities.strip_tags(utilities.decode(res.r_main), '<br>'));
		
		//determine language
		pretty.lang = utilities.getLang(res.r_title);
		
		response.setHeader('Content-Type', 'application/json');
		response.send(JSON.stringify({
			code: 1,
			response: pretty
		}));
	});
});

module.exports = router;