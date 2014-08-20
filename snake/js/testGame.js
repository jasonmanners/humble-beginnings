var ctx;
var rightDown = false;
var leftDown = false;
var upDown = false;
var downDown = false;
var ballcolor = "#FFFFFF";
var applecolor = "#EE2222";

var WORLD_WIDTH = 500;  
var WORLD_HEIGHT = 500;
var GRID_SPACING = 10;

var HIGH_SCORE = 0;

var x = 25;
var y = 25;
var ballr = 10;
var img = new Image();
var score = 0;

function WormSegment(x,y) {
  this.x = x;
  this.y = y;
};

function worm() {
  this.direction = 0;
  this.x = 2;
  this.y = 2;
  this.tail = new Array();
  this.tail[0] = new WormSegment(this.x,this.y);
  
  this.head = this.tail[0];
  
  this.addSegement = function() {
    var newSeg;
    var lastSeg = this.tail[this.tail.length-1];
 
    if(this.direction == 0) newSeg = new WormSegment(lastSeg.x-1,lastSeg.y);
    else if (this.direction == 1) newSeg = new WormSegment(lastSeg.x+1,lastSeg.y);
    else if (this.direction == 2) newSeg = new WormSegment(lastSeg.x,lastSeg.y+1);
    else if (this.direction == 3) newSeg = new WormSegment(lastSeg.x,lastSeg.y-1);
    
    this.tail.push(newSeg);
  }
  
  this.draw = function() {
    for (i in this.tail) {
      rect(this.tail[i].x * GRID_SPACING, this.tail[i].y * GRID_SPACING, 10, 10);
    }
  };
  
  this.checkCollision = function(w,h) {
    result = false;
    if(this.head.x > ((w-10)/10) || this.head.x < 0 ||
        this.head.y > ((h-10)/10) || this.head.y < 0) {
      result = true;
    }
    for(i in this.tail){
      if(this.tail[i] != this.head) {
        if(this.tail[i].x == this.head.x && this.tail[i].y == this.head.y) {
          result = true;
        }
      }
    }
        
    return result;
  };
  
  this.update = function() {
    var xDelta = 0;
    var yDelta = 0;
    if(this.direction == 0) xDelta = 1;
    else if (this.direction == 1) xDelta = -1;
    else if (this.direction == 2) yDelta = -1;
    else if (this.direction == 3) yDelta = 1;
    
    for (var i = this.tail.length-1; i >= 0; i--) {
      if(this.tail[i] == this.head) {
        this.tail[i].x += xDelta;
        this.tail[i].y += yDelta;
      }
      else{
        this.tail[i].x = this.tail[i-1].x;
        this.tail[i].y = this.tail[i-1].y;
      }
    }
  };
};

function apple() {
  this.x = Math.floor(Math.random()*(WORLD_WIDTH/10));
  this.y = Math.floor(Math.random()*(WORLD_HEIGHT/10));
  
  this.draw = function() {
    ctx.save();
    rect(this.x * GRID_SPACING, this.y * GRID_SPACING, 10, 10);
    ctx.shadowOffsetX=0;
    ctx.shadowOffsetY=0;
    ctx.shadowBlur=8;
    ctx.shadowColor="#DDDDDD";
    ctx.fill();
    ctx.restore();
    //ctx.shadowBlur=0;
  };
}

var myWorm = new worm();
var myApple = new apple();
function startGame(){
  $("#message").css('display','none');
  ctx = $('#world')[0].getContext("2d");
  var speed = $("input[name=radio]:checked").val();
  intervalId = setInterval(draw, 90/speed); //75
  img.src = "myIMG.jpg";
  myWorm = new worm();
  myApple = new apple();
  score = 0;
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
  ctx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  rect(0,0,WORLD_WIDTH,WORLD_HEIGHT);
}

function draw() {
  ctx.fillStyle = "#888888";
  clear();
  ctx.fillStyle = ballcolor;
  //rect(25,25,50,50);

  if(rightDown && myWorm.direction != 1) {
    //moveRight();
    myWorm.direction = 0;
  }
  else if(leftDown && myWorm.direction != 0) {
    //moveLeft();
    myWorm.direction = 1;
  }
  else if(upDown && myWorm.direction != 3) {
    //moveUp();
    myWorm.direction = 2;
  }
  else if(downDown && myWorm.direction != 2) {
    //moveDown();
    myWorm.direction = 3;
  }
  
  myWorm.update();
  myWorm.draw();
  ctx.fillStyle = applecolor;
  myApple.draw();
  if(myWorm.head.x == myApple.x && myWorm.head.y == myApple.y) {
    myApple = new apple();
    myWorm.addSegement();
    score++;
  }
  
  $("#currentScore").html(score);
  
  if(myWorm.checkCollision(WORLD_WIDTH,WORLD_HEIGHT)) {
    if(score > HIGH_SCORE){
      HIGH_SCORE = score;
    }
    $("#currentScore").html(score+" Game Over");
    $("#title").html("<h3>High Score: "+HIGH_SCORE+"</h3><p>Last Score: "+score+"</p>");
    $("#message").css('display','block');
    clearInterval(intervalId);
  }
  //ctx.drawImage(img, x, y);
}

function moveRight() {
  x+=1;
}

function moveLeft() {
  x-=1;
}

function moveUp() {
  y-=1;
}

function moveDown() {
  y+=1;
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


function init() {
  testWidth = window.innerWidth/2 - (WORLD_WIDTH/2);
  $("#status").css("left",testWidth+6+"px");
  $("#status").css("width",(WORLD_WIDTH-10)+"px");
  $("#status").css("top","26px");
  $("#status").css("display","block");
  $("#message").css("left",testWidth+6+"px");
  $("#world").css("position","absolute");
  $("#world").attr({ width: WORLD_WIDTH, height: WORLD_HEIGHT });
  $("#world").css("left",testWidth+"px");
  $("#world").css("top","20px");
  $("#homeLink").css("top",window.innerWidth+10+"px");
 // $("#difficulty_radio").buttonset();
}


$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

$('#myStart').click(function(){startGame();});

init();