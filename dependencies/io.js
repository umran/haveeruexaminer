module.exports = function(io){

	io.on('connect', function(socket){
		socket.on('status', function(data){
			socket.broadcast.emit('status', data);
			//console.log(data);
		});
		socket.on('update', function(data){
			socket.broadcast.emit('update', data);
			//console.log(data);
		});
	});
}