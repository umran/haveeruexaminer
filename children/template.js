In main.js:

var cp = require('child_process');
var child = cp.fork('./worker');

child.on('message', function(m) {
  // Receive results from child process
  console.log('received: ' + m);
});

// Send child process some work
child.send('Please up-case this string');
In worker.js:

process.on('message', function(m) {
  // Do work  (in this case just up-case the string
  m = m.toUpperCase();

  // Pass results back to parent process
  process.send(m.toUpperCase(m));
});
Then to run main (and spawn a child worker process for the worker.js code ...)

$ node --version
v0.8.3

$ node main.js 
received: PLEASE UP-CASE THIS STRING