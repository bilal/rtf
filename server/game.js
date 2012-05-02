//Screen Size variables
var X_SIZE = 780;
var Y_SIZE = 600;

var SPRITE_SIZE = 32;
var X_BLOCKS = X_SIZE/SPRITE_SIZE;
var Y_BLOCKS = Y_SIZE/SPRITE_SIZE;

//Goal related variables
var GOAL_PATCH_SIZE = 10;
var GOAL_SIZE = 128;
var GOAL_EMPTY_SPACE = 10;
var GOAL_NUM_PATCHES = (GOAL_SIZE - GOAL_EMPTY_SPACE)/GOAL_PATCH_SIZE;
var GOAL_START = (Y_SIZE - GOAL_SIZE)/2;
var GOAL_END = GOAL_START + GOAL_SIZE;

//Play Area Variables
var PLAY_AREA_X_MIN = SPRITE_SIZE;
var PLAY_AREA_X_MAX = X_SIZE - SPRITE_SIZE;
var PLAY_AREA_Y_MIN = SPRITE_SIZE;
var PLAY_AREA_Y_MAX = Y_SIZE - SPRITE_SIZE;

//Initial Positions
var INIT_BALL_POS_X = PLAY_AREA_X_MAX/2;
var INIT_BALL_POS_Y = PLAY_AREA_Y_MAX/2;

//same vertical position as the ball
var INIT_P1_POS_Y = INIT_P2_POS_Y = INIT_BALL_POS_Y;

var INIT_P1_POS_X = INIT_BALL_POS_X - 2*SPRITE_SIZE;
var INIT_P2_POS_X = INIT_BALL_POS_X + 2*SPRITE_SIZE;

var WALKSPEED = 2;
var RUNSPEED = 3;
var KICK = 35;

var P1SCORE = 0;
var P2SCORE = 0;
var WINSCORE = 5;
var player1CanShoot = false;
var player2CanShoot = false;

var player1CanShoot = false;
var player2CanShoot = false;

// if both p1 and p2 are false that means the user is a viewer
var is_p1 = false;
var is_p2 = false;


//player objects
var player1;
var player2;

var game_pause = false;

	var p1Score=0;
	var p2Score=0;

