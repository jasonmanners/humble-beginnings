var context;
var speed = 2;
var rightDown = false;
var leftDown = false;
var upDown = false;
var downDown = false;
var ballcolor = "#FFFFFF";
var applecolor = "#EE2222";
var goldencolor = "#C7A317";

var start_countdown = 3;

var REG_APPLE = 0;
var GOLD_APPLE = 1;

var WORLD_WIDTH = 280;  
var WORLD_HEIGHT = 350;
var GRID_SPACING = 10;

var HIGH_SCORE = 0;

var SCORE_TO_ADD = 15;
var scoreToAdd = 0;

var x = 25;
var y = 25;
var ballr = 10;
var score = 0;

var RUNNING = 42;
var STOP = 43;
var PAUSE = 44;

var GAME_STATE;
//Represents a worm segment
function WormSegment(x,y) {
  this.x = x;
  this.y = y;
};

/* 
    Represents a worm
  Contains the following functions:
    addSegment
    draw
    checkCollision
    update
*/    
function Worm() {
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
  
  this.clearTail = function() {
    this.tail = new Array();
    this.tail[0] = this.head;
  };
  
  this.draw = function() {
    context.save();
      context.fillStyle = ballcolor; 
      for (i in this.tail) {
        rect(this.tail[i].x * GRID_SPACING, this.tail[i].y * GRID_SPACING, 10, 10);
      }
    context.restore();
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

function Apple(worm) {
  this.type = Math.floor(Math.random()*50);
  this.x = 0;
  this.y = 0;
 
  this.checkLocation = function(x,y) {
    var locationGood = true;
    for (var i = 0; i < worm.tail.length; i++) {
      if(this.x == worm.tail[i].x && this.y == worm.tail[i].y) {
        locationGood = false;
      }
      break;
    }
    if(!locationGood) {
      this.setLocation();
    }
  };
  
  this.setLocation = function() {
    this.x = Math.floor(Math.random()*(WORLD_WIDTH/10));
    this.y = Math.floor(Math.random()*(WORLD_HEIGHT/10));
    this.checkLocation(this.x,this.y);
  };

  this.setLocation();
  
  this.draw = function() {
    context.save();
      if(this.type == GOLD_APPLE) {
        context.fillStyle = goldencolor;
      }
      else {
        context.fillStyle = applecolor;
      }
      rect(this.x * GRID_SPACING, this.y * GRID_SPACING, 10, 10);
      context.shadowOffsetX=0;
      context.shadowOffsetY=0;
      context.shadowBlur=8;
      context.shadowColor="#DDDDDD";
      context.fill();
    context.restore();
  };
}

var myWorm = new Worm();
var myApple = new Apple(myWorm);

function startGame(){
  $("#message").css('display','none');
  context = $('#world')[0].getContext("2d");
  speed = $("input[name=radio]:checked").val();
  
  myWorm = new Worm();
  myApple = new Apple(myWorm);
  score = 0;
  SCORE_TO_ADD = 15 * speed;
  scoreToAdd = SCORE_TO_ADD;
  start_countdown = 3;
  GAME_STATE = RUNNING;
  
  $("#countdown_text").html(start_countdown);
  $("#countdown").css("display","block");
  $("#scoreToAdd").html("");
  intervalId = setInterval(startCountdown, 1000);
}

function circle(x,y,r) {
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI*2, true);
  context.closePath();
  context.fill();
}

function rect(x,y,w,h) {
  context.beginPath();
  context.rect(x,y,w,h);
  context.closePath();
  context.fill();
}

function clear() {
  context.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  rect(0,0,WORLD_WIDTH,WORLD_HEIGHT);
}


function game_loop() {
  update();
  draw();
}

function startCountdown() {
  start_countdown--;
  if(start_countdown <= 0) {
    clearInterval(intervalId) ;
    $("#countdown").css("display","none");
    intervalId = setInterval(game_loop, 90/speed); //75
  }
  $("#countdown_text").html(start_countdown);
}

function update() {
  if(rightDown && myWorm.direction != 1) {
    myWorm.direction = 0;
  }
  else if(leftDown && myWorm.direction != 0) {
    myWorm.direction = 1;
  }
  else if(upDown && myWorm.direction != 3) {
    myWorm.direction = 2;
  }
  else if(downDown && myWorm.direction != 2) {
    myWorm.direction = 3;
  }
  
  myWorm.update();
  
  if(myWorm.head.x == myApple.x && myWorm.head.y == myApple.y) {
    
    if(myApple.type == GOLD_APPLE) {
      myApple = new Apple(myWorm);
      myWorm.clearTail();
      score+=(scoreToAdd*2);
    }
    else {
      myApple = new Apple(myWorm);
      myWorm.addSegement();
      score+=scoreToAdd;
    }
    scoreToAdd = SCORE_TO_ADD;
  }
  else {
    if(scoreToAdd > 1) {
      scoreToAdd--;
    }
  }
  
  if(myWorm.checkCollision(WORLD_WIDTH,WORLD_HEIGHT)) {
    if(score > HIGH_SCORE){
      HIGH_SCORE = score;
    }
    
    GAME_STATE = STOP;
    
    $("#currentScore").html(score+" Game Over");
    $("#title").html("<h3>High Score: "+HIGH_SCORE+"</h3><p>Last Score: "+score+"</p>");
    $("#message").css('display','block');
    clearInterval(intervalId);
  }
}

function draw() {
  context.fillStyle = "#888888";
  clear();
  if(GAME_STATE == RUNNING) {
    
    myWorm.draw();
    myApple.draw();
    
    $("#currentScore").html(score);
    $("#scoreToAdd").html(" + "+scoreToAdd);
  }
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
  var testWidth = window.innerWidth/2 - (WORLD_WIDTH/2);
  var msgWidth = window.innerWidth/2 - 100;
  $("#status").css("left",testWidth+"px");
  $("#status").css("width",WORLD_WIDTH+2+"px");
  $("#status").css("top","10px");
  $("#status").css("display","block");
  $("#countdown").css("left",msgWidth+"px");
  $("#message").css("left",msgWidth+"px");
  $("#world").css("position","absolute");
  $("#world").attr({ width: WORLD_WIDTH, height: WORLD_HEIGHT });
  $("#world").css("left",testWidth+"px");
  $("#world").css("top","30px");
  $("#homeLink").css("top",window.innerWidth+10+"px");
  $("#html_badge").css("top",WORLD_HEIGHT+100+"px");
  $("#html_badge").css("left",(window.innerWidth/2 - 16)+"px");
  var instr_width = (window.innerWidth/2) - WORLD_WIDTH - 50;
  $("#instructions").css("left","50px");
  
 // $("#difficulty_radio").buttonset();
}


$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

$('#myStart').click(function(){startGame();});

init();