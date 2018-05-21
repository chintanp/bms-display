var SerialPort = require('serialport');
var createInterface = require('readline').createInterface;

var port = new SerialPort('COM4');

var lineReader = createInterface({
  input: port
});

lineReader.on('line', function (line) {
  console.log(line);
});

port.write('ROBOT PLEASE RESPOND\n');