window.onload = function() {
	//start crafty
	Crafty.init(X_SIZE, Y_SIZE);
	Crafty.canvas();
	
	//turn the sprite map into usable components
	Crafty.sprite(SPRITE_SIZE, "sprite4.png", {
		grass1: [0,0],
		grass2: [1,0],
		grass3: [2,0],
		grass4: [3,0],
		player1: [0,2],
		player2: [0,1],
		goal: [0,3],
		ball: [0, 4],
		line: [1,3],
		hline: [2,3],
		topleft: [4,3],
		topright: [5,3],
		bottomleft: [6,3],
		bottomright: [7,3],
		centercircle: [3,3],
		topleftb: [0,5],
		toprightb: [1,5],
		bottomleftb: [2,5],
		bottomrightb: [3,5],
		num0: [8,3],
		num8: [9,3],
		num9: [10,3],
		numDash: [11,3],
		num1: [5,4],
		num2: [6,4],
		num3: [7,4],
		num4: [8,4],
		num5: [9,4],
		num6: [10,4],
		num7: [11,4]
	});
	
	
	//method to randomy generate the map
	function generateWorld() {
	var temp = 1;
	var temp2=1;
		//generate the grass along the x-axis
		for(var i = 0; i < X_BLOCKS; i++) {
		temp++;
			//generate the grass along the y-axis
			for(var j = 0; j < Y_BLOCKS; j++) {
				
				grassType = Crafty.randRange(1, 2);
				grassType2 = Crafty.randRange(3,4);
				if (temp < 6)
				Crafty.e("2D, Canvas, grass"+grassType)
				.attr({x: i * SPRITE_SIZE, y: j * SPRITE_SIZE});
				else Crafty.e("2D, Canvas, grass"+grassType2)
					.attr({x: i * SPRITE_SIZE, y: j * SPRITE_SIZE});
					
					
					if (temp > 10) temp =1;
				
			}
		}
		//cornor flags
		Crafty.e("2D, Canvas, topleft, topleft")
		.attr({x:0, y:0,z:2});
		Crafty.e("2D, Canvas, topright, topright")
		.attr({x: (X_SIZE - SPRITE_SIZE), y:0,z:2});
		Crafty.e("2D, Canvas, bottomleft, bottomleft")
		.attr({x: 0, y:PLAY_AREA_Y_MAX, z:2});
		Crafty.e("2D, Canvas, bottomright, bottomright")
		.attr({x: (X_SIZE - SPRITE_SIZE), y:PLAY_AREA_Y_MAX, z:2});
		
		//create the bushes along the x-axis which will form the boundaries
		for(var i = 1; i < X_BLOCKS - 1; i++) {
			Crafty.e("2D, Canvas, wall_top, hline")
				.attr({x: i * SPRITE_SIZE, y: 0, z: 2});
			Crafty.e("2D, DOM, wall_bottom, hline")
				.attr({x: i * SPRITE_SIZE, y: PLAY_AREA_Y_MAX, z: 2});
		}
		
	
		//generate center line
		Crafty.e("2D, Canvas, top, topleftb")
		.attr({x:PLAY_AREA_X_MAX/2, y:0});
		Crafty.e("2D, Canvas, top, bottomleftb")
		.attr({x:PLAY_AREA_X_MAX/2, y:Y_SIZE-SPRITE_SIZE});
		
		for(var i = 1; i < Y_BLOCKS -1 ; i++) {
			Crafty.e("2D, Canvas, centerline, line")
				.attr({x: PLAY_AREA_X_MAX/2, y: i *SPRITE_SIZE});
		}
		//generate center circle
		Crafty.e("2D, Canvas, centercircle, centercircle")
			.attr({x: PLAY_AREA_X_MAX/2, y: PLAY_AREA_Y_MAX/2, z:1});

		//create the bushes along the y-axis
		//we need to start one more and one less to not overlap the previous bushes
		for(var i = 1; i < Y_BLOCKS - 1; i++) {
		
			//skip goals
			if((i*SPRITE_SIZE) >= GOAL_START && (i*SPRITE_SIZE) <= GOAL_END) continue;
			
			Crafty.e("2D, DOM, wall_left, line")
				.attr({x: 0, y: i * SPRITE_SIZE, z: 2});
			Crafty.e("2D, Canvas, wall_right, line")
				.attr({x: PLAY_AREA_X_MAX, y: i * SPRITE_SIZE, z: 2});
		}
		
		//left box
		Crafty.e("2D, Canvas, topleftb, topleftb")
		.attr({x: 0, y:GOAL_SIZE});
		Crafty.e("2D, Canvas, toprightb, toprightb")
		.attr({x:GOAL_SIZE + SPRITE_SIZE -1, y: GOAL_SIZE});
		Crafty.e("2D, Canvas, bottomrightb, bottomrightb")
		.attr({x:GOAL_SIZE + SPRITE_SIZE -1, y: (PLAY_AREA_Y_MAX - GOAL_SIZE + SPRITE_SIZE)});
		Crafty.e("2D, Canvas, bottomleftb, bottomleftb")
		.attr({x: 0, y:(PLAY_AREA_Y_MAX - GOAL_SIZE + SPRITE_SIZE)});
				
		for(var i = 1; i<GOAL_SIZE/SPRITE_SIZE+1; i++){
		Crafty.e("2D, Canvas, top_box, hline")
		.attr({x: i*SPRITE_SIZE, y: GOAL_SIZE});
		Crafty.e("2D, Canvas, bottom_box, hline")
		.attr({x: i*SPRITE_SIZE, y: (PLAY_AREA_Y_MAX - GOAL_SIZE + SPRITE_SIZE)});
		}
		for(var i = ((GOAL_SIZE/SPRITE_SIZE)+1); i < (PLAY_AREA_Y_MAX - GOAL_SIZE + SPRITE_SIZE)/SPRITE_SIZE; i++){
		Crafty.e ("2D, Canvas, rightbox, line")
		.attr({x: GOAL_SIZE+SPRITE_SIZE, y: i*SPRITE_SIZE});
		}
		
		
		//right box
		Crafty.e("2D, Canvas, toprightb, toprightb")
		.attr({x: PLAY_AREA_X_MAX, y:GOAL_SIZE});
		Crafty.e("2D, Canvas, topleftb, topleftb")
		.attr({x: PLAY_AREA_X_MAX-(GOAL_SIZE + SPRITE_SIZE +1), y: GOAL_SIZE});
		Crafty.e("2D, Canvas, bottomleftb, bottomleftb")
		.attr({x:PLAY_AREA_X_MAX - (GOAL_SIZE + SPRITE_SIZE +1), y: (PLAY_AREA_Y_MAX - GOAL_SIZE + SPRITE_SIZE)});
		Crafty.e("2D, Canvas, bottomrightb, bottomrightb")
		.attr({x: PLAY_AREA_X_MAX, y:(PLAY_AREA_Y_MAX - GOAL_SIZE + SPRITE_SIZE)});
				
		for(var i = 1; i<GOAL_SIZE/SPRITE_SIZE+1; i++){
		Crafty.e("2D, Canvas, top_box, hline")
		.attr({x: PLAY_AREA_X_MAX- (i*SPRITE_SIZE), y: GOAL_SIZE});
		Crafty.e("2D, Canvas, bottom_box, hline")
		.attr({x: PLAY_AREA_X_MAX- (i*SPRITE_SIZE), y: (PLAY_AREA_Y_MAX - GOAL_SIZE + SPRITE_SIZE)});
		}
		for(var i = ((GOAL_SIZE/SPRITE_SIZE)+1); i < (PLAY_AREA_Y_MAX - GOAL_SIZE + SPRITE_SIZE)/SPRITE_SIZE; i++){
		Crafty.e ("2D, Canvas, rightbox, line")
		.attr({x: PLAY_AREA_X_MAX- (GOAL_SIZE)-SPRITE_SIZE, y: i*SPRITE_SIZE});
		}
		
		//score board
		Crafty.e("2D, DOM, Image").image("score.png").attr({x:(PLAY_AREA_X_MAX/2)-64, y:0});
		Crafty.e("2D, DOM, numDash").attr({x:(PLAY_AREA_X_MAX/2), y:0});
		
		Crafty.e("2D, DOM, num0").attr({x:(PLAY_AREA_X_MAX/2)+32,y:0});
		Crafty.e("2D, DOM, num0").attr({x:(PLAY_AREA_X_MAX/2)-32,y:0});

		
		//create the goals
		for(var i = 0; i<GOAL_NUM_PATCHES; i++) {
		
		Crafty.e("2D, Canvas, goal_left, goal")
			.attr({x: 0, y: (GOAL_START + (GOAL_EMPTY_SPACE/2) + (i*GOAL_PATCH_SIZE))});
		
		Crafty.e("2D, Canvas, goal_right, goal")
			.attr({x: PLAY_AREA_X_MAX, y: (GOAL_START + (GOAL_EMPTY_SPACE/2) + (i*GOAL_PATCH_SIZE))});	
		}
		

		
	}
	
	//the loading screen that will display while our assets load
	Crafty.scene("loading", function() {
		//load takes an array of assets and a callback when complete
		Crafty.load(["sprite4.png", "score.png"], function() {
			Crafty.scene("main"); //when everything is loaded, run the main scene
		});
		
		//black background with some loading text
		Crafty.background("#000");
		Crafty.e("2D, DOM, Text").attr({w: 100, h: 20, x: 150, y: 120})
			.text("Loading")
			.css({"text-align": "center"});
	});
	
	//automatically play the loading scene
	Crafty.scene("loading");

	//register for game events
	register_game_events();
	
	//register for game move events
	register_move_events();

	Crafty.scene("main", function() {
		generateWorld();
		logger("Game Initialization Complete");

		
		
		Crafty.c('CustomControls1', {
			__move: {left: false, right: false, up: false, down: false},	
			_speed: 3,

			CustomControls: function(speed) {
				player1 = this;
				if(speed) this._speed = speed;
				var move = this.__move;
				
				return this;
			}
		});
		
				Crafty.c('CustomControls2', {
			__move: {left: false, right: false, up: false, down: false},	
			_speed: 3,
			
			CustomControls: function(speed) {
				player2 = this;
				if(speed) this._speed = speed;
				var move = this.__move;

				return this;
			}
		});
		
		//ball
		ball = Crafty.e("2D, Canvas, ball, Controls3, CustomControls3, Animate, Collision")
			.attr({x: INIT_BALL_POS_X, y: INIT_BALL_POS_Y, z: 1})
			.animate("ball_1", 1, 4, 3)
		.collision()
			.onHit("wall_left", function() {
				logger("out of bounds");
				checkoutofbounds();
			}).onHit("goal_left", function() {
				P2SCORE++;
				webSocket.emit('game_score', {score_p1:P1SCORE, score_p2:P2SCORE});
				checkgoalscored();
				if (P2SCORE > WINSCORE) gameend("Player2");
			}).onHit("goal_right", function() {
				P1SCORE++;
				webSocket.emit('game_score', {score_p1:P1SCORE, score_p2:P2SCORE});
				checkgoalscored();
				if (P1SCORE > WINSCORE) gameend("Player1");
			}).onHit("wall_right", function() {
				logger("out of bounds");
				checkoutofbounds();
			}).onHit("wall_bottom", function() {
				logger("out of bounds");
				checkoutofbounds();
			}).onHit("wall_top", function() {
				logger("out of bounds");
				checkoutofbounds();
			});
		
		//create our player entity with some premade components
		player1 = Crafty.e("2D, Canvas, player1, Controls, CustomControls1, Animate, Collision")
			.attr({x: INIT_P1_POS_X, y: INIT_P1_POS_Y, z: 1})
			.CustomControls(1)
			.animate("walk_left", 6, 2, 8)
			.animate("walk_right", 9, 2, 11)
			.animate("walk_up", 3, 2, 5)
			.animate("walk_down", 0, 2, 2)
			.bind("keyup", function(e) {
				this.stop();
			})
			.collision()
			.onHit("wall_left", function() {
				this.x += this._speed;
				this.stop();				
			}).onHit("goal_left", function() {
				this.x += this._speed*2;
				this.stop();
			}).onHit("goal_right", function() {
				this.x -= this._speed*2;
				this.stop();
			}).onHit("wall_right", function() {
				this.x -= this._speed;
				this.stop();
			}).onHit("wall_bottom", function() {
				this.y -= this._speed;
				this.stop();
			}).onHit("wall_top", function() {
				this.y += this._speed;
				this.stop();
			})
			.collision(new Crafty.polygon([ball.x,ball.y], [16, 16]))
			.onHit("ball", function() {
				player1CanShoot = true;

				if(this.isPlaying("walk_left")){
					webSocket.emit('game_move',{player:"1", direction:"left", move:"BALL", speed:this._speed});
				}
				else if(this.isPlaying("walk_right")){
					webSocket.emit('game_move',{player:"1", direction:"right", move:"BALL", speed:this._speed});
				}
				else if(this.isPlaying("walk_up")){
					webSocket.emit('game_move',{player:"1", direction:"up", move:"BALL", speed:this._speed});
				}
				else if(this.isPlaying("walk_down")){
					webSocket.emit('game_move',{player:"1", direction:"down", move:"BALL", speed:this._speed});
				}
				this.stop();
			});

			
			
					//create our player entity with some premade components
		player2 = Crafty.e("2D, Canvas, player2, Controls, CustomControls2, Animate, Collision")
			.attr({x: INIT_P2_POS_X, y: INIT_P2_POS_Y, z: 1})
			.CustomControls(1)
			.animate("walk_left", 6, 1, 8)
			.animate("walk_right", 9, 1, 11)
			.animate("walk_up", 3, 1, 5)
			.animate("walk_down", 0, 1, 2)
			.bind("keyup", function(e) {
				this.stop();
			})
			.collision()
			.onHit("wall_left", function() {
				this.x += this._speed;
				this.stop();
			}).onHit("goal_left", function() {
				this.x += this._speed*2;
				this.stop();
			}).onHit("goal_right", function() {
				this.x -= this._speed*2;
				this.stop();
			}).onHit("wall_right", function() {
				this.x -= this._speed;
				this.stop();
			}).onHit("wall_bottom", function() {
				this.y -= this._speed;
				this.stop();
			}).onHit("wall_top", function() {
				this.y += this._speed;
				this.stop();
			})
			.collision(new Crafty.polygon([ball.x,ball.y], [16, 16]))
			.onHit("ball", function() {
				player2CanShoot = true;

				if(this.isPlaying("walk_left")){
					webSocket.emit('game_move',{player:"2", direction:"left", move:"BALL", speed:this._speed});
				}
				else if(this.isPlaying("walk_right")){
					webSocket.emit('game_move',{player:"2", direction:"right", move:"BALL", speed:this._speed});
				}
				else if(this.isPlaying("walk_up")){
					webSocket.emit('game_move',{player:"2", direction:"up", move:"BALL", speed:this._speed});
				}
				else if(this.isPlaying("walk_down")){
					webSocket.emit('game_move',{player:"2", direction:"down", move:"BALL", speed:this._speed});
				}
				this.stop();
			});
			
	});

};



