module.exports = function(io){

	io.on('connect', function(socket){
		socket.on('test', function(data){
			console.log(data);
		});
	});

}