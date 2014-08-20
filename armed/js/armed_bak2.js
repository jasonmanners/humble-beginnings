/*******************************
  Armed-Main script
*******************************/
const WORLD_WIDTH = 600;
const WORLD_HEIGHT = 400;
var BG_COLOR = "#888888";
var TOTAL_BULLETS = 100;
var intervalID;
var bullet = new Image();
bullet.onload = function() {
  start_game();
}
bullet.src = "media/bullet.png";


var bullets = [];

var World = function(context) {
  this.width = 500;
  this.height = 500;
  this.context = context;
  
}

function Point() {
  this.x = Math.random()*500;
  this.y = Math.random()*100;
  this.vel = Math.random()*6+4;
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

function start_game() {
  context = $('#world')[0].getContext("2d");
  intervalID = setInterval(game_loop,15);
}


function game_loop() {
  update();
  draw();
}

function update() {
  for(var i = 0; i < TOTAL_BULLETS; i++) {
    bullets[i].y += bullets[i].vel;
    bullets[i].y %= 500;
  }
}

function draw() {
  context.fillStyle = BG_COLOR;
  clear();
  //currentAnimation.draw();
  
  for(var i = 0; i < TOTAL_BULLETS; i++) {
    context.drawImage(bullet,bullets[i].x,bullets[i].y);
  }
}

function init() {
  var worldWidth = window.innerWidth/2 - (WORLD_WIDTH/2);
  $("#world").css("position","absolute");
  $("#world").attr({ width: WORLD_WIDTH, height: WORLD_HEIGHT });
  $("#world").css("left",worldWidth+"px");
  $("#world").css("top","50px");
  
  for(var i = 0; i < TOTAL_BULLETS; i++) {
    bullets[i] = new Point();
  }
}

init();