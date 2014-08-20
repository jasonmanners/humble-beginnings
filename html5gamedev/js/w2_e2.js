/*
2. Make a canvas with a "game board" background and several "game piece" objects inside it.  
  (You can use image files, or just draw circles or squares).  
  Make it so the player can click on any of these game pieces and drag it around.
  Listen for mousedown, mousemove, and mouseup events on the canvas -- 
  on a mousedown, check if there's a piece in that location, and if so, begin dragging it.   
  On a mouseup, release any piece that's being dragged.  On a mousemove, if there's a piece being dragged, 
  make it move along with the mouse.

  @author: Jason Manners
  @date: 5/11/2011
*/
var WORLD_WIDTH = 600;
var WORLD_HEIGHT = 450;
var BG_COLOR = "#888888";
var GRID_COLOR = "#666666";
var MENU_WIDTH = 250;
var GRID_SPACE = 50;

var SELECTED_X = 0;
var SELECTED_Y = 0;
var DISPLAY_SELECTED = false;

var blue_portal = new Image();
var orange_portal = new Image();

var grabbed_square;
var move_square = false;

blue_portal.src = "media/blue_portal.png";
orange_portal.src = "media/orange_portal.png";

var gameBoard;
var blue_square;
var orange_square;

// Use requestAnimationFrame instead of setInterval for a more consistent and smoother animation
var requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
var startTime = window.mozAnimationStartTime || Date.now();

/******************************
  Helper function to clean the mouse coords to snap to grid
******************************/
function cleanSelection(coord) {
  return Math.floor(coord / GRID_SPACE) * GRID_SPACE;
}

/******************************
  Square Object
  Attrs: x, y, image
  
  Functions: 
    draw : draws the square at the x,y
    check_collision: checks if the given x and y are within the bounds of the square
******************************/
function Square (x,y,image) {
  this.x = x;
  this.y = y;
  this.image = image;
  
  this.draw = function() {
    context.save();
      context.drawImage(this.image,this.x+0.5,this.y+0.5,GRID_SPACE-0.5,GRID_SPACE-0.5);
    context.restore();
  }
  
  this.check_collision = function(x,y) {
    if(x >= this.x && x <= this.x+GRID_SPACE &&
        y >= this.y && y <= this.y+GRID_SPACE) {
      return true;
    }
    return false;
  };
}

/******************************
  GameBoard object
  Contains a collection of squares on the board
******************************/
function Game_Board() {
  this.squares_to_draw = new Array();
  
  this.draw = function() {
    for(i in this.squares_to_draw) {
      this.squares_to_draw[i].draw();
    }
  }

  this.pushSquare = function(sq) {
     this.squares_to_draw.push(sq);
  };
  
  this.get_squares = function() {
    return this.squares_to_draw;
  };
  
}

/******************************
  Function to start off the animations
******************************/
function start_game() {
  context = $('#world')[0].getContext("2d");
  //intervalId = setInterval(game_loop, 30);
  requestAnimationFrame(game_loop);
}

/******************************
  mouse down event
******************************/
function mouse_down(event) {
  var mySquares = gameBoard.get_squares();
  for(i in mySquares) {
    if(mySquares[i].check_collision(event.layerX-5,event.layerY-5)) {
      grabbed_square = mySquares[i];
      move_square = true;
    }
  }
}

/******************************
  mouse move event
******************************/
function mouse_move(event) {
  if(move_square) {
    grabbed_square.x = event.layerX-5-(GRID_SPACE/2);
    grabbed_square.y = event.layerY-5-(GRID_SPACE/2);
  }
}

/******************************
  mouse up event
******************************/
function mouse_up(event) {
  cleanX = cleanSelection(event.layerX-5);
  cleanY = cleanSelection(event.layerY-5);
  var mySquares = gameBoard.get_squares();
  for(i in mySquares) {
    if(mySquares[i] != grabbed_square) {
      if(move_square & mySquares[i].x == cleanX && mySquares[i].y == cleanY) {
        grabbed_square.x = (cleanX+GRID_SPACE)%WORLD_WIDTH;
        grabbed_square.y = cleanY;
      }
      else if(move_square) {
        grabbed_square.x = cleanX;
        grabbed_square.y = cleanY;
      }
    }
  }
  move_square = false;
}

/******************************
  Clears the canvas
******************************/
function clear() {
  context.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  rect(0,0,WORLD_WIDTH,WORLD_HEIGHT);
}

function rect(x,y,w,h) {
  context.beginPath();
  context.rect(x,y,w,h);
  context.closePath();
  context.fill();
}


function draw_grid() {
  context.save();
    
    //Draw Vertical Lines
    for (var x = 0.5; x < WORLD_WIDTH; x += GRID_SPACE) {
      context.moveTo(x, 0);
      context.lineTo(x, WORLD_HEIGHT);
    }

    //Draw Horizontal Lines
    for (var y = 0.5; y < WORLD_HEIGHT; y += GRID_SPACE) {
      context.moveTo(0, y);
      context.lineTo(WORLD_WIDTH, y);
    }
    context.strokeStyle = GRID_COLOR;
    context.stroke();
  context.restore();
}

/******************************
  Function to update the state of things
******************************/
function update() {
}

/******************************
  Function to draw scene
******************************/
function draw() {
  context.fillStyle = BG_COLOR;
  clear();
  draw_grid();
  gameBoard.draw();
}

/******************************
  Used as the main game loop to contain anything
  that will need to be update within the time frame
******************************/
function game_loop(timestamp) {
  update(timestamp);
  draw();
  requestAnimationFrame(game_loop);
}

/******************************
  Initializes variables 
******************************/
function init() {
  var worldWidth = window.innerWidth/2 - (WORLD_WIDTH/2);
  var menuWidth = window.innerWidth/2 - (MENU_WIDTH/2);
  $("#menu").css("left",menuWidth+"px");
  $("#world").css("position","absolute");
  $("#world").attr({ width: WORLD_WIDTH, height: WORLD_HEIGHT });
  $("#world").css("left",worldWidth+"px");
  $("#world").css("top","50px");
  
    //Event listeners
  $('#world').bind("mousedown",mouse_down);
  $('#world').bind("mousemove",mouse_move);
  $('#world').bind("mouseup",mouse_up);
  
  blue_square = new Square(50,50,blue_portal);
  orange_square = new Square(100,100,orange_portal);
  
  gameBoard = new Game_Board();
  gameBoard.pushSquare(blue_square);
  gameBoard.pushSquare(orange_square);
}

init();
start_game();