function resume_game(){

	position_reset();
	game_pause = false;
}


function update_score(score1, score2){

	
	P1SCORE = score1;
	P2SCORE = score2;
	game_pause = true;
	position_reset();

	Crafty.e("2D, DOM, Image").image("score.png").attr({x:(PLAY_AREA_X_MAX/2)-64, y:0});
	Crafty.e("2D, DOM, numDash").attr({x:(PLAY_AREA_X_MAX/2), y:0});
		
	Crafty.e("2D, DOM, num"+P2SCORE).attr({x:(PLAY_AREA_X_MAX/2)+32,y:0});
	Crafty.e("2D, DOM, num"+P1SCORE).attr({x:(PLAY_AREA_X_MAX/2)-32,y:0});

	
}

function position_reset()
{
	player1.attr({x: INIT_P1_POS_X, y: INIT_P1_POS_Y, z: 1});
	player2.attr({x: INIT_P2_POS_X, y: INIT_P2_POS_Y, z: 1});
	ball.attr({x: INIT_BALL_POS_X, y: INIT_BALL_POS_Y, z: 1});

}


function reset_game()
{
	position_reset();
	P1SCORE = P2SCORE = 0;
	logger("Score:" + P1SCORE + " - " + P2SCORE);

}


function set_player_1_controls(crafty_obj){

	crafty_obj.bind('enterframe', function() {
		//move the player in a direction depending on the booleans
		//only move the player in one direction at a time (up/down/left/right)
		if(crafty_obj.isDown("RIGHT_ARROW")){
						
			webSocket.emit('game_move',{player:"1", move:"RIGHT_ARROW", space:crafty_obj.isDown("SPACE"), shift:crafty_obj.isDown("SHIFT"), canShoot:player1CanShoot});
		}						
		else if(crafty_obj.isDown("LEFT_ARROW")){ 

			webSocket.emit('game_move',{player:"1", move:"LEFT_ARROW", space:crafty_obj.isDown("SPACE"), shift:crafty_obj.isDown("SHIFT"), canShoot:player1CanShoot});
		}
		else if(crafty_obj.isDown("UP_ARROW")){
			
			webSocket.emit('game_move',{player:"1", move:"UP_ARROW", space:crafty_obj.isDown("SPACE"), shift:crafty_obj.isDown("SHIFT"), canShoot:player1CanShoot});
		}	
		else if(crafty_obj.isDown("DOWN_ARROW")){

			webSocket.emit('game_move',{player:"1", move:"DOWN_ARROW", space:crafty_obj.isDown("SPACE"), shift:crafty_obj.isDown("SHIFT"), canShoot:player1CanShoot});
		}
					
	});

}


