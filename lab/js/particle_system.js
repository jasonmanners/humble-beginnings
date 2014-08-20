/*******************************
  Armed-Main script
*******************************/
//Constants
const MS_IN_SEC = 1000;

const RUNNING = 42; // Answer to life
const LOSE    = 43;
const WIN     = 44;
const PAUSE   = 45;
const STOPPED = 46;
/******************************
  Generic Functions - currently as consts - might redo?
******************************/

/************************************
  RequestAnimationFrame declaration
*************************************/
const requestAnimationFrame = window.mozRequestAnimationFrame     || 
                              window.webkitRequestAnimationFrame  || 
                              function(callback){
                                window.setTimeout(callback, MS_IN_SEC / 60);
                              };
                            
var startTime = window.mozAnimationStartTime || Date.now();

/******************************
  World Objects
  -Contains-
  
  -Attributes-
    * WORLD_WIDTH
    * WORLD_HEIGHT
    * context
    * camera -> X,Y coords of camera
    * world_state
    * initialized
    * game_objects -> array of dynamic game objects
    * static_objects -> array of static objects
    
  -Functions-
    * init_world
    * start
    * run
    * clear
    * update
    * draw
    * _init_canvas
    * _init_input
    * _init_game_objects
    
******************************/
function World() {
  this.WORLD_WIDTH = 600;
  this.WORLD_HEIGHT = 400;
  this.context = undefined;
  
  /* --- Gives us the ability to scroll --- */
  this.camera = {x : 0, y : 0};
  
  this.world_state = STOPPED;
  this.initialized = false;
  
  /*--- All objects in the game world ---*/
  this.game_objects = [];
  this.static_objects = [];
  this.effects = [];
  
  /*--- Input Queue ---*/
  this.input_queue = [];
  
}

//Variable declaration that we don't need in the constructor
World.prototype = {
}

World.prototype.init_world = function() {
  this._init_canvas();
  this._init_input();
  this._init_game_objects();
  this.initialized = true;
}

World.prototype._init_canvas = function() {
  var worldWidth = window.innerWidth/2 - (this.WORLD_WIDTH/2);
  $("#world").attr({ width: this.WORLD_WIDTH, height: this.WORLD_HEIGHT });
  $("#world").css("position","absolute");
  $("#world").css("left",worldWidth+"px");
  $("#world").css("top","50px");
  
  this.context = $("#world")[0].getContext("2d");
}

World.prototype._init_input = function() {
  /* Something like this */
  //$(document).keydown(onKeyDown);
  //$(document).keyup(onKeyUp);
  $(document).bind("mousedown",this.queue_mouse.bind(this));
  $(document).bind("mouseup",this.dequeue_mouse.bind(this));
  $(document).bind("mousemove",this.change_mouse.bind(this));
}

World.prototype._init_game_objects = function() {
  this.game_objects.push(new GameObject(200,200,0,25,5));
}

World.prototype.start = function() {
  this.world_state = RUNNING;
  requestAnimationFrame(this.run.bind(this));
}

World.prototype.run = function(timestamp) {
  var drawStart   = (timestamp || Date.now());
  var delta_time  = drawStart - startTime;
  
  if(this.world_state === RUNNING) {
    this.update(delta_time);
    this.draw(this.context);
    requestAnimationFrame(this.run.bind(this));
  }
  startTime = drawStart;
}

World.prototype.clear = function(context) {
  /* 
    Erase all dynamic objects
    erase everything until performance becomes an issue
  */
  context.clearRect(0, 0, this.WORLD_WIDTH, this.WORLD_HEIGHT);
  context.fillStyle = "rgb(100,100,100)";
  context.fillRect (0, 0, this.WORLD_WIDTH, this.WORLD_HEIGHT);
  /* 
    Erase all dynamic objects
    erase everything until performance becomes an issue
  */
}

World.prototype.update = function(delta_time) {
  //TEMP to check camera translations
  //this.camera.x += 0.1; //+ : right || - : left
  //this.camera.y += 0.1; //+ : down || - : up
  
  this.process_input();
  
  for(var i = 0; i < this.game_objects.length; i++) {
    this.game_objects[i].draft_update(delta_time);
    this.game_objects[i].publish_update(delta_time);
    
    if(this.game_objects[i].x > this.WORLD_WIDTH || this.game_objects[i].y < 0) {
      this.game_objects.splice(i,1); 
      i--;
    }
  }
  /*
  for(var i = 0, ii = this.game_objects.length; i < ii; i++) {
    var isCollide = false;
    this.game_objects[i].temporary_update();
    
    for(var j = 0, jj = this.static_objects.length; j < jj; j++) {
      this.game_objects[i].checkCollision(this.static_objects[j].x,this.static_objects[j].y);
    }
    
    if(!isCollide) {
      this.game_objects[i].publish_update();
    }
  }
  */
}

World.prototype.draw = function(context) {
  this.clear(context);

  context.save();
    context.translate(this.camera.x,this.camera.y);
    /* TEMP FOR TESTING OF WORLD 
    context.fillStyle = "rgba(200,0,0,0.5)";
    context.fillRect (200, 200, 20, 20);
    */
    
    for(var i = 0, ii = this.game_objects.length; i < ii; i++) {
      this.game_objects[i].draw(context);
    }
  context.restore();
  /*
  this.erase();
  save
  translate(camera.x+effect.x,camera.y,effect.y);
  for OBJECTS
    drawIfOnScreen
  restore
  */
}

