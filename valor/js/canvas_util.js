/******************************************
  A collection of functions used often
  by canvas applications
 ******************************************/
function rect(x,y,w,h,color,context) {
  context.save();  
    context.fillStyle = color;
    context.beginPath();
    context.rect(x,y,w,h);
    context.closePath();
    context.fill();
  context.restore();
}

function circle(x,y,r,color,context) {
  context.save();
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2, true);
    context.closePath();
    context.fill();
  context.restore();
}

function clear(width,height,color,context) {
  context.clearRect(0, 0, width, height);
  rect(0,0,width,height,color,context);
}