function ImageLoader() {
  this.images = new Array();
  this.sources = new Array();
  this.loaded = new Array();
  this.totalImages = 0;
  this.loadedImages = 0;
}

ImageLoader.prototype.addImage = function(name,src) {
  this.sources[name] = src;
  this.totalImages++;
}

ImageLoader.prototype.loadImages = function() {
  var me = this;
  for(name in this.sources){
    this.images[name] = new Image();
    this.images[name].onload = function() {
      me.loadedImages++;
      if(me.loadedImages >= me.totalImages) {
        start_game();
      }
    };
    this.images[name].src = this.sources[name];
  }
}

ImageLoader.prototype.getProgress = function() {
  progress = 0;
  if(this.totalImages > 0) {
    progress = (this.loadedImages/this.totalImages) * 100.0;
  }
  return progress;
}

/******************************************
  -Frame-
    A single Frame within an animation
    Contains:
      x       : x coord within image
      y       : y coords within image
      width   : width of frame within image
      height  : height of frame within image
******************************************/
function Frame(x,y,width,height,image) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.image = image;
  
  this.canvas = $("<canvas/>").attr("width",width+5).attr("height",height+5).get(0);
  this.context = this.canvas.getContext("2d");
  
  this.canvas_reverse = $("<canvas/>").attr("width",width+5).attr("height",height+5).get(0);
  this.context_reverse = this.canvas_reverse.getContext("2d");
  
  this.init_canvas(1,this.context);
  this.init_canvas(-1,this.context_reverse);
  
}

Frame.prototype.init_canvas = function(direction,aContext) {
    aContext.save();
      if(direction < 0)  {
        aContext.translate(this.width+5,0);
        aContext.scale(-1,1);
      }
      aContext.drawImage(this.image,this.x,this.y,this.width,this.height,0,0,this.width,this.height);
    aContext.restore();
}
  
Frame.prototype.getCanvas = function(direction) {
    if(direction == -1) {
      return this.canvas_reverse;
    }
    else {
      return this.canvas;
    }
}

/******************************************
  -Animation-
    A collection of data that represents a single animation EX: Jumping or Walking
    Contains:
      -Variables-
      image         : 
      frames        :
      totalFrames   :
      currentFrame  :
      
      -Methods-
      push_frame
      increment_frame
      get_current_frame
      reset_current_frame
******************************************/
function Animation(image,y,height,animArray,timestep) {
  this.image = image;
  this.frames = new Array();
  this.totalFrames = 0;
  this.currentFrame = 0;
  this.timestep = timestep;
  this.currentTime = 0;
  
  for(var i = 0; i < animArray.length; i++) {
    this.push_frame(animArray[i][0],y,animArray[i][1],height);
  }
}

Animation.prototype.push_frame = function(x,y,width,height) {
    this.frames.push(new Frame(x,y,width,height,this.image));
    this.totalFrames++;
}

Animation.prototype.update = function(delta_time) {
  this.currentTime += delta_time;
  if(this.currentTime >= this.timestep) {
    this.increment_frame();
    this.currentTime = 0;
  }
}  
  
Animation.prototype.increment_frame = function() {
    this.currentFrame++;
    this.currentFrame %= this.totalFrames;
}
  
Animation.prototype.get_current_frame = function() {
    return this.frames[this.currentFrame];
}
  
Animation.prototype.reset_current_frame = function() {
    this.currentFrame = 0;
}

/******************************************
  -Player-
    A collection of data that represents a player
******************************************/

function Player(x,y,images,context) {
  this.x = x;
  this.y = y;
  this.xAcc = 0;
  this.yAcc = 0;
  this.xVel = 0;
  this.yVel = 0;
  this.mass = 5;
  this.maxSpeed = 175;
  
  this.context = context;
  this.currentAnimation;
  this.animations = new Array();
  this.direction = 1;
  
  this._initialize_animations(images);
}

Player.prototype._initialize_animations = function(images) {
  var animIndex = [ [0,30],[32,31],[65,30],[97,29],[128,29],[159,29]];

  var walkingAnimIndex = [[0,32],[34,32],[68,32],[102,27],[131,29],[162,30],[194,32],[228,35],[265,36],[303,31],[336,31],[369,31]];

  var jumpingAnimIndex = [[1,29],[32,29],[63,29],[94,29],[125,29],[156,29],[187,29],[218,29],[249,29],
                        [280,29],[311,29],[342,29],[373,29],[404,29],[435,29],[466,29],[497,29],[528,29],
                        [559,29],[590,29],[621,29],[652,29], [683,29],[714,29],[745,29]];   
  
  this.animations['WALKING'] = new Animation(images["player_walking"],0,42,walkingAnimIndex,50);
  this.animations['STANDING'] = new Animation(images["player_standing"],0,38,animIndex,125);
  this.animations['JUMPING'] = new Animation(images["player_jumping"],0,43,jumpingAnimIndex,50);
  
  this.currentAnimation = this.animations['STANDING'];
}

