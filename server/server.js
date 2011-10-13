var http = require('http');
var static = require('node-static');
var socketIO = require('socket.io');


//game state constants
var WAITING_FOR_PLAYER = 0;
var READY_FOR_START = 1;
var STARTED = 2;
var FINISHED = 3;

//we are dealing with a single game right now
var game = null;
var game_state = FINISHED;


var users = new Array();




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
    socket.emit('game_name','Please enter a user name ...');
    socket.broadcast.emit('message','a new user connected');



    socket.on('game_name', function(message) {
	console.log("message: " + message);
	socket.set('player_name', message);
	socket.broadcast.emit('message', message + ' has joined the game.');
	users.push(socket);
	update_game_state(socket);

    });

	
    socket.on('game_move', function(message) {
	//console.log("message: " + JSON.stringify(message));
	socket.broadcast.emit("game_move", message);
	socket.emit("game_move",message);


   });

    socket.on('message', function(message) {
	console.log("message: " + message);
        var broadcastMessage = userName + ': ' + message;
        socket.broadcast.emit('message',broadcastMessage);
    });

    socket.on('disconnect', function() {
        var broadcastMessage = userName + ' has left the zone.';
        socket.broadcast.emit('message',broadcastMessage);
	update_game_state(socket);
    });
});


function update_game_state(socket)
{
	if (game_state == FINISHED){
		//start a new game and notify players to reset their state
		if (users.length == 1){
			send_message_to_all(socket, 'game_reset', 'First player, started a new game ....');
			game_state = WAITING_FOR_PLAYER;
			send_message_to_all(socket, 'game_waiting', 'Waiting for another player to start ....');
			
		}

	}else if (game_state == WAITING_FOR_PLAYER){

		// new player arrived
		if (users.length == 2){
			game_state = READY_FOR_START;
			send_message_to_all(socket, 'game_ready', 'Ready to start the game ....');
			game_state = STARTED;
			send_message_to_all(socket, 'game_start', 'Start the game ....');
		}
	}else if (game_state == STARTED){


		// new player arrives -- make him a viewer
		if (users.length > 2){
			socket.emit('game_view', 'Game already underway .....');
		}


		// if one player disconnects -- move away
		if (users.length < 2){
			game_state = FINISHED;
			socekt.emit('game_end', 'Player left game end ....');
		}
	} 

}



function send_message_to_all(socket, msg_name, msg){
	
	socket.broadcast.emit(msg_name, msg);
	socket.emit(msg_name, msg);
}


