module.exports = function(io){

	io.on('connect', function(socket){
		socket.on('status', function(data){
			io.emit('message', data);
		});
	});

}