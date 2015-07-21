module.exports = function(io){

	io.on('connect', function(socket){
		socket.on('test', function(data){
			io.emit('message', data);
		});
		socket.on('disconnect', function () { 
			console.log('socket disconnected');
		});
	});

}