function set_player_2_controls(crafty_obj){
	crafty_obj.bind('enterframe', function() {
		//move the player in a direction depending on the booleans
		//only move the player in one direction at a time (up/down/left/right)

		if(crafty_obj.isDown("RIGHT_ARROW")){
	
			webSocket.emit('game_move',{player:"2", move:"RIGHT_ARROW", space:crafty_obj.isDown("SPACE"), shift:crafty_obj.isDown("SHIFT"), canShoot:player2CanShoot});
		}						
		else if(crafty_obj.isDown("LEFT_ARROW")){

			webSocket.emit('game_move',{player:"2", move:"LEFT_ARROW", space:crafty_obj.isDown("SPACE"), shift:crafty_obj.isDown("SHIFT"), canShoot:player2CanShoot});
		}
		else if(crafty_obj.isDown("UP_ARROW")){

			webSocket.emit('game_move',{player:"2", move:"UP_ARROW", space:crafty_obj.isDown("SPACE"), shift:crafty_obj.isDown("SHIFT"), canShoot:player2CanShoot});
		}
		else if(crafty_obj.isDown("DOWN_ARROW")){

			webSocket.emit('game_move',{player:"2", move:"DOWN_ARROW", space:crafty_obj.isDown("SPACE"), shift:crafty_obj.isDown("SHIFT"), canShoot:player2CanShoot});
		 }
		 
	});
}


