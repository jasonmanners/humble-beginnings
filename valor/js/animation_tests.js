var WORLD_WIDTH = 800;
var WORLD_HEIGHT = 450;

var WORLD_COLOR = "#999999";

var MENU_WIDTH = 250;

var requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
var startTime = window.mozAnimationStartTime || Date.now();

var player;

var upDown = false;
var downDown = false;
var rightDown = false;
var leftDown = false;

function start_game() {
  context = $('#world')[0].getContext("2d");
  
  $("#menu").css("display","none");
  
  player = new Player(context);
  player.initialize_animations();
 // intervalID = setInterval(game_loop,15);
  requestAnimationFrame(game_loop);
}

function game_loop(timestamp) {
  update(timestamp);
  draw();
  requestAnimationFrame(game_loop);
}

function update(timestamp) {
  var drawStart = (timestamp || Date.now());
  var delta_time = drawStart - startTime;

  if(rightDown) {
    player.x += (delta_time/1000)*300;
  }
  else if(leftDown){
    player.x -= (delta_time/1000)*300;
  }
  player.update(delta_time);

  startTime = drawStart;
}

function draw() {
  clear(WORLD_WIDTH,WORLD_HEIGHT,WORLD_COLOR,context);
  //Ground Line
  context.save();
    context.moveTo(0, 280);
    context.lineTo(WORLD_WIDTH, 230);
    context.strokeStyle = "#222222";
    context.stroke();
  context.restore();
  player.draw();

}

function init() {
  var worldWidth = window.innerWidth/2 - (WORLD_WIDTH/2);
  var menuWidth = window.innerWidth/2 - (MENU_WIDTH/2);
  $("#hud").css("left",worldWidth+"px");
  $("#hud").css("width",(WORLD_WIDTH-4)+"px");
  $("#hud").css("top","10px");
  $("#hud").css("display","block");
  $("#menu").css("left",menuWidth+"px");
  $("#world").css("position","absolute");
  $("#world").attr({ width: WORLD_WIDTH, height: WORLD_HEIGHT });
  $("#world").css("left",worldWidth+"px");
  $("#world").css("top","38px");
  
  $(document).keydown(onKeyDown);
  $(document).keyup(onKeyUp);
}

function onKeyDown(evt) {
  if (evt.keyCode == 39) rightDown = true;
  else if (evt.keyCode == 37) leftDown = true;
  if (evt.keyCode == 38) upDown = true;
  else if (evt.keyCode == 40) downDown = true;

}

function onKeyUp(evt) {
  if (evt.keyCode == 39) rightDown = false;
  else if (evt.keyCode == 37) leftDown = false;
  if (evt.keyCode == 38) upDown = false;
  else if (evt.keyCode == 40) downDown = false;
}

init();
start_game();