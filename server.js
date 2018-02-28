var express = require('express'),
    routes = require('./routes'),
    socket = require('./routes/socket.js');         //For manipulating file-paths

var app = module.exports = express();
var server = require('http').createServer(app);

// Hook Socket.io into Express
var io = require('socket.io').listen(server);

// Routes
app.get('/', routes.index);

// Static files
app.use(express.static(__dirname + '/public'));

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

server.listen(80, function(){
    console.log("Express server listening on port %d in %s mode", 
                this.address().port, app.settings.env);
});