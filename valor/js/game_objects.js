/******************************************
  Objects needed for Valor
 ******************************************/
//CONSTANTS
var TOTAL_MS = 1000;
/******************************************
  -Frame-
    A single Frame within an animation
    Contains:
      x       : x coord within image
      y       : y coords within image
      width   : width of frame within image
      height  : height of frame within image
******************************************/
var Frame = function(x,y,width,height,image) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.image = image;
  
  this.canvas = $("<canvas/>").attr("width",width).attr("height",height).get(0);
  this.context = this.canvas.getContext("2d");
  
  this.canvas_reverse = $("<canvas/>").attr("width",width).attr("height",height).get(0);
  this.context_reverse = this.canvas_reverse.getContext("2d");
  
  this.init_canvas = function(direction,aContext) {
    aContext.save();
      if(direction < 0)  {
        aContext.translate(width,0);
        aContext.scale(-1,1);
      }
      aContext.drawImage(this.image,this.x,this.y,width,height,0,0,width,height);
    aContext.restore();
  };
  
  this.getCanvas = function(direction) {
    if(direction == -1) {
      return this.canvas_reverse;
    }
    else {
      return this.canvas;
    }
  };
  
  this.init_canvas(1,this.context);
  this.init_canvas(-1,this.context_reverse);
  
};

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
var Animation = function(image) {
  this.image = image;
  this.frames = new Array();
  this.totalFrames = 0;
  this.currentFrame = 0;
  
  this.push_frame = function(x,y,width,height) {
    this.frames.push(new Frame(x,y,width,height,this.image));
    this.totalFrames++;
  };
  
  this.increment_frame = function() {
    this.currentFrame++;
    this.currentFrame %= this.totalFrames;
  };
  
  this.get_current_frame = function() {
    return this.frames[this.currentFrame];
  };
  
  this.reset_current_frame = function() {
    this.currentFrame = 0;
  };
};

/******************************************
  -PhysicsObject-
    PhysicsEngine code. Allows objects to contain within themselves
    Contains:
      x       : x coord within image
******************************************/
var PhysicsObject = function(x,y,mass) {
	var GRAVITY = 300;
  
  this.x = x;
  this.y = y;
  this.mass = mass;
	this.xVel = 0;
	this.yVel = 0;
  this.xAcc = 0;
  this.yAcc = 0;
  this.maxSpeed = 100;
  //x/-x direction
  this.direction = 1;
  
  this.update = function(delta_time) {
    if(this.xVel <= this.maxSpeed && this.xVel >= -this.maxSpeed) {
      this.xVel += this.direction*((delta_time/1000) * this.xAcc);
    }
    else {
      this.xVel = this.direction*this.maxSpeed;
    }
    
    if((this.direction == 1 && this.xVel < 0) || (this.direction == -1 && this.xVel > 0)) {
      this.xVel = 0;
    }
    
    this.yVel += (delta_time/1000) * this.yAcc + (delta_time/1000) * (GRAVITY*this.mass);
    this.x += (delta_time/1000) * this.xVel;
    this.y += (delta_time/1000) * this.yVel;
    if(this.y > 200) {
      this.y = 200;
      this.yVel = 0;
    }
  };
  
  this.setAccel = function(coord,newAcc) {
    if(coord == "X") {
      this.xAcc = newAcc;
    }
    else {
      this.yAcc = newAcc;
    }
  };
  
  this.setVelocity = function(coord,newVel) {
    if(coord == "X") {
      this.xVel = newVel;
    }
    else {
      this.yVel = newVel;
    }
  };
  
  this.getX = function() {
    return this.x;
  };
  
  this.getY = function() {
    return this.y;
  };
  
  this.setMaxSpeed = function(maxSpeed) {
    this.maxSpeed = maxSpeed;
  };
  
  this.setDirection = function(direction) {
    this.direction = direction;
  };
  
  this.getDirection = function() {
    return this.direction;
  };
};

/******************************************
  -Particle-
    A single particle within a system
    Contains:
      x       : x coord within image
******************************************/
var Particle = function(x,y,mass,animation) {
  this.animation = animation;
  this.physics = new PhysicsObject(x,y,mass);
};
/******************************************
  -ParticleSystem-
    ParticleSystemCode
    Contains:
      x       : x coord within image
******************************************/
/*var ParticleSystem = function() {
  this.particles = new Array();
  
  this.push_particle = function() {
    this.particles.push(new Particle());
  };
  
  this.update = function(delta_time) {
  };
  
  this.draw = function() {
  };
};*/

//BULLETS -> REDO

