var WORLD_WIDTH = 800;
var WORLD_HEIGHT = 600;

var MENU_WIDTH = 250;

function init() {
  var worldWidth = window.innerWidth/2 - (WORLD_WIDTH/2);
  var menuWidth = window.innerWidth/2 - (MENU_WIDTH/2);
  $("#menu").css("left",menuWidth+"px");
  $("#world").css("position","absolute");
  $("#world").attr({ width: WORLD_WIDTH, height: WORLD_HEIGHT });
  $("#world").css("left",worldWidth+"px");
  $("#world").css("top","20px");

}

init();