var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
mongoose.connect('mongodb://localhost/dummy');

var docSchema = new mongoose.Schema({
	url: {type: String, unique: true, required: true},
  r_title: {type: String, required: false, es_indexed:true},
  r_byline: {type: String, required: false},
  r_date: {type: String, required: false},
  r_intro: {type: String, required: false, es_indexed:true},
  r_main: {type: String, required: false},
  fulltext: {type: String, required: false, es_indexed:true},
  hash: {type: String, required: true}
});

docSchema.plugin(mongoosastic);

var Doc = mongoose.model('Doc', docSchema);

Doc.createMapping({
"analysis" : {
    "analyzer":{
      "content":{
        "type":"custom",
        "tokenizer":"whitespace"
      }
    }
  }
},function(err, mapping){
	if(err){
		console.log(err);
		mongoose.disconnect();
		return;
	}
	console.log('Done');
	mongoose.disconnect();
});