var ctx;
var rightDown = false;
var leftDown = false;
var upDown = false;
var downDown = false;
var ballcolor = "#FFFFFF";
var x = 25;
var y = 25;
var ballr = 10;
var img = new Image();

var worm = {};

worm.direction = 0;
worm.x = 25;
worm.y = 25;

worm.update = function() {
  if(worm.direction == 0) worm.x+=2;
  else if (worm.direction == 1) worm.x-=2;
  else if (worm.direction == 2) worm.y-=2;
  else if (worm.direction == 3) worm.y+=2;
}
worm.draw = function(xW,yW) {
  rect(worm.x, worm.y, 10, 10);
}


function startGame(){
  $("#message").css('display','none');
  ctx = $('#world')[0].getContext("2d");
  intervalId = setInterval(draw, 10);
  img.src = "myIMG.jpg";
}

function circle(x,y,r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}

function rect(x,y,w,h) {
  ctx.beginPath();
  ctx.rect(x,y,w,h);
  ctx.closePath();
  ctx.fill();
}

function clear() {
  ctx.clearRect(0, 0, 500, 500);
  rect(0,0,500,500);
}

function draw() {
  ctx.fillStyle = "#888888";
  clear();
  ctx.fillStyle = ballcolor;
  //rect(25,25,50,50);

  if(rightDown) {
    //moveRight();
    worm.direction = 0;
  }
  else if(leftDown) {
    //moveLeft();
    worm.direction = 1;
  }
  else if(upDown) {
    //moveUp();
    worm.direction = 2;
  }
  else if(downDown) {
    //moveDown();
    worm.direction = 3;
  }
  
  worm.update();
  worm.draw(x, y);
  
  tmpScore = parseInt($("#currentScore").html()) + 1;
  $("#currentScore").html(tmpScore);
  //ctx.drawImage(img, x, y);
}

function moveRight() {
  x+=2;
}

function moveLeft() {
  x-=2;
}

function moveUp() {
  y-=2;
}

function moveDown() {
  y+=2;
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

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

$('#myStart').click(function(){startGame();});