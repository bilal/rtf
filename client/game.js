
//Screen Size variables
var X_SIZE = 800;
var Y_SIZE = 640;

var SPRITE_SIZE = 16;
var X_BLOCKS = X_SIZE/SPRITE_SIZE;
var Y_BLOCKS = Y_SIZE/SPRITE_SIZE;

//Goal related variables
var GOAL_PATCH_SIZE = 10;
var GOAL_SIZE = 60;
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

window.onload = function() {
	//start crafty
	Crafty.init(X_SIZE, Y_SIZE);
	Crafty.canvas();
	
	//turn the sprite map into usable components
	Crafty.sprite(SPRITE_SIZE, "sprite2.png", {
		grass1: [0,0],
		grass2: [1,0],
		grass3: [2,0],
		grass4: [3,0],
		bush1: [0,2],
		bush2: [1,2],
		player1: [0,3],
		player2: [0,1],
		goal: [0,4],
		ball: [0, 5]
	});
	
	//method to randomy generate the map
	function generateWorld() {
		//generate the grass along the x-axis
		for(var i = 0; i < X_BLOCKS; i++) {
			//generate the grass along the y-axis
			for(var j = 0; j < Y_BLOCKS; j++) {
				grassType = Crafty.randRange(1, 4);
				Crafty.e("2D, Canvas, grass"+grassType)
					.attr({x: i * SPRITE_SIZE, y: j * SPRITE_SIZE});
				
			}
		}
		
		//create the bushes along the x-axis which will form the boundaries
		for(var i = 0; i < X_BLOCKS; i++) {
			Crafty.e("2D, Canvas, wall_top, bush"+Crafty.randRange(1,2))
				.attr({x: i * SPRITE_SIZE, y: 0, z: 2});
			Crafty.e("2D, DOM, wall_bottom, bush"+Crafty.randRange(1,2))
				.attr({x: i * SPRITE_SIZE, y: PLAY_AREA_Y_MAX, z: 2});
		}
		

		//create the bushes along the y-axis
		//we need to start one more and one less to not overlap the previous bushes
		for(var i = 1; i < Y_BLOCKS - 1; i++) {
		
			//skip goals
			if((i*SPRITE_SIZE) >= GOAL_START && (i*SPRITE_SIZE) <= GOAL_END) continue;
			
			Crafty.e("2D, DOM, wall_left, bush"+Crafty.randRange(1,2))
				.attr({x: 0, y: i * SPRITE_SIZE, z: 2});
			Crafty.e("2D, Canvas, wall_right, bush"+Crafty.randRange(1,2))
				.attr({x: PLAY_AREA_X_MAX, y: i * SPRITE_SIZE, z: 2});
		}
		
		//create the goals
		for(var i = 0; i<GOAL_NUM_PATCHES; i++) {
		
		Crafty.e("2D, Canvas, goal_left, goal")
			.attr({x: 0, y: (GOAL_START + (GOAL_EMPTY_SPACE/2) + (i*GOAL_PATCH_SIZE)), z: 2});
		
		Crafty.e("2D, Canvas, goal_right, goal")
			.attr({x: PLAY_AREA_X_MAX, y: (GOAL_START + (GOAL_EMPTY_SPACE/2) + (i*GOAL_PATCH_SIZE)), z: 2});	
		}
		

		
	}
	
	//the loading screen that will display while our assets load
	Crafty.scene("loading", function() {
		//load takes an array of assets and a callback when complete
		Crafty.load(["sprite2.png"], function() {
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
	
	Crafty.scene("main", function() {
		generateWorld();
		logger("Game Initialization Complete");
		
		Crafty.c('CustomControls1', {
			__move: {left: false, right: false, up: false, down: false},	
			_speed: 3,
			
			CustomControls: function(speed) {
				if(speed) this._speed = speed;
				var move = this.__move;
				
				this.bind('enterframe', function() {
					//move the player in a direction depending on the booleans
					//only move the player in one direction at a time (up/down/left/right)
					if(this.isDown("RIGHT_ARROW")){
						if(this.isDown("SHIFT"))this._speed = RUNSPEED;
						else this._speed = WALKSPEED;
						this.x += this._speed;}						
					else if(this.isDown("LEFT_ARROW")){ 
						if(this.isDown("SHIFT")) this._speed = RUNSPEED;
						else this._speed = WALKSPEED;
						this.x -= this._speed; }
					else if(this.isDown("UP_ARROW")){
						if(this.isDown("SHIFT"))this._speed = RUNSPEED;
						else this._speed = WALKSPEED;
						this.y -= this._speed;}	
					else if(this.isDown("DOWN_ARROW")){
						if(this.isDown("SHIFT"))this._speed = RUNSPEED;
						else this._speed = WALKSPEED;
						this.y += this._speed; }
					
				});
				
				return this;
			}
		});
		
				Crafty.c('CustomControls2', {
			__move: {left: false, right: false, up: false, down: false},	
			_speed: 3,
			
			CustomControls: function(speed) {
				if(speed) this._speed = speed;
				var move = this.__move;
				
				this.bind('enterframe', function() {
					//move the player in a direction depending on the booleans
					//only move the player in one direction at a time (up/down/left/right)
			
					
					 if(this.isDown("D")) {
					 	if(this.isDown("G")) this.x += this._speed*2;
						else this.x += this._speed; }
					else if(this.isDown("A")){
						if(this.isDown("G")) this.x -= this._speed*2;
						else this.x -= this._speed; }
					else if(this.isDown("W")) {
						if(this.isDown("G")) this.y -= this._speed*2;
						else this.y -= this._speed;} 	
					else if(this.isDown("S")) {
						if(this.isDown("G")) this.y += this._speed*2;
						else this.y += this._speed; }
				});
				
				return this;
			}
		});
		
		//ball
		ball = Crafty.e("2D, Canvas, ball, Controls3, CustomControls3, Animate, Collision")
			.attr({x: INIT_BALL_POS_X, y: INIT_BALL_POS_Y, z: 1})
			.animate("ball_1", 1, 5, 3)
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
		
		
		var player1HasBall = false;
		//create our player entity with some premade components
		player1 = Crafty.e("2D, Canvas, player1, Controls, CustomControls1, Animate, Collision")
			.attr({x: INIT_P1_POS_X, y: INIT_P1_POS_Y, z: 1})
			.CustomControls(1)
			.animate("walk_left", 6, 3, 8)
			.animate("walk_right", 9, 3, 11)
			.animate("walk_up", 3, 3, 5)
			.animate("walk_down", 0, 3, 2)
			.bind("enterframe", function(e) {
				if(this.isDown("LEFT_ARROW")) {
					if(!this.isPlaying("walk_left"))
							this.stop().animate("walk_left", 10);
				} else if(this.isDown("RIGHT_ARROW")) {
					if(!this.isPlaying("walk_right"))
						this.stop().animate("walk_right", 10);
				} else if(this.isDown("UP_ARROW")) {
					if(!this.isPlaying("walk_up"))
						this.stop().animate("walk_up", 10);
				} else if(this.isDown("DOWN_ARROW")) {
					if(!this.isPlaying("walk_down"))
						this.stop().animate("walk_down", 10);
				}
				
			}).bind("keyup", function(e) {
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
			}).onHit("ball", function() {
				ball.animate("ball_1", 10);
				if(this.isPlaying("walk_left")){
					ball.x -= this._speed;
				}
				else if(this.isPlaying("walk_right")){
					ball.x += this._speed;
				}
				else if(this.isPlaying("walk_up")){
					ball.y -= this._speed;
				}
				else if(this.isPlaying("walk_down")){
					ball.y += this._speed;
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
			.bind("enterframe", function(e) {
				if(this.isDown("A")) {
					if(!this.isPlaying("walk_left"))
						this.stop().animate("walk_left", 10);
				} else if(this.isDown("D")) {
					if(!this.isPlaying("walk_right"))
						this.stop().animate("walk_right", 10);
				} else if(this.isDown("W")) {
					if(!this.isPlaying("walk_up"))
						this.stop().animate("walk_up", 10);
				} else if(this.isDown("S")) {
					if(!this.isPlaying("walk_down"))
						this.stop().animate("walk_down", 10);
				}
			}).bind("keyup", function(e) {
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
			}).onHit("ball", function() {
				ball.animate("ball_1", 10);
				if(this.isPlaying("walk_left")){
					ball.x -= this._speed;
				}
				else if(this.isPlaying("walk_right")){
					ball.x += this._speed;
				}
				else if(this.isPlaying("walk_up")){
					ball.y -= this._speed;
				}
				else if(this.isPlaying("walk_down")){
					ball.y += this._speed;
				}
				this.stop();
			});;
			
			
	});

};



//helper functions
function logger(msg){
	$("#body").append(msg);
	$("#body").append("<br>")
}