var Bullet = function(x,y,direction,context) {
  this.x = x;
  this.y = y;
  this.color = "#FF0000";
  this.bullet_img = new Image();
  this.bullet_img.src = "media/bullet.png";
  
  this.draw = function() {
   // circle(this.x,this.y,3,this.color,context);
    context.save();
      context.drawImage(this.bullet_img,this.x,this.y-12);
    context.restore();
  };
  
  this.update = function(delta_time) {
    this.x += direction * (delta_time/1000) * 1000;
  };
}; 

/******************************************
  -Player-
    A collection of data that represents a player
    Contains:
      -Variables-
      x           : 
      y           :
      direction   : 
      
      -Methods-
      checkCollision
******************************************/
var Player = function(context) {
  this.context = context;
  
  this.physics = new PhysicsObject(50,200,5);
  this.physics.setDirection(1);
  this.physics.setMaxSpeed(300);

  this.direction;
  this.animations = new Array();
  this.currentAnimation;
  
  this.isShooting = false;
  
  var blastFrames = 0;
  var BLAST_WIDTH = 50;
  var HEAVY_WIDTH = 150;
  var heavy_image = preloaded_heavy_img; //new Image();
 // heavy_image.src = "media/heavy_run.png";
  var standing_img = preloaded_standing_img; //new Image();
  //standing_img.src = "media/standing.png";
  var gun_blast_img = preloaded_blast_img;
  //gun_blast_img.src = "media/gun_blast.png";
  this.current_delta_time = 0;
  this.currentAnim = "STANDING";
//  this.initialize_animations();
  
  this.initialize_animations = function() {
    this.animations['WALKING'] = new Animation(heavy_image);
    for(var i = 0; i < 8; i++) {
      this.animations['WALKING'].push_frame(i*HEAVY_WIDTH,0,HEAVY_WIDTH,HEAVY_WIDTH);
    }
    
    this.animations['STANDING'] = new Animation(standing_img);
    for(var i = 0; i < 2; i++) {
      this.animations['STANDING'].push_frame(i*HEAVY_WIDTH,0,HEAVY_WIDTH,HEAVY_WIDTH);
    }
    
    this.animations['GUN_BLAST'] = new Animation(gun_blast_img);
    for(var i = 0; i < 2; i++) {
      this.animations['GUN_BLAST'].push_frame(i*BLAST_WIDTH,0,BLAST_WIDTH,BLAST_WIDTH);
    }
    
    this.currentAnimation = this.animations['STANDING'];
  };
  
  this.checkCollision = function() {
    
  };
  
  this.jump = function() {
    this.physics.setVelocity("Y",-400);
  };
  
  this.start_run = function() {
    this.physics.setAccel("X",400);
  };
  
  this.stop_run = function() {
    this.physics.setAccel("X",-600);
  };
  
  this.update = function(delta_time) {
    this.current_delta_time += delta_time;
    this.physics.update(delta_time);
    
    if(this.current_delta_time > 100 && this.currentAnim == "WALKING") {
      this.currentAnimation.increment_frame();
      this.current_delta_time = 0;
    }
    else if(this.current_delta_time > 500 && this.currentAnim == "STANDING") {
      this.currentAnimation.increment_frame();
      this.current_delta_time = 0;
    }
    
    if(this.physics.xVel == 0 && this.physics.yVel == 0) {
      this.currentAnimation = this.animations['STANDING'];
      this.currentAnim = "STANDING";
    }
    else {
      this.currentAnimation = this.animations['WALKING'];
      this.currentAnim = "WALKING";
    }
    
    if(this.isShooting) {
      blastFrames++;
      if(blastFrames > 2) {
        this.isShooting = false;
        blastFrames = 0;
      }
    }
  };
  
  this.shoot = function() {
    this.isShooting = true;
  };
  
  this.draw = function() {
    var curFrame = this.currentAnimation.get_current_frame().getCanvas(this.physics.getDirection());
    this.context.drawImage(curFrame,this.physics.getX(),this.physics.getY());
    if(this.isShooting) {
      this.draw_blast();
    }
  };
  
  this.draw_blast = function() {
    this.context.save();
      var curFrame = this.animations['GUN_BLAST'].get_current_frame().getCanvas(this.physics.getDirection());
      this.context.drawImage(curFrame,this.physics.x+125, this.physics.y+50);
    this.context.restore();
  };
  
  this.getX = function() {
    return this.physics.getX();
  };
  
  this.getY = function() {
    return this.physics.getY();
  };
  
  this.setDirection = function(direction) {
    this.physics.setDirection(direction);
  };
};