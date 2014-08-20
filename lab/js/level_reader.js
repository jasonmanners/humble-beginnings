var WORLD_WIDTH = 800;
var WORLD_HEIGHT = 400;

var rightDown = false;
var leftDown = false;
var upDown = false;
var downDown = false;

var MENU_WIDTH = 250;

var SQUARE_WIDTH = 40;

var gameObjects = new Array();
var player;
var xVel = 3;
var cameraOffset = 0;
var yVel = 0;
var jumpCount = 0;

var animation = new Image();
var anim_width = 40;
var animCount = 0;

var shoot_animation_x = 120;
var shoot_animation_width = 30;
var shoot_animCount = 25;

var shootBool = false;
var animUpBool = false;
//var run_anim = new array(array(),);
var Game_Object = function(x,y) {
  this.x = x;
  this.y = y;
  
  this.direction = -1;
};
                
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

function clear() {
  context.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  rect(0,0,WORLD_WIDTH,WORLD_HEIGHT);
}

function readFile() {
//  var reader = new FileReader();

  //$("#output").html();
  context = $('#world')[0].getContext("2d");
  process_level_data();
  animation.src = "media/megaman_full.png";
  //animation.src = "media/megaman.png";
  intervalID = setInterval(game_loop,15);
}

function game_loop() {
  update();
  draw();
}

function update() {
  if(rightDown) {
    if(player.x > 650) {
      cameraOffset-=xVel;
    }
    else {
      player.x+=xVel;
    }
  }
  else if(leftDown) {
    if(player.x < 50) {
      cameraOffset+=xVel;
    }
    else {
      player.x-=xVel;
    }
  }
  
  if(upDown) {
    if(jumpCount < 2) {
      yVel = -12;
      upDown = false;
      jumpCount++;
    }
  }
  yVel += 0.9;
  player.y = player.y + yVel;
  for(var i = 0; i < gameObjects.length; i++) {
    if(player.y > gameObjects[i].y && player.y < gameObjects[i].y+(SQUARE_WIDTH) && player.x+32 >= gameObjects[i].x+cameraOffset 
        && player.x+32 <= gameObjects[i].x+SQUARE_WIDTH+cameraOffset && yVel > 0) {
      player.y = gameObjects[i].y;
      yVel = 0;
      jumpCount = 0;
      animCount = 0;
      animUpBool = false;
    }
  }
  
  if(animUpBool) {
    animCount++;
  }
  else if(animUpBool && yVel > 0) {
    animCount--;
  }
  if(animCount > 25 || animCount < 0) {
    animCount = 0;
    animUpBool = false;
  }
  
  if(shootBool) {
    shoot_animCount--;
  }
  else if(shootBool && yVel > 0) {
    shoot_animCount++;
  }
  if(shoot_animCount > 25 || shoot_animCount < 0) {
    shoot_animCount = 25;
    shootBool = false;
  }
}

function draw() {
  context.fillStyle = "#888888";
  clear();
  /******
    Add Screen Culling
  *******/
  
  for (var i = 0; i < gameObjects.length; i++) {
    context.fillStyle = "#AAAA22";
    rect(gameObjects[i].x+cameraOffset,gameObjects[i].y,SQUARE_WIDTH,SQUARE_WIDTH);
  }

  //context.fillStyle = "#2222AA";
  context.save();
    //context.scale(-1, 1);
    if(player.direction < 0) {
      context.translate(55, 0);
    }
    context.scale(player.direction, 1);
    context.drawImage(animation,(Math.floor(animCount/5)*anim_width),185,anim_width,55,player.direction*player.x,player.y-40,anim_width,55);

  context.restore();  
  
  if(shootBool) {
    context.save();
      //context.translate(0, -75);
      if(player.direction < 0) {
        context.translate(55, 0);
      }
      else {
        context.translate(-55-anim_width-20, 0);
      }
      context.translate(player.x+anim_width+20, player.y-40);
     // context.translate(0, player.y);
    //  context.scale(player.direction, 1);
      context.rotate((360 + (-1* 90 * player.direction )) * Math.PI / 180);
      //context.drawImage(animation,(Math.floor(shoot_animCount/5)*shoot_animation_width),0,shoot_animation_width,75,player.x,player.y-40,shoot_animation_width,75);
      context.drawImage(animation,(Math.floor(shoot_animCount/5)*shoot_animation_width),0,shoot_animation_width,75,0,0,shoot_animation_width,75);
    context.restore();
  }
  

  //circle(player.x,player.y,10);
}

function process_level_data() {
  for (var i = 0; i < level_data.length; i++) {
    for (var j = 0; j < level_data[i].length; j++) {
      if(level_data[i][j] == "x") {
        var tmpObj = new Game_Object((j*SQUARE_WIDTH),(i*SQUARE_WIDTH));
        gameObjects.push(tmpObj);
      }
      else if(level_data[i][j] == "j") {
        player = new Game_Object((j*SQUARE_WIDTH),(i*SQUARE_WIDTH)+25);
      }
    }
  }
}

function init() {
  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }
  var worldWidth = window.innerWidth/2 - (WORLD_WIDTH/2);
  var menuWidth = window.innerWidth/2 - (MENU_WIDTH/2);
  //$("#menu").css("left",menuWidth+"px");
  $("#world").css("position","absolute");
  $("#world").attr({ width: WORLD_WIDTH, height: WORLD_HEIGHT });
  $("#world").css("left",worldWidth+"px");
  $("#world").css("top","20px");
  
  $(document).keydown(onKeyDown);
  $(document).keyup(onKeyUp);
}

function onKeyDown(evt) {
  if (evt.keyCode == 39) {rightDown = true; player.direction = -1;}
  else if (evt.keyCode == 37) {leftDown = true; player.direction = 1;}
  if (evt.keyCode == 38){ upDown = true; animUpBool = true; animCount = 0;}
  else if (evt.keyCode == 40){ downDown = true; shootBool = true; shoot_animCount = 25;}
}

function onKeyUp(evt) {
  if (evt.keyCode == 39) rightDown = false;
  else if (evt.keyCode == 37) leftDown = false;
  if (evt.keyCode == 38) upDown = false;
  else if (evt.keyCode == 40) downDown = false;
}

init();
readFile();