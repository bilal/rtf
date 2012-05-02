var webSocket;

$(document).ready(function() {
                webSocket = new io.connect('ws://localhost', { port: 2000 });

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
                    alert("Other player has disconnected, Please Refresh to start a new game.");
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


	webSocket.on('game_resume', function(msg){
		logger(msg);
		resume_game();
		
	});

	webSocket.on('game_score', function(msg){
		update_score(msg.score_p1, msg.score_p2);
	});

	webSocket.on('game_reset', function(msg){
		logger(msg);
		reset_game();
	});


	webSocket.on('game_waiting', function(msg){
		logger(msg);
	});


	webSocket.on('game_ready', function(msg){
		logger(msg);
	});


	webSocket.on('game_start', function(msg){
		logger(msg);
		reset_game();
		// start game register for events
		
	});


	webSocket.on('game_end', function(msg){
		logger(msg);
		// game end -- disconnect if I am a player
		webSocket.disconnect();
	});

	webSocket.on('game_player', function(msg){
		//logger(msg);
		if (msg == '1'){
			is_p1 = true;
			is_p2 = false;
			logger('players updated: you are player 1');
			set_player_1_controls(player1);
		}
		else if (msg == '2'){
			is_p1 = false;
			is_p2 = true;
			logger('players updated: you are player 2');
			set_player_2_controls(player2);
		}

		
	});

}


function register_move_events(){	

	
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
		
	logger("<b>Movement</b>: UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, <b>Sprint</b>: SHIFT,  <b>Shoot</b>: SPACE")
    logger("registered for game move events");

}

