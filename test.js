console.log(1);

console.log(2);

setTimeout(function(){
	console.log(3);
}, 5000);

console.log(4);

checkDB(value, function(){
	console.log('done');
});

checkDB(value, callback);

function callback(){
	console.log('done');
}