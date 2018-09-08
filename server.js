var express = require('express'),
		routes = require('./routes'),
		socket = require('./routes/socket.js'),
		path = require('path'), //For manipulating file-paths
		spawn = require('child_process').spawn;

var SerialPort = require('serialport');
var createInterface = require('readline').createInterface;

var port = new SerialPort("COM4");
// Getting data line by line as shown here: https://stackoverflow.com/questions/42730976/read-node-serialport-stream-line-by-line 
var lineReader = createInterface({
  input: port
});

var SIMULATION_TIME = 1.0;
// var child = spawn('./model_sim');
//child.stdout.setEncoding('utf8');

var app = module.exports = express();
var server = require('http').createServer(app);

// Hook Socket.io into Express
var io = require('socket.io').listen(server);

// Routes
app.get('/', routes.index);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

var childdata = [];

// child.stdout.on('data', function (data) {
// 	childdata = data.split(" ");
// });


/* port.on('data', function (data) {
	console.log('Data:', data.toString());
	childdata = data.toString().split("\t");
  }); */
  
lineReader.on('line', function (line) {
  console.log(line);
  childdata = line.toString().split("\t");
  
});

// TODO: Error handling for socket.io
io.on('connect', function (http_socket) {
	console.log("Socket connected");
	// Emits battery stats every UPDATE_RATE seconds
	setInterval(function () {
		//objectTemp++;
		//ambientTemp = ambientTemp + 2;
		console.log('Sending sensor data: ' + childdata);

		http_socket.emit('sensor:data', {
			data: {
				predictedVoltage: childdata[0],
				measuredVoltage: childdata[1],
				current: childdata[2],
				exectime: childdata[3]
			}
		});
	}, SIMULATION_TIME * 1000);
});

server.listen(3000, function () {
	console.log("Express server listening on port %d in %s mode",
			this.address().port, app.settings.env);
});
