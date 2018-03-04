var express = require('express'),
    routes = require('./routes'),
    socket = require('./routes/socket.js'), 
    path = require('path'),         //For manipulating file-paths
    spawn = require('child_process').spawn;


var child = spawn('./model_sim');
child.stdout.setEncoding('utf8');

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

var objectTemp = 0;
var ambientTemp = 0;
var childdata = [];
// TODO: Error handling for socket.io
io.on('connect', function(http_socket) {
    console.log("Socket connected");
    // Emits battery stats every UPDATE_RATE seconds
    setInterval(function() {
      //objectTemp++;
      //ambientTemp = ambientTemp + 2;
      console.log('Sending sensor data');
      child.stdout.on('data', function(data) {
         childdata = data.split(" ");
      });
      http_socket.emit('sensor:data', {
         id: 'sensortag-mock1',
         type: 'sensortag',
         sensor: 'irTemperature',
         data: {
            predictedVoltage : childdata[0],
            measuredVoltage : childdata[1],
            current : childdata[2],
			exectime: childdata[3]
         } 
      });
   }, 1000);
});

server.listen(80, function(){
    console.log("Express server listening on port %d in %s mode", 
                this.address().port, app.settings.env);
});