World.prototype.queue_mouse = function(event) {
  this.input_queue["MOUSE"] = event;
}

World.prototype.change_mouse = function(event) {
  if(this.input_queue["MOUSE"] !== undefined) {
    this.input_queue["MOUSE"] = event;
  }
}

World.prototype.dequeue_mouse = function(event) {
  this.input_queue["MOUSE"] = undefined;
}

World.prototype.process_input = function() {
  if(this.input_queue["MOUSE"] !== undefined) {
    
    var tmpX = 0;
    var tmpY = this.WORLD_HEIGHT-10;
    var tmpDirection = (Math.PI * 2) - Math.atan((tmpY - this.input_queue["MOUSE"].layerY) / (this.input_queue["MOUSE"].layerX - tmpX)) + Math.random()*0.3 - 0.15;
    this.addGameObject(new GameObject(tmpX,tmpY,tmpDirection,1000,2)); //(.85 * Math.PI * 2)
    this.dequeue_mouse(this.input_queue["MOUSE"]);
  }
}

World.prototype.addGameObject = function(game_object) {
  this.game_objects.push(game_object);
}
/****

Always update world Coords

if needed update Camera for scroll

world to screen
world.x - camera.x
world.y - camera.y

scroll if screen coords > < margin scroll camera
****/

/******************************
  Generic Game Object Constructor
  @param x - starting xCoord
  @param y - starting yCoord
  @param direction (starting angle in radians)
  @param velocity (starting velocity along the angle - will be split out to an x and y velocity)
  @param mass (starting mass - will calculate into gravity/acceleration/friction calcs)
  
  -Contains-
  -Attributes-
    * x
    * y
    * tmp_x
    * tmp_y
    * mass
    * direction
    * xVelocity
    * yVelocity
    
  -functions-
    * draw
    * draft_update
    * publish_update
    * getDeltaX
    * getDeltaY
    * getVelocityVector
    * getWorldToScreenCoords
    * checkCollision
  
******************************/
function GameObject(x,y,direction,velocity,mass) {
  this.x = x;
  this.y = y;
  this.tmp_x = x;
  this.tmp_y = y;
  
  this.mass = mass;
  this.direction = direction;
  
  this.effects = [];
  
  var calcVelocity = this.getVelocityVector(velocity,direction);
  this.xVelocity = calcVelocity.x;
  this.yVelocity = calcVelocity.y;
  this.image = new Image();
  this.image.src = "media/bullet.png";
  
  this.smokeImage = new Image();
  this.smokeImage.src = "media/smoke.png";
}

GameObject.prototype.draw = function(context) {
  context.save();
    //context.draw(this.image,this.x,this.y);
   // context.fillStyle = "rgba(200,0,0,0.5)";
   // context.fillRect (this.x, this.y, 40, 40);
    
    
    context.fillStyle = "rgba(0,0,0,1.0)";
    context.beginPath();
    context.arc(this.x, this.y, 20, 0, Math.PI*2, true); //*2
    context.fill();
    
    for(var i = 0, ii = this.effects.length; i < ii; i++) {
      this.effects[i].draw(context);
    }
    //context.translate(this.x,this.y);
    //context.rotate(this.direction+(Math.PI/2));
    //context.drawImage(this.image,0,0);
    
  context.restore();
}
/* Change to something_update and publish_update -> most likely no longer generic functions */
GameObject.prototype.draft_update = function(delta_time) {
  this.tmp_x = this.x + this.getDeltaX(delta_time);
  this.tmp_y = this.y + this.getDeltaY(delta_time);
}

GameObject.prototype.publish_update = function() {
  this.x = this.tmp_x;
  this.y = this.tmp_y;
  
  this.effects.push(new Smoke(this.x,this.y,this.smokeImage));
    
}

GameObject.prototype.getDeltaX = function(delta_time){
  return (delta_time/MS_IN_SEC) * this.xVelocity;
}

GameObject.prototype.getDeltaY = function(delta_time){
  return (delta_time/MS_IN_SEC) * this.yVelocity;
}

GameObject.prototype.getVelocityVector = function(radius, angle) {
  return {
    x : radius*Math.cos(angle),
    y : radius*Math.sin(angle)
  };
}

GameObject.prototype.getWorldToScreenCoords = function(camera) {
  return {
    x : this.x - camera.x,
    y : this.y - camera.y
  };
}

GameObject.prototype.checkCollision = function(x,y,width,height) {
  if(this.x >= x && this.x <= x+width && this.y >= y && this.y <= y+height) {
    return true;
  }
  return false;
}

/******************************
  @TODO Write Menu Class
******************************/
function Smoke(x,y,image) {
  this.x = x;
  this.y = y;
  this.image = image;
  this.direction = Math.PI*2*Math.random();
}

Smoke.prototype.draw = function(context) {
  context.save();
    context.translate(this.x,this.y);
    context.rotate(this.direction);
    context.drawImage(this.image,0,0);
  context.restore();
}



var myWorld = new World();

myWorld.init_world();
myWorld.start();
