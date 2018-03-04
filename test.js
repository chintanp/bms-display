var spawn = require("child_process").spawn;
var child = spawn('./model_sim');

child.stdout.setEncoding('utf8');

console.log('Execution begins');

// child.unref();
var sensordata = []; 
child.stdout.on('data', function(data) {
  sensordata = data.split(" ");
  ambientTemp = sensordata[0];
  objectTemp = sensordata[1];
 console.log("ambientTmep:" + ambientTemp);
 console.log("objectTemp:" + objectTemp);
});

//child.stderr.on('data', function(data) {
//  console.log('stderr: ' + data);
//});

//child.on('close', function(data) {
//  console.log('closing code :', data);
//});

//child.stdout.pipe(process.stdout);