Player.prototype.update = function(delta_time) {
  this.currentAnimation.update(delta_time);
}

Player.prototype.draw = function() {
  var curFrame = this.currentAnimation.get_current_frame().getCanvas(this.direction);
  context.drawImage(curFrame,this.x,this.y);
}

Player.prototype.walk = function() {
  this.currentAnimation = this.animations['WALKING'];
}

Player.prototype.stand = function() {
  this.currentAnimation = this.animations['STANDING'];
}

Player.prototype.jump = function() {
  this.yVel = -400;
  this.currentAnimation = this.animations['JUMPING'];
}

Player.prototype.start_run = function() {
  this.xAcc = 400;
}

Player.prototype.stop_run = function() {
  this.xAcc = -600;
}

/******************************************
  -Platform-
    A collection of data that represents a World
******************************************/
function Platform(x,y,width,height,image) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.image = image;
}

Platform.prototype.draw = function(context) {
  context.drawImage(this.image,this.x,this.y,this.width,this.height);
}

/******************************************
  -World-
    A collection of data that represents a World
******************************************/

function World(images,context) {
  this.camera_x = 0;
  this.camera_y = 0;
  
  this.images = images;
  
  this.gameObjects = [];
  this.staticObjects = [];
  this.context = context;
  this.player = new Player(100,200,images,context);
  this.addPlatform(200,100,50,10,this.images["step"]);
  this.addPlatform(300,125,50,10,this.images["step"]);
  this.addPlatform(400,150,50,10,this.images["step"]);
}

World.prototype.addPlatform = function(x,y,width,height,image) {
  this.staticObjects.push(new Platform(x,y,width,height,image));
}

World.prototype.draw = function() {
  for(var i = 0; i < this.staticObjects.length; i++) {
    this.staticObjects[i].draw(this.context);
  }
  this.player.draw();
}

World.prototype.update = function(delta_time) {
    var GRAVITY = 300;
    
    if(rightDown) {
      this.player.direction = 1;
      this.player.start_run();
    }
    else if(leftDown) {
      this.player.direction = -1;
      this.player.start_run();
    }
    else {
      this.player.stop_run();
    }
    
    
    
    if(this.player.xVel <= this.player.maxSpeed && this.player.xVel >= -this.player.maxSpeed) {
      this.player.xVel += this.player.direction*((delta_time/1000) * this.player.xAcc);
    }
    else {
      this.player.xVel = this.player.direction*this.player.maxSpeed;
    }
    
    if((this.player.direction == 1 && this.player.xVel < 0) || (this.player.direction == -1 && this.player.xVel > 0)) {
      this.player.xVel = 0;
    }
    
    this.player.yVel += (delta_time/1000) * this.player.yAcc + (delta_time/1000) * (GRAVITY*this.player.mass);
    
    var xDelta = (delta_time/1000) * this.player.xVel;
    var yDelta = (delta_time/1000) * this.player.yVel;
    var isIntersect = false;
    for(var i = 0; i < this.staticObjects.length; i++) {
      if((this.player.x+20 >= this.staticObjects[i].x && this.player.x+20 <= this.staticObjects[i].x + this.staticObjects[i].width && 
          this.player.y+40+yDelta >= this.staticObjects[i].y && this.player.y+40+yDelta <= this.staticObjects[i].y + this.staticObjects[i].height + 10
            && this.player.yVel > 0)
          || (this.player.y+40 == this.staticObjects[i].y && this.player.yVel > 0 && 
                this.player.x+20 >= this.staticObjects[i].x && this.player.x+20 <= this.staticObjects[i].x + this.staticObjects[i].width)) {
        isIntersect = true;
        this.player.y = this.staticObjects[i].y-40;
        this.player.yVel = 0;
        if(!rightDown && ! leftDown) {
          this.player.stand();
        }
        else {
          this.player.walk();
        }
        break;
      }
    }
    if(!isIntersect) {
      this.player.y += yDelta;
      if(this.player.y > 200) {
        this.player.y = 200;
        this.player.yVel = 0;
        if(!rightDown && ! leftDown) {
          this.player.stand();
        }
        else {
          this.player.walk();
        }
      }
    }
    this.player.x += xDelta;
    this.player.update(delta_time);
}
