ig.baked=true;ig.module('game.entities.mortarquake').requires('game.entities.trigger').defines(function(){
EntityMortarquake=ig.Entity.extend(
{
_wmDrawBox:true,_wmBoxColor:'rgba(80, 130, 170, 0.7)',
  size:{x:8,y:8},
  duration:2,
  strength:10,
  screen:{x:0,y:0},
  quakeTimer:null,
  init:function(x,y,settings){
    this.quakeTimer=new ig.Timer();
    this.quakeTimer.set(this.duration);
    this.parent(x,y,settings);
  },
  kill:function(){
    this.parent();
  },
  update:function(){
    var delta=this.quakeTimer.delta();
    if(delta<-0.1){
      var s=this.strength*Math.pow(-delta/this.duration,2);
      if(s>0.5){
        ig.game.screen.x+=Math.random().map(0,1,-s,s);
        ig.game.screen.y+=Math.random().map(0,1,-s,s);
      }
    }
    if(delta>0){this.quakeTimer=null;this.kill();}}});});