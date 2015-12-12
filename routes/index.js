
/*Link to data visualization using D3 and node.js to retrive information from MongoDB
https://anmolkoul.wordpress.com/2015/06/05/interactive-data-visualization-using-d3-js-dc-js-nodejs-and-mongodb/ */


var mongoose = require('mongoose');
var express = require('express');
var passport = require('passport');
var User = mongoose.model('User');
var Profile = mongoose.model('Profile');
var Stat = mongoose.model('Statistic');
var MovieGenre = mongoose.model('MovieGenre');
var TVGenre = mongoose.model('TVGenre');
var request = require('request');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {

  if (req.session.username) {
        res.redirect(303, '/select');
  }

  else {
    console.log('in home', req.session.username);
    res.render('home');
  }
});

router.post('/home', function (req, res, next) {

  console.log(req.body.login);
  var login = req.body.login;
  if (login == "Register") {
    res.render('register');
  }
  else {
    res.render('login');
  }
});

router.get('/about', function (req, res, next) {
  res.render('about', {user: req.session.username});
});

router.get('/register', function (req, res) {
  res.render('register');
});

router.post('/register', function (req, res) {
  console.log(req.body);
  //if user name doesn't exist already let the user register
  req.session.username = req.body.username;
  console.log(req.body.first_name);
  // req.ression.first = req.body.first_name;

  User.findOne({username:req.session.username}, function (err, user, count) {
    //no user found - register
    if (!user) {
        var profile = new Profile ({
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        username:req.body.username,
        age:req.body.age
      });
          //save user profile in db
      profile.save(function(err, p, count) {
        if(err) {
          console.log('Error saving user profile');
          console.log(err);
          res.render('register', {err:err});
        }
        else { // create user statistics object
          var stat = new Stat ({
            username:req.body.username,
            total: 0, movies: 0, shows: 0, documentary: 0,action: 0, drama: 0,
            adventure: 0, animation: 0, comedy: 0, crime: 0, family: 0,
            kids: 0, fantasy: 0, history: 0, horror: 0, mystery: 0, sci_fi: 0,
            thriller: 0, war: 0, western: 0, reality: 0, news: 0
          });
          stat.save(function (err, statistic, count) {
            if (err) {
              console.log("Error saing user statistics", err);
            }
            else {
              console.log("saved user statistics", statistic);
              //register user
              User.register(new User({username:req.body.username}), req.body.password, function (err, user) {
                if (err) {
                  res.render('register', {error:'Registration information is invalid. Please try again.'});
                } else {
                  console.log('registered');
                  console.log(user);
                  passport.authenticate('local')(req, res,function() {
                    res.redirect('/select');
                  });
                }
              });
            }
          });
        }
      });
    }
    else {
      console.log("This username already exists, please choose another one");
      res.render('register', {error: "The username " +req.body.username+" already exists. Please choose another one"});
    }
  });
});

router.get('/login', function (req, res) {
  res.render('login');
});

router.post('/login', function(req,res,next) {

  passport.authenticate('local', function(err,user) {
    if(user) {
      req.logIn(user, function(err) {
        req.session.username = req.body.username;
        res.redirect('/select');
      });
    } else {
      res.render('login', {error:'Log in information is invalid. Please try again.'});
    }
  })(req, res, next);
});

//add middleware as guard to access the rest of the website
router.use(function(req,res,next){

  // console.log("User hasn't logged in");
  if (req.session.username == undefined) {
    res.render('home', {warning:'Please login in or register'});
  }
  else {
    next();
  }
});

router.get('/select', function(req, res) {
  //make a request
  //api key - 6421e3bd9fe17bbc36b42e30bf4e1c4f
  //reading in user info from data base - this is where graph for user preferences will be displayed
  //save user in sessions (?)
  console.log(req.session.username);
  console.log("current user:", req.session.username);

  MovieGenre.find({}, function(err, movie_genre, count) {
    TVGenre.find({}, function (err, tv_genre, count) {
      res.render('select', {movie_genre:movie_genre, tv_genre:tv_genre, user:req.session.username});
    });
  });
});

router.post('/select', function(req, res) {
  console.log(req.body);
  console.log('in select', req.session.username);

  if (req.body.result == "movie") {
    req.session.category = req.body.genre_movie;
    req.session.year = req.body.year_movie;
    // console.log('category:', req.session.category);
    res.redirect(303, '/result/movie');
  }
  else if(req.body.result == "tv") {
    req.session.category = req.body.genre_tv;
    // year = req.body.year_tv;
    console.log('category:', req.session.category);
    // console.log('year:', year);
    res.redirect(303, '/result/show');
  }
});

router.get('/result/movie', function(req, res) {

  //api_key=6421e3bd9fe17bbc36b42e30bf4e1c4f
  //find the genre id -
  var id = 0;
  var max = 19;
  var num = Math.ceil(Math.random()*max);
  var page_num = 1;

  console.log("category", req.session.category);

  MovieGenre.findOne({name: req.session.category}, function(err, genre, count) {
    console.log('found', genre);
    console.log(genre.id);
    id = genre.id;
    page_num = genre.pages;

      request('https://api.themoviedb.org/3/discover/movie?api_key=6421e3bd9fe17bbc36b42e30bf4e1c4f&with_genres='+id+'&primary_release_year='+req.session.year+'&language=en&certification_country=US', function (error,response,body) {
      if (!error && response.statusCode == 200) {
        //parse dat
        var information = JSON.parse(body);
        var movie = information.results[num];
        console.log("Movie:", movie);
        if(!movie) {
          console.log("can't find movie");
          res.render('select', {warning: "Sorry we couldn't find what you were looking for. Please try again."});
        } else {
          res.render('result', {movie:true, genre:req.session.category, body:movie, user:req.session.username});
          }
        }
      });
  });
});

