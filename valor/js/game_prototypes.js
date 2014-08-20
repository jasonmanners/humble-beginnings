/**********************************
  Frame

**********************************/
var Frame = function() {
  var me = this;
  me.x;
  me.y;
  me.width;
  me.height;
  me.image;
  me.canvas;
  me.context;
  me.canvas_reverse;
  me.context_reverse;
  
  //Methods
  me.get_bounding_box = function(){};
  me.get_canvas = function(){};
};

/**********************************
  Animation

**********************************/
var Animation = function() {
  var me = this;
  me.frames;
  me.isLoop;
  me.isDone;
  me.current_frame;
  me.total_frames;
  
  //Methods
  me.push_frame = function(){};
  me.add_frames = function(){};
  me.play_loop = function(){};
  me.increment_frame = function(){};
  me.get_current_frame = function(){};

};

/**********************************
  GameObject

**********************************/
var GameObject = function() {
  var me = this;
  me.animations;
  me.physicsAttrs;
  
  //Methods
  me.getX = function(){};
  me.getY = function(){};
  me.initialize_animations = function(){};
  me.check_collision = function(){};
};

/**********************************
  WorldObject

**********************************/
var WorldObject = function() {
  var me = this;
  me.camera;
  me.game_tree;
  me.visible_objects;
  me.resourceLoader;
  
  //Methods
  me.initialize_game_tree = function(){};
  me.initialize_resources = function(){};
  me.set_visible_objects = function(){};
  me.update = function(){};
  me.draw = function(){};
};

/*********************************
  ResourceLoader
**********************************/
var ResourceLoader = function() {
  var me = this;
  me.resources;
  me.totalResources;
  me.totalLoaded;
  
  //Methods
  me.push_resourse = function(){};
  me.finish_loading_resource = function(){};
  me.get_progress = function(){};
};

/*********************************
  ObjectSort
**********************************/
function objectSort(left,right){
  return left.getX() - right.getX();
}