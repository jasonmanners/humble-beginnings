 // shim layer with setTimeout fallback
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
 
 
    // usage: 
    // instead of setInterval(render, 16) ....
 
    (function animloop(){
      render();
      requestAnimFrame(animloop, element);
    })();
    
    
//More Refined
(function(){

    // chrome shipped without the time arg in m10
    var timeundefined = false;
    if (window.webkitRequestAnimationFrame){
        webkitRequestAnimationFrame(function(time){
            timeundefined = (time == undefined);
        });
    }

    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              (window.webkitRequestAnimationFrame && !timeundefined) || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(callback, element){
                window.setTimeout(function(){callback(+new Date);
                }, 1000 / 60);
              };
    })();

})();