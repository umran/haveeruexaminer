var events = require('events');
var eventEmitter = new events.EventEmitter();
var queue = [];
var count = 0;

function queueAdd(){
	setTimeout(function (){
		if(queue.length >= 1){
			eventEmitter.emit('next'); 
			queueAdd();
			return; 
		};
		count += 1;
		queue.push(count.toString());
		queueAdd();
	},1);
}

eventEmitter.on('next', function (){
	queue.shift();
	//print something every second
	if(count % 500 === 0){
		console.log(count.toString());
	}
});

queueAdd();