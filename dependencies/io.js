var Doc = require('../models/doc.js');

module.exports = function(io){
	io.on('connect', function(socket){
		socket.on('status', function(data){
			socket.broadcast.emit('status', data);
			//console.log(data);
		});
		socket.on('update', function(data){
			Doc.find({hash: "'"+data+"'"}, {_id:1, url:1, r_title:1}).sort({$natural:-1}).limit(1).exec(function(err, res){
				if(err){
					console.error(err);
					return;
				}
				
				res.forEach(function(record){
					//parse results
					var item = {};
					item.title = record.r_title;
					item.url = record.url;
					item.hash = record.hash;
					item.timestamp = Date.parse(record._id.getTimestamp());
					
					socket.broadcast.emit('update', JSON.stringify({
						code: 1,
						response: item
					}));
				});
			});
		});
	});
}