/*
2. Scrolling and Animating

  @author: Jason Manners
  @date: 5/16/2011
*/
var WORLD_WIDTH = 800;
var WORLD_HEIGHT = 250;
var BG_COLOR = "#888888";
var GRID_COLOR = "#666666";
var MENU_WIDTH = 250;
var GRID_SPACE = 50;

var SELECTED_X = 0;
var SELECTED_Y = 0;
var DISPLAY_SELECTED = false;

var rightDown = false;
var leftDown = false;
var upDown = false;
var downDown = false;

//var player;
var myWorld;
var imageLoader;

/************************************
  RequestAnimationFrame declaration
    Use requestAnimationFrame instead of setInterval 
    for a more consistent and smoother animation
*************************************/
const requestAnimationFrame = window.mozRequestAnimationFrame     || 
                            window.webkitRequestAnimationFrame  || 
                            function(callback){
                              window.setTimeout(callback, 1000 / 60);
                            };
                            
var startTime = window.mozAnimationStartTime || Date.now();

/******************************
  Helper function to clean the mouse coords to snap to grid
******************************/
function cleanSelection(coord) {
  return Math.floor(coord / GRID_SPACE) * GRID_SPACE;
}

/******************************
  Clears the canvas
******************************/
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

var currentTime = 0;
/******************************
  Function to update the state of things
******************************/
function update(timestamp) {
  var drawStart = (timestamp || Date.now());
  var delta_time = drawStart - startTime;
  currentTime += delta_time;
  //player.update(delta_time);
  myWorld.update(delta_time);
  startTime = drawStart;
}

/******************************
  Function to draw scene
******************************/
function draw() {
  context.fillStyle = BG_COLOR;
  clear();
  //currentAnimation.draw();
  context.drawImage(imageLoader.images["sky"],0,0,800,250,0,0,800,250);
  context.drawImage(imageLoader.images["ground"],0,0,800,100,0,150,800,100);
  //context.drawImage(imageLoader.images["step"],200,210);
  //player.draw();
  myWorld.draw();
}

/******************************
  Used as the main game loop to contain anything
  that will need to be update within the time frame
******************************/
function game_loop(timestamp) {
  update(timestamp);
  draw();
  requestAnimationFrame(game_loop);
}

/******************************
  Function to start off the animations
******************************/
function start_game() {
  $("#loading").css("display","none");
  $("#loading_bar").css("display","none");
  context = $('#world')[0].getContext("2d");
  //player = new Player(100,200,imageLoader.images,context);
  myWorld = new World(imageLoader.images,context);
  //intervalId = setInterval(game_loop, 30);
  requestAnimationFrame(game_loop);
}


/******************************
  Initializes variables 
******************************/
function init() {
  var worldWidth = window.innerWidth/2 - (WORLD_WIDTH/2);
  var menuWidth = window.innerWidth/2 - (MENU_WIDTH/2);
  $("#menu").css("left",menuWidth+"px");
  $("#world").css("position","absolute");
  $("#world").attr({ width: WORLD_WIDTH, height: WORLD_HEIGHT });
  $("#world").css("left",worldWidth+"px");
  $("#world").css("top","50px");

  $(document).keydown(onKeyDown);
  $(document).keyup(onKeyUp);
  
  imageLoader = new ImageLoader();
  imageLoader.addImage("sky","media/sky.png");
  imageLoader.addImage("ground","media/ground.png");
  imageLoader.addImage("step","media/step.png");
  imageLoader.addImage("player_standing","media/standing.png");
  imageLoader.addImage("player_walking","media/walking.png");
  imageLoader.addImage("player_jumping","media/jumping.png");

  //imageLoader.addImage("mission","media/mission1x.png");
  //imageLoader.addImage("trevor","media/trevorpt1.png");
  
  imageLoader.loadImages();
  requestAnimationFrame(loadingAnim);
}

function loadingAnim(timestamp) {
  //$("#progress").css("wdith",imageLoader.getProgress()+"%");
  var div = document.getElementById("progress");
  div.style.width = imageLoader.getProgress() + "%";

  if(imageLoader.getProgress() < 100) {
    requestAnimationFrame(loadingAnim);
  }
}

function onKeyDown(evt) {
  if (evt.keyCode == 39) {rightDown = true; myWorld.player.walk(); myWorld.player.direction = 1;}
  else if (evt.keyCode == 37) {leftDown = true; myWorld.player.walk(); myWorld.player.direction = -1;}
  if (evt.keyCode == 38) {upDown = true; myWorld.player.jump();}
  else if (evt.keyCode == 40) {downDown = true; myWorld.player.stand();}
}

function onKeyUp(evt) {
  if (evt.keyCode == 39) {rightDown = false; myWorld.player.stand(); }
  else if (evt.keyCode == 37){ leftDown = false; myWorld.player.stand();  }
  if (evt.keyCode == 38) upDown = false;
  else if (evt.keyCode == 40) downDown = false;
}


init();
//start_game();