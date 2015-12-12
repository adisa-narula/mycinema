//use client side javascript to add another form
document.addEventListener('DOMContentLoaded', init);

//add event listender to movie
function init() {

  document.getElementById('movie-btn').addEventListener('click', movieClick);
  document.getElementById('tv-btn').addEventListener('click', tvClick);
}

function movieClick() {
  console.log("movie was clicked");
  //show movie form
  //hide tv

  document.getElementById('tv_form').style.display = "none";
  document.getElementById('submit_form').style.display = "block";

  var movie_form = document.getElementById('movie_form');
  movie_form.style.display = "block";
  //change value of hidde field
  var result = document.getElementById('user-selection');
  result.value = "movie";
}

function tvClick() {
  console.log("tv was clicked");
  document.getElementById('movie_form').style.display = "none";
  document.getElementById('submit_form').style.display = "block";

  var tv_form = document.getElementById('tv_form');
  tv_form.style.display = "block";
  //change value of hidde field
  var result = document.getElementById('user-selection');
  result.value = "tv";
}
