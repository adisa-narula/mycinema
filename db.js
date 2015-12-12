var mongoose = require('mongoose');
var localPassport = require('passport-local-mongoose');

//add email - username, password and salt already added
var User = new mongoose.Schema({});
User.plugin(localPassport);

//install plugin
var Movie = new mongoose.Schema({
    title:String,
    year:String,
    rating: Number,
    genre: String,
    director:String,
    poster_url: String
});

var Show = new mongoose.Schema({

  title:String,
  year:String,
  rating: Number,
  genre: String,
  poster_url: String
});

var Statistic = new mongoose.Schema({
    username:String, total: Number, movies: Number,
    shows: Number, documentary: Number, action: Number,
    drama: Number, adventure: Number, animation: Number,
    comedy: Number, crime: Number,family: Number,
    kids: Number, fantasy: Number, history: Number, horror: Number,
    mystery: Number, sci_fi: Number, thriller: Number, war: Number,
    western: Number, reality: Number, news: Number
});

var Profile = new mongoose.Schema({
  first_name:{type:String, required: [true, 'Firstname is required']},
  last_name: {type:String, required: [true, 'Lastname is required']},
  username: {type:String, required: [true, 'Username is required']},
  age: {type:Number, required: [true, 'Age is required']},
  movies:[Movie],
  shows:[Show]
});

var MovieGenre = new mongoose.Schema({
  id: Number,
  name:String,
  pages:Number
});

var TVGenre = new mongoose.Schema({
  id: Number,
  name:String,
  pages:Number
});


//registering models
mongoose.model('Movie', Movie);
mongoose.model('Show', Show);
mongoose.model('User', User);
mongoose.model('Statistic', Statistic);
mongoose.model('Profile', Profile);
mongoose.model('MovieGenre', MovieGenre);
mongoose.model('TVGenre', TVGenre);
mongoose.connect('mongodb://localhost/moviedb');
