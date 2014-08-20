// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

var my_context;

function setNavAnimations() {
  $(".nav_button").each(function () {
    var sectionToGo = $(this).attr("section");
    var topOffset = $("#" + sectionToGo).css("top");
    var leftOffset = $("#" + sectionToGo).css("left");
    var thisWidth = $("#" + sectionToGo).css("width");
    var thisColor = $(this).css("backgroundColor");
    topOffset = topOffset.replace("px", "") - 100;
    leftOffset = leftOffset.replace("px", "") - (thisWidth.replace("px", "") / 2);
    $(this).click(function () {
      $("html,body").animate({
        scrollTop: topOffset,
        scrollLeft: leftOffset
      }, 750);
      $("#container").animate({
        backgroundColor: thisColor
      }, 750);
    });
  });
}

function setPositions() {
  $(".info_section").each(function () {
    var thisWidth = $(this).css("width");
    var thisCol = $(this).attr("colNum");
    var newLeft = (window.innerWidth / 2 - thisWidth.replace("px", "") / 2) + (thisCol * window.innerWidth);
    console.log(window.innerWidth);
    console.log(thisWidth);
    $(this).css("left", newLeft);
  });
  $("#scrollRight").click(function () {
    var initialPos = $("#games_window").scrollLeft();
    var newPos = initialPos + 150;
    $("#games_window").animate({
      scrollLeft: newPos
    }, 500);
  });
  $("#scrollLeft").click(function () {
    var initialPos = $("#games_window").scrollLeft();
    var newPos = initialPos - 150;
    $("#games_window").animate({
      scrollLeft: newPos
    }, 500);
  });
}

function initCanvas() {
var worldWidth = window.innerWidth / 2 - (this.WORLD_WIDTH / 2);

  $("#background_canvas").attr({
    width: window.innerWidth+10,
    height: window.innerHeight+10
  });
  
  $("#background_canvas").css("border", "1px solid #000000");
  my_context = $("#background_canvas")[0].getContext("2d");
}
//Order matters
$(document).ready(function () {
  setPositions();
  setNavAnimations();
  initCanvas();
});