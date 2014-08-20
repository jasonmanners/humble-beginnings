/************************************
  Constants
*************************************/
const WIN     = 42;
const LOSE    = 43;
const PAUSED  = 44;
const STOPPED = 45;
const RUNNING = 46;

/************************************
  RequestAnimationFrame declaration
*************************************/
var requestAnimationFrame =   window.mozRequestAnimationFrame     || 
                              window.webkitRequestAnimationFrame  ||
                              function(/* function */ callback, /* DOMElement */ element){
                                 window.setTimeout(callback, 1000 / 60, new Date());
                              };
var startTime = window.mozAnimationStartTime || Date.now();

/************************************
  World
*************************************/
function World() {
  this.gameState;
  this.context;
}

World.prototype.draw() {

}

World.prototype.update(delta_time) {

}

World.prototype.run(timestep) {
  var drawStart   = (timestamp || Date.now());
  var delta_time  = drawStart - startTime;
  
  if(this.gameState.currentState === RUNNING) {
    this.update(delta_time);
    this.draw(this.context);
    requestAnimationFrame(this.run.bind(this));
  }
  startTime = drawStart;
}

/************************************
  GameState
*************************************/
function GameState() {
  this.currentState = STOPPED:
  this.currentLevel;
}

GameState.prototype.setLevel(level)  {
  this.currentLevel = level;
}

GameState.prototype.setState(state) {
  this.currentState = state;
}

/************************************
  Level
*************************************/
function Level() {
}

Level.prototype.darw() {
}
/************************************
  Tower
*************************************/
function Tower() {
}

Tower.prototype.draw() {
}
/************************************
  Enemy
*************************************/
function Enemy() {
  
}

Enemy.prototype.update(delta_time) {
  
}

Enemy.prototype.draw() {
}

/************************************
  Base
*************************************/
function Base() {
}

Base.prototype.update(delta_time) {
}

Base.prototype.draw() {
}