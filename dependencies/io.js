module.exports = function(io){

	io.on('connect', function(socket){
		socket.on('status', function(data){
			socket.to('clients').emit('status', data);
			//console.log(data);
		});
		socket.on('update', function(data){
			socket.to('clients').emit('update', data);
			//console.log(data);
		});
	});
}