function right_logic(crafty_obj, msg){

		if(!crafty_obj.isPlaying("walk_right"))
				crafty_obj.stop().animate("walk_right", 10);
				
		if(msg.space && msg.canShoot) {shootball("RIGHT");}
	
		if(msg.shift)crafty_obj._speed = RUNSPEED;
		else crafty_obj._speed = WALKSPEED;						
		crafty_obj.x += crafty_obj._speed;
}

function left_logic(crafty_obj, msg){

		if(!crafty_obj.isPlaying("walk_left"))
				crafty_obj.stop().animate("walk_left", 10);
				
		if(msg.space && msg.canShoot) {shootball("LEFT");}
		
		if(msg.shift)crafty_obj._speed = RUNSPEED;
		else crafty_obj._speed = WALKSPEED;						
		
		crafty_obj.x -= crafty_obj._speed;

}

function up_logic(crafty_obj, msg){

		if(!crafty_obj.isPlaying("walk_up"))
				crafty_obj.stop().animate("walk_up", 10);
		if(msg.space && msg.canShoot) {shootball("UP");}
	
		if(msg.shift)crafty_obj._speed = RUNSPEED;
		else crafty_obj._speed = WALKSPEED;						
		crafty_obj.y -= crafty_obj._speed;
}


function down_logic(crafty_obj, msg){

		if(!crafty_obj.isPlaying("walk_down"))
			crafty_obj.stop().animate("walk_down", 10);
			
		if(msg.space && msg.canShoot) {shootball("DOWN");}
	
		if(msg.shift)crafty_obj._speed = RUNSPEED;
		else crafty_obj._speed = WALKSPEED;						
		crafty_obj.y += crafty_obj._speed;
}

