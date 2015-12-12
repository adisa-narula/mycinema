document.addEventListener('DOMContentLoaded', init);

function init() {
  //make the http request
  var id = document.getElementById('movie-picked').getAttribute('value');
  var tv = document.getElementById('tv-selected').getAttribute('value');
  console.log(id);
  if(!tv) {
    document.getElementById('watch-decision').style.display = "inline";
    castandcrew(id,"movie");
    poster(id,"movie");
  }
  else {
    document.getElementById('watch-tv').style.display = "inline";
    castandcrew(id,"tv");
    poster(id,"tv");
  }
}
function castandcrew(id, choice) {
  var req = new XMLHttpRequest(),
  url = 'https://api.themoviedb.org/3/'+choice+'/'+id+'/credits?api_key=6421e3bd9fe17bbc36b42e30bf4e1c4f';
  console.log(url);
  req.open('GET', url, true);

  req.addEventListener('load', function() {
      if (req.status >= 200 && req.status < 400) {
        var repos = JSON.parse(req.responseText);
        console.log(repos);
        var credit_id = repos.id;
        var crew = repos.crew;
        var cast = repos.cast;
        var director;
        crew.forEach(function(member) {
          if (member.job === "Director") {
            director = member.name;
          }
        });
        //add to the table
        if(choice == "movie") {
          document.getElementById('director').textContent = director;
          document.getElementById('movie_director').value = director;
        }

        //get the first three actors or cast
        for (var i = 0; i < 3; i++) {
          if (cast.length === 0) {
            document.getElementById('actors').textContent += "Unknown";
            break;
          }
          else {
            document.getElementById('actors').textContent += cast[i].name + ", ";
          }
        }

        var rating = document.getElementById('rating').value;
        rating = Math.ceil(+rating);
        console.log(typeof rating);
        var star_rating = document.createElement('div');
        star_rating.setAttribute('id', 'star-rating');
        for (var a = 0; a < rating; a++) {
          var s = document.createElement('img');
          s.setAttribute('src', '/images/star1.png');
          s.className = "pop-rating";
          star_rating.appendChild(s);
        }
        document.getElementById('s-rating').appendChild(star_rating);
      }
    });
    //error handler
    req.addEventListener('error', function() {
      console.log('uh oh');
    });
    req.send();
}

function poster(id, choice) {
  var req = new XMLHttpRequest(),
  url = 'https://api.themoviedb.org/3/'+choice+'/'+id+'/images?api_key=6421e3bd9fe17bbc36b42e30bf4e1c4f&language=en&include_image_language=en,null';
  console.log(url);
  req.open('GET', url, true);

  req.addEventListener('load', function() {
      if (req.status >= 200 && req.status < 400) {
        var repos = JSON.parse(req.responseText);
        //make another request to get the actual image
        var p = repos.posters;
        var winner = p[0];
        for (var a = 0; a < p.length; a++) {
          var pos = p[a];
          if ((pos.width) && (pos.width === 500)) {
            console.log(pos);
            w = pos.width;
            winner = pos;
          }
        }
        console.log(winner.width);
        console.log(winner.file_path);

        url_img = 'http://image.tmdb.org/t/p/w500'+winner.file_path;

        if (choice == "movie") {
          document.getElementById('poster_link').value = url_img;
        }
        else {
          document.getElementById('poster_tv').value = url_img;
        }

        var poster = document.createElement('img');
        poster.setAttribute('src', url_img);
        poster.setAttribute('height', 444);
        poster.setAttribute('width', 300);
        poster.setAttribute('alt', 'Could not find the movie poster');
        document.getElementById('poster-img').appendChild(poster);
      }
    });
    //error handler
    req.addEventListener('error', function() {
      console.log('uh oh');
    });

    req.send();
}
