var my_context;

function initCanvas() {
  var worldWidth = window.innerWidth / 2 - (this.WORLD_WIDTH / 2);

  $("#background_canvas").attr({
    width: window.innerWidth+10,
    height: window.innerHeight+10
  });
  
  $("#background_canvas").css("border", "1px solid #000000");
  my_context = $("#background_canvas")[0].getContext("2d");
}

function circle(x,y,r,context) {
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI*2, true); //*2
  context.fill();
}

function Point(x,y) {
  var x2 = Math.random()*800;
  var y2 = Math.random()*800;
  var eX = Math.random()*800;
  var eY = Math.random()*800;
  this.x1 = x;
  this.y1 = y;
  this.x2 = x2;
  this.y2 = y2;
  this.eX = eX;
  this.eY = eY;
  this.factor = 0.1;
}

var points = [];
points.push(new Point(100,100));
function startAnimations() {
  my_context.clearRect(0,0,window.innerWidth,window.innerHeight);
  my_context.strokeStyle = "#FFFFFF";
  my_context.lineWidth = 15;
  //circle(Math.random()*window.innerWidth,Math.random()*window.innerHeight,Math.random()*50,my_context);
  my_context.beginPath();
  my_context.moveTo(75,25);
  for(var i = 0; i < points.length; i++) {
    my_context.bezierCurveTo(points[i].x1,points[i].y1,points[i].x2,points[i].y2,points[i].eX*points[i].factor,points[i].eY*points[i].factor);
    points[i].factor += 0.01;
  }
  my_context.stroke();
  
  //points.push(new Point(points[points.length-1].eX,points[points.length-1].eY));
}

//Order matters
$(document).ready(function() { 
  initCanvas();
  intervalID = setInterval(startAnimations,30);
});