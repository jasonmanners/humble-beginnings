var WORLD_WIDTH = 600;
var WORLD_HEIGHT = 460;
var BG_COLOR = "#888888";
var GRID_COLOR = "#666666";
var MENU_WIDTH = 250;
var GRID_SPACE = 20;

var SELECTED_X = 0;
var SELECTED_Y = 0;
var DISPLAY_SELECTED = false;

var gameBoard;
function cleanSelection(coord) {
  return Math.floor(coord / GRID_SPACE) * GRID_SPACE;
}

function Square (x,y) {
  this.x = x;
  this.y = y;
  
  this.draw = function() {
    context.save();
      context.fillStyle = "#FFFFFF";
      rect(this.x+0.5,this.y+0.5,GRID_SPACE-0.5,GRID_SPACE-0.5);
    context.restore();
  }
}


function Game_Board() {
  this.squares_to_draw = new Array();
  this.full_board = new Array();
  
  this.draw = function() {
    for(i in this.squares_to_draw) {
      this.squares_to_draw[i].draw();
    }
  }
  
  this.pushSquare = function(x,y) {
    if(!this.checkSquare(x,y)) {
      this.squares_to_draw.push(new Square(x,y));
    }
  }
  
  this.checkSquare = function(x,y) {
    if(this.full_board[x+"-"+y] === undefined) {
      this.full_board[x+"-"+y] = "Taken";
      return false;
    }
    return true;
  }
}

function start_game() {
  $("#menu").css("display","none");
  context = $('#world')[0].getContext("2d");
  
  //Event listeners
  $('#world').bind("mousedown",mouse_click);//.addEventListener('mousedown', mouse_click, false);
  gameBoard = new Game_Board();
  intervalId = setInterval(game_loop, 30);
}

function mouse_click(event) {
  //Subtracted 5 becuase it grabs middle of mouse - I want to grab the tip of mouse click
  SELECTED_X = cleanSelection(event.layerX-5);
  SELECTED_Y = cleanSelection(event.layerY-5);
  gameBoard.pushSquare(SELECTED_X,SELECTED_Y);
}

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

function circle(x,y,r) {
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI*2, true);
  context.closePath();
  context.fill();
}

function draw_grid() {
  context.save();
    
    //Draw Vertical Lines
    for (var x = 0.5; x < WORLD_WIDTH; x += 20) {
      context.moveTo(x, 0);
      context.lineTo(x, WORLD_HEIGHT);
    }

    //Draw Horizontal Lines
    for (var y = 0.5; y < WORLD_HEIGHT; y += 20) {
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
  Function called by interval to update every ___ms
******************************/
function game_loop() {
  update();
  draw();
}

function init() {
  var worldWidth = window.innerWidth/2 - (WORLD_WIDTH/2);
  var menuWidth = window.innerWidth/2 - (MENU_WIDTH/2);
  $("#menu").css("left",menuWidth+"px");
  $("#world").css("position","absolute");
  $("#world").attr({ width: WORLD_WIDTH, height: WORLD_HEIGHT });
  $("#world").css("left",worldWidth+"px");
  $("#world").css("top","50px");
}

init();