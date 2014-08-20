var WORLD_WIDTH = 800;
var WORLD_HEIGHT = 400;

var upDown = false;
var downDown = false;
var rightDown = false;
var leftDown = false;
var x = 50;
var xVel = 8;
var MENU_WIDTH = 250;

var direction = 1;
var context;
var animation = new Image();
var explosion = new Image();

var explosionBool = false;

var anim_width = 100;

var animCount = 0;
var explosionCount = 0;

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

function start_animation() {
  context = $('#world')[0].getContext("2d");
  animation.src = "media/heavy_run.png";
  explosion.src = "media/explosion.png";
  intervalId = setInterval(draw, 100);
}

function update() {
  if(rightDown) {
    x+=xVel;
    animCount++;
    animCount %= 8;
  }
  else if(leftDown) {
    x-=xVel;
    animCount++;
    animCount %= 8;
  }
  
  if(explosionBool) {
    explosionCount++;
  }
  
  if(explosionCount > 5) {
    explosionCount = 0;
    explosionBool = false;
  }
 /*
 if(animCount > 8) {
    animCount = 0;
    upDown = false;
  }
  */
}

function draw() {
  update();
  context.fillStyle = "#DDDDDD";
  clear(WORLD_WIDTH,WORLD_HEIGHT,context);
  context.save();
   if(direction < 0) {
      context.translate(150, 0);
    }
  context.scale(direction, 1);
  context.drawImage(animation,(animCount*anim_width),0,anim_width,100,x*direction,200,anim_width*1.5,anim_width*1.5);
  context.restore();
  if(explosionBool) {
  context.save();
    context.drawImage(explosion,(explosionCount*anim_width),0,anim_width,100,200,200,anim_width*1.5,anim_width*1.5);
  context.restore();
  }
}
function init() {
  var worldWidth = window.innerWidth/2 - (WORLD_WIDTH/2);
  var menuWidth = window.innerWidth/2 - (MENU_WIDTH/2);
  $("#menu").css("left",menuWidth+"px");
  $("#menu").css("top",WORLD_HEIGHT+50+"px");
  $("#world").css("position","absolute");
  $("#world").attr({ width: WORLD_WIDTH, height: WORLD_HEIGHT });
  $("#world").css("left",worldWidth+"px");
  $("#world").css("top","20px");
  
  $(document).keydown(onKeyDown);
  $(document).keyup(onKeyUp);
}

function onKeyDown(evt) {
  if (evt.keyCode == 39) {rightDown = true; direction = 1;}
  else if (evt.keyCode == 37){ leftDown = true; direction = -1;}
  if (evt.keyCode == 38) upDown = true;
  else if (evt.keyCode == 40) { downDown = true; explosionBool = true; explosionCount = -1;}
}

function onKeyUp(evt) {
  if (evt.keyCode == 39) { rightDown = false; animCount=0;}
  else if (evt.keyCode == 37){ leftDown = false;  animCount=0;}
  if (evt.keyCode == 38) upDown = false;
  else if (evt.keyCode == 40) downDown = false;
}

init();