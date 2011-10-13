var webSocket;

$(document).ready(function() {
                webSocket = new io.connect('http://localhost', { port: 2000 });

                webSocket.on('connect', function() {
                   logger("Connected to the server");
                });

		webSocket.on('game_name', function(message) {
			var name=prompt("Please enter your name","");
			while(name == null || name==""){
				name=prompt("Please enter your name","");
			}
			webSocket.emit('game_name', name);
			logger("Your name is " + name);
		});

                webSocket.on('message', function(message) {
                    logger(message);
                });

                webSocket.on('disconnect', function() {
                    logger('Disconnected from the server');
                });

		/*
                $('#sendButton').bind('click', function() {
                    var message = $('#messageText').val();
                    webSocket.emit('message',message);
                    $('#messageText').val('');
                });
		*/
            });


function register_game_events(){	

	
	webSocket.on('game_move', function(msg){
			//logger('game move: ' + JSON.stringify(msg));
			var pl;

			if (msg.player == "1"){
				pl = player1;
			}else if (msg.player == "2"){
				pl = player2;
			}


			if (msg.move == "RIGHT_ARROW"){
				right_logic(pl, msg);
			}else if (msg.move == "LEFT_ARROW"){
				left_logic(pl, msg);
			}else if (msg.move == "UP_ARROW"){		
				up_logic(pl, msg);
			}else if (msg.move == "DOWN_ARROW"){
				down_logic(pl, msg);
			}
			else if(msg.move == "BALL"){
				ball_logic(pl, msg);
			}
		});
		
	logger("registered for game move events");

}

