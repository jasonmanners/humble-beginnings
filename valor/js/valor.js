var WORLD_WIDTH = 800;
var WORLD_HEIGHT = 450;

var WORLD_COLOR = "#999999";

var MENU_WIDTH = 250;

//var context;

var requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
var startTime = window.mozAnimationStartTime || Date.now();

var player;
/* Game Init */
  
var upDown = false;
var downDown = false;
var rightDown = false;
var leftDown = false;

var debug = true;    
var bullets = new Array();

function start_game() {

  context = $('#world')[0].getContext("2d");
  player = new Player(context);
  player.initialize_animations();
  
  $("#menu").css("display","none");
 
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
  
  if(upDown) {
    player.jump();
  }
  
  player.update(delta_time);
  //Redo -> Temp 
  if(rightDown) {
    //player.physics.x += (delta_time/1000)*125;
    player.setDirection(1);
    player.start_run();
  }
  else if(leftDown) {
    //player.physics.x -= (delta_time/1000)*125;
    //player.stop_run();
    player.setDirection(-1);
    player.start_run();
  }
  else {
    player.stop_run();
  }
  player.physics.x %= 850;
  
  for(var i = 0;  i < bullets.length; i++) {
    bullets[i].update(delta_time);
    if(bullets[i].x > 850){
      bullets.splice(i,1);
    }
  }
  $("#output").html("FPS: "+Math.round(1000/delta_time));
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
  for(var i = 0;  i < bullets.length; i++) {
    bullets[i].draw();
  }
  if(downDown) {
    player.draw_blast();
  }
  player.draw();
  
  if(debug) {
    context.save();
      context.fillStyle    = '#333333';
      context.font         = '15px sans-serif';
      context.textBaseline = 'top';
      context.fillText  ("X:"+Math.round(player.getX()), 0, 0);
      context.fillText  ("Y:"+Math.round(player.getY()), 50, 0);
      context.fillText  ("xVel:"+Math.round(player.physics.xVel), 0, 25);
      context.fillText  ("yVel:"+Math.round(player.physics.yVel), 50, 25);
    context.restore();
  }
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
  
  if(evt.keyCode == 40) {
    bullets.push(new Bullet(player.physics.x+125,player.physics.y+75,player.physics.getDirection(),context));
    
  }
}

function onKeyUp(evt) {
  if (evt.keyCode == 39) rightDown = false;
  else if (evt.keyCode == 37) leftDown = false;
  if (evt.keyCode == 38) upDown = false;
  else if (evt.keyCode == 40) downDown = false;
}

init();