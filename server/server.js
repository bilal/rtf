var http = require('http');
var static = require('node-static');
var socketIO = require('socket.io');

var clientFiles = new (static.Server)('.');

var httpServer = http.createServer(function(request, response) {
    request.addListener('end', function () {
        clientFiles.serve(request, response);
    });
});
httpServer.listen(2000);

console.log("Server listening on port 2000 ... ")

var io = socketIO.listen(httpServer);
io.sockets.on('connection', function(socket) {

    console.log('new connection from client');
    socket.send('Please enter a user name ...');
    socket.broadcast.emit('message','a new user connected');


    var userName;
    socket.on('message', function(message) {
	console.log("message: " + message);
        if(!userName) {
            userName = message;
            socket.broadcast.emit('message',message + ' has entered the zone.');
            return;
        }

        var broadcastMessage = userName + ': ' + message;
        socket.broadcast.emit('message',broadcastMessage);
    });

    socket.on('disconnect', function() {
        var broadcastMessage = userName + ' has left the zone.';
        socket.broadcast.emit('message',broadcastMessage);
    });
});
