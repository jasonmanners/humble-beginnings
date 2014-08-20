var WORLD_WIDTH = 500;
var WORLD_HEIGHT = 500;

var heavy_image = new Image();
var interpX = 0;
var timeX = 0;
var context;

var camera_x = 0;
var camera_y = 0;

  var requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame,
    startTime = window.mozAnimationStartTime || Date.now();
function init() {
  context = $('#world')[0].getContext("2d");
  $("#world").attr({ width: WORLD_WIDTH, height: WORLD_HEIGHT });
  $("#world").css("border","1px solid black");
}

function start() {
  context = $('#world')[0].getContext("2d");
  heavy_image.src = "media/heavy.png";
 // intervalId = setInterval(draw, 75);
  requestAnimationFrame(game_loop);
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
  context.arc(x, y, r, 0, Math.PI*2, true); //*2
  context.fill();
}

function draw() {
  context.fillStyle = "#888888";
  clear(WORLD_WIDTH,WORLD_HEIGHT);
  context.fillStyle = "#FFFFFF";
  circle(interpX+camera_x,50+camera_y,10);
  circle(timeX+camera_x,100+camera_y,10);
  context.drawImage(heavy_image,200+camera_x,200+camera_y);
}

function update(timestamp) {
  var drawStart = (timestamp || Date.now()), diff = drawStart - startTime;

  //use diff to determine correct next step
  timeX++;
  interpX += (diff/1000)*50;
  //set startTime to this repaint
  camera_x = Math.random()*10;
  camera_y = Math.random()*10;
  startTime = drawStart;
}

function game_loop(timestamp) {
  update(timestamp);
  draw();
  requestAnimationFrame(game_loop);
}

init();
start();


