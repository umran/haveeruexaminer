var Entities = require('html-entities').XmlEntities;
entities = new Entities();
var re = new RegExp("[\u0780-\u07BF]");

module.exports = function(){
	this.decode = function(input){
		return entities.decode(input);
	}
	this.strip_tags = function(input, allowed) {
		allowed = (((allowed || '') + '')
			.toLowerCase()
			.match(/<[a-z][a-z0-9]*>/g) || [])
			.join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
		var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
			commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
		return input.replace(commentsAndPhpTags, '')
			.replace(tags, function($0, $1) {
				return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
			});
	}
	this.cutTrailing = function(input){
		return input.replace(/(<\/?br\s*\/?>){2,}/gi, '<br>');
	}
	this.getLang = function(input){
		if(re.test(input) === true){
			return 'thaana';
		}
		return 'latin';
	}
}