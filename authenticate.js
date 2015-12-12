var mongoose = require('mongoose');
var passport = require('passport');
var strategy = require('passport-local').Strategy; //gives us our strategy
var User = mongoose.model('User');

//set up middleware
passport.use(new strategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
