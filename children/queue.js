var queue = [];
var MAX = 20;  // only allow 20 simultaneous exec calls
var count = 0;  // holds how many execs are running
 
// our callback for each exec call
function wget_callback(err, stdout, stderr) {
  count -= 1;
   
  if (queue.length > 0 && count < MAX) {  // get next item in the queue!
    count += 1;
    var url = queue.shift();
    exec('wget '+url, wget_callback);
  }
}
 
urls.forEach( function(url) {
  if (count < MAX) {  // go get the file!
    count += 1;
    exec('wget '+url, wget_callback);
  } else {  // queue it up...
    queue.push(url);
  }
});