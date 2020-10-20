var express = require("express");
var Router = express.Router();
var passport = require("passport");
var User = require("../models/users");

//landing page

Router.get("/", function (req, res) {
  res.render("landing");
});

//signup route

Router.get("/register", function (req, res) {
  res.render("register");
});

//signup logic

Router.post("/register", function (req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/campgrounds");
    });
  });
});

//login form
Router.get("/login", function (req, res) {
  res.render("login");
});

//login logic its post route

Router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

//logout route
Router.get("/logout", function (req, res) {
  req.logOut();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

//exporting data to other file

module.exports = Router;
