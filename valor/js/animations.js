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
  
  this.getCanvas = function() {
    return this.canvas;
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
  this.curentFrame = 0;
  
  this.push_frame = function(x,y,width,height) {
    this.frames.push(new Frame(x,y,width,height,this.image));
    this.totalFrames++;
  };
  
  this.increment_frame = function() {
    this.curentFrame++;
    this.curentFrame %= this.totalFrames;
  };
  
  this.get_current_frame = function() {
    return this.frames[this.curentFrame];
  };
  
  this.reset_current_frame = function() {
    this.curentFrame = 0;
  };
};


var Player = function(context) {
  this.context = context;

  this.x = 50;
  this.y = 200;
  this.direction;
  this.animations = new Array();
  this.currentAnimation;
  var HEAVY_WIDTH = 100;
  var heavy_image = new Image();
  heavy_image.src = "media/heavy_run.png";
  this.current_delta_time = 0;
//  this.initialize_animations();
  
  this.initialize_animations = function() {
    this.animations['WALKING'] = new Animation(heavy_image);
    for(var i = 0; i < 8; i++) {
      this.animations['WALKING'].push_frame(i*HEAVY_WIDTH,0,100,100);
    }
    this.currentAnimation = this.animations['WALKING'];
  };
  
 
  this.update = function(delta_time) {
    this.current_delta_time += delta_time;
    //this.physics.update(delta_time);
    if(this.current_delta_time > 100) {
      this.currentAnimation.increment_frame();
      this.current_delta_time = 0;
    }
  };
  
  this.draw = function() {
    var curFrame = this.currentAnimation.get_current_frame().getCanvas();
    this.context.drawImage(curFrame,this.x,this.y);
  };

};