router.get('/result/show', function(req, res) {

  console.log("in show result");
  console.log("category", req.session.category);

  //set default
  var id = 0;
  var max_result = 19;
  var num = Math.ceil(Math.random()*max_result); //pick a random show
  var page_num = 1;

  console.log("category", req.session.category);

  console.log(id);
  // console.log('page num', page_num);
  // 'https://api.themoviedb.org/3/discover/tv?api_key=6421e3bd9fe17bbc36b42e30bf4e1c4f&with_genres='+id+'&first_air_date_year='+req.session.year+'&language=en&certification_country=US'
  // https://api.themoviedb.org/3/discover/tv?api_key=6421e3bd9fe17bbc36b42e30bf4e1c4f&with_genres='+id+'&first_air_date_year='+year

  TVGenre.findOne({name: req.session.category}, function(err, show, count) {
    console.log("show id: " + show.id);
    id = show.id;
    page_num = show.pages;

      request('https://api.themoviedb.org/3/discover/tv?api_key=6421e3bd9fe17bbc36b42e30bf4e1c4f&with_genres='+id+'&language=en&certification_country=US&sort_by=popularity.desc', function (error,response,body) {
      if (!error && response.statusCode == 200) {
        //parse dat
        var information = JSON.parse(body);
        var tv = information.results[num];
        console.log("TV:", tv);
        if(!tv) {
          console.log("can't find movie");
          res.render('select', {warning: "Sorry we couldn't find what you were looking for. Please try again."});
        } else {
          res.render('result', {tv:true, genre:req.session.category, body:tv, user:req.session.username});
          }
        }
      });

  });

});

router.post('/decision/movie', function(req, res) {

  //if user decides to watch - save movie in db and user profile
  console.log(req.body.user_watch);
  console.log(req.body);
  console.log(req.user.username);
  var genre = req.body.genre_movie.toLowerCase();

  var decision = req.body.user_watch;
  if (decision == "Pick again") {
    res.redirect(303, '/select');
  }
  else if (decision == "Save") {
    Profile.findOne({username:req.session.username}, function (err, profile, count) {
      profile.movies.push({
        title: req.body.title_movie,
        year: req.body.year_movie,
        rating: req.body.rating_movie,
        genre: req.body.genre_movie,
        director: req.body.director_movie,
        poster_url: req.body.poster_movie
      });
      profile.save(function (saveErr, saveProfile, saveCount) {
        if (err) {
          console.log('problem saving user profile:', saveErr);
        } else {
          console.log(saveProfile);
          //update user profile and save it
          console.log(profile.first_name);
          Stat.findOne({username:req.session.username}, function (err, statistic, count) {
            console.log(statistic);
            console.log('genre:', genre);
            if (genre === "science fiction") {
              genre = "sci_fi";
            }
            statistic.total += 1;
            statistic.movies += 1;
            statistic[genre] +=1;
            statistic.save(function (statError, saveStat, saveCount) {
              if (statError) { console.log ('Error saving statistics');}
              else {
                //redirect to profile page
                console.log(saveStat);
                console.log(req.session.username);
                res.redirect(303, '/profile');
              }
            });
          });
        }
      });
    });
  }
});


router.post('/decision/show', function(req,res){

  //if user decides to watch - save movie in db and user profile
  console.log(req.body.user_watch);
  console.log(req.body);
  console.log(req.user.username);
  var genre = req.body.genre_movie.toLowerCase();
  console.log(genre);

  var decision = req.body.user_watch;
  if (decision == "Pick again") {
    res.redirect(303, '/select');
  }
  else if (decision == "Watch") {
    Profile.findOne({username:req.session.username}, function (err, profile, count) {
      profile.shows.push({
        title: req.body.title_movie,
        year: req.body.year_movie,
        rating: req.body.rating_movie,
        genre: req.body.genre_movie,
        poster_url: req.body.poster_movie
      });
      profile.save(function (saveErr, saveProfile, saveCount) {
        if (err) {
          console.log('problem saving user profile:', saveErr);
        } else {
          console.log(saveProfile);
          //update user profile and save it
          Stat.findOne({username:req.user.username}, function (err, statistic, count) {
            console.log(statistic);
            console.log('genre:', genre);
            statistic.total += 1;
            statistic.shows += 1;
            statistic[genre] += 1;
            statistic.save(function (statError, saveStat, saveCount) {
              if (statError) { console.log ('Error saving statistics');}
              else {
                //redirect to profile page
                console.log(saveStat);
                console.log(req.session.username);
                res.redirect(303, '/profile');
              }
            });
          });
        }
      });
    });
  }
});

router.get('/profile', function(req, res) {
  console.log(req.session.username);
  Profile.findOne({username:req.session.username}, function(err, profile, count) {
    if (err) {
      console.log("Could not find user:", err);
    }
    Stat.findOne({username:req.session.username}, function(err, statistic, count) {
      console.log('username', req.session.username)
      // res.render('profile', {user:profile.first_name, statistic:statistic, profile:profile});
      res.render('profile', {user:profile.first_name, statistic:statistic, profile:profile});
    });
  });
});

router.get('/logout', function(req,res) {
  req.session.destroy();
  req.logout();
  res.render('logout', {user:null});
})

module.exports = router;