function ball_logic(crafty_obj, msg){
		
		ball.animate("ball_1", 2);

		if(msg.direction == "left") {
			ball.x -= msg.speed * 2;	
		}
		else if(msg.direction == "right") {
			ball.x += msg.speed * 2;	
		}		
		else if(msg.direction == "up") {
			ball.y -= msg.speed * 2;	
		}
		else if(msg.direction == "down") {
			ball.y += msg.speed * 2;	
		}
}


function shootball(direction){
if (direction == "LEFT") ball.x -= KICK;
else if (direction == "RIGHT") ball.x += KICK;
else if (direction == "UP") ball.y -= KICK;
else if (direction == "DOWN") ball.y += KICK;

if(ball.x > X_SIZE) ball.x = X_SIZE-1;
if(ball.x < 0) ball.x = 1;
if(ball.y > Y_SIZE) ball.y = Y_SIZE-1;
if(ball.y < 0) ball.y = 1;

player1CanShoot=false;
player2CanShoot=false;


}
function checkgoalscored(){
player1.attr({x: INIT_P1_POS_X, y: INIT_P1_POS_Y, z: 1});
player2.attr({x: INIT_P2_POS_X, y: INIT_P2_POS_Y, z: 1});
ball.attr({x: INIT_BALL_POS_X, y: INIT_BALL_POS_Y, z: 1});
logger("Score:" + P1SCORE + " - " + P2SCORE);

}
function checkoutofbounds(){
player1.attr({x: INIT_P1_POS_X, y: INIT_P1_POS_Y, z: 1});
player2.attr({x: INIT_P2_POS_X, y: INIT_P2_POS_Y, z: 1});
ball.attr({x: INIT_BALL_POS_X, y: INIT_BALL_POS_Y, z: 1});
}
function gameend(player){
logger(player + " Wins!!!");
}
//helper functions
function logger(msg){
	$("#body").append(msg);
	$("#body").append("<br>");
}

