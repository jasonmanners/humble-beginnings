function circle(x,y,r,context) {
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI*2, true);
  context.closePath();
  context.fill();
}

function rect(x,y,w,h,context) {
  context.beginPath();
  context.rect(x,y,w,h);
  context.closePath();
  context.fill();
}

function clear(width,height,context) {
  context.clearRect(0, 0, width, height);
  rect(0,0,width,height,context);
}