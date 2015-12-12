
$(document).ready(function(){

  $("button").hover(function(){
    $(this).css("padding", "7px 17px");
    }, function(){
    $(this).css("padding", "5px 15px");
});

  $("#summary").hide();
  $("#showSum-btn").click(function(){
    $("#summary").toggle();
  });

  // $("#stats").hide();
  // $("#stats-button").click(function() {
  //   event.preventDefault();
  //   window.location.hash = "#stats";
  //   $("#stats").slideToggle(100);
  // });

  $("#stats").hide();
  $("#stats-button").click(function() {
    $("#stats").slideToggle(500);
  });

  $("#no-movies").append("You haven't watched anything yet. Better get going!");

  $("#canvasOne").mouseover(function(){
    $("#bar-chart").css("opacity", "0.55");
  });
  $("#canvasOne").mouseout(function(){
    $("#bar-chart").css("opacity", "1");
  });

  $("#canvasTwo").mouseover(function(){
    $("#pie-chart").css("opacity", "0.55");
  });
  $("#canvasTwo").mouseout(function(){
    $("#pie-chart").css("opacity", "1");
  });
});
