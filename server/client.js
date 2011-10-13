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
