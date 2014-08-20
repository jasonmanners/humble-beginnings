var WORLD_WIDTH = 800;
var WORLD_HEIGHT = 300;

var rightDown = false;
var leftDown = false;
var upDown = false;
var downDown = false;

var x = 0;
var xVel = 3;

var playerX = 75;
var playerY = 231;
var jumpCount = 0;
var yAcc = 0;
var yVel = 0;

var context;
var bg_img = new Image();
var brick_img = new Image();
var brickX = 400;
var brickY = 175;

function init() {
  testWidth = window.innerWidth/2 - (WORLD_WIDTH/2);
  context = $('#world')[0].getContext("2d");
  $("#world").attr({ width: WORLD_WIDTH, height: WORLD_HEIGHT });
  $("#world").css("border","1px solid black");
  $("#world").css("position","absolute");
  $("#world").attr({ width: WORLD_WIDTH, height: WORLD_HEIGHT });
  $("#world").css("left",testWidth+"px");
  $("#world").css("top","20px");
  $("#homeLink").css("top",window.innerWidth+10+"px");
  
  $(document).keydown(onKeyDown);
  $(document).keyup(onKeyUp);
}

function start() {
  context = $('#world')[0].getContext("2d");
  bg_img.src = "media/pretty_background.png";
  brick_img.src = "media/brick.png";
  intervalId = setInterval(draw, 15);
}

function update() {

  if(rightDown) {
    if(playerX > 650) {
      x+=xVel;
      brickX -= xVel;
    }
    else {
      playerX+=xVel;
    }
  }
  else if(leftDown) {
    if(playerX < 50) {
      x-=xVel;
      brickX += xVel;
    }
    else {
      playerX-=xVel;
    }
  }
  if(x < 0) {
    x = 1000 + x;
  }
  if(brickX < 0) {
    brickX = 1050;
  }
  x %= 1000;
  
  if(upDown) {
    if(jumpCount < 2) {
      yVel = -15;
      upDown = false;
      jumpCount++;
    }
  }
  yVel += 0.9;
  playerY = playerY + yVel;
  
  if(playerY > 230) {
    playerY = 230;
    yVel = 0;
    jumpCount = 0;
  }
  else if(playerY > brickY && playerX >= brickX && playerX <= brickX+50 && yVel > 0) {
    playerY = brickY;
    yVel = 0;
    jumpCount = 0;
  }
}

function draw() {
  update();
  context.fillStyle = "#DDDDDD";
  clear(WORLD_WIDTH,WORLD_HEIGHT,context);
  
  //context.drawImage(bg_img,x,0,800,300,0,0,800,300);
  if(x >= 200) {
    context.drawImage(bg_img,x,0,1000-x,300,0,0,1000-x,300);
    context.drawImage(bg_img,0,0,x-200,300,1000-x,0,x-200,300);
  }
  else {
    context.drawImage(bg_img,x,0,800,300,0,0,800,300);
  }
  
  context.drawImage(brick_img,brickX,brickY);
  
  context.save();
    context.fillStyle = "#0000FF";
    circle(playerX,playerY,10,context);
    context.shadowOffsetX=0;
    context.shadowOffsetY=0;
    context.shadowBlur=15;
    context.shadowColor="#222222";
    context.fill();
  context.restore();
  
  context.fillStyle    = '#333333';
  context.font         = 'italic 15px sans-serif';
  context.textBaseline = 'top';
  context.fillText  (""+playerX, 0, 0);
  context.fillText  (""+playerY, 50, 0);
 // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
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
start();

 
  