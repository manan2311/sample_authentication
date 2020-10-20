var express = require('express');
let methodOverride = require('method-override');
var Router = express.Router({ mergeParams: true });
var campground = require('../models/campground');

//index route _show campgrounds

Router.get('/campgrounds', function(req, res) {
	console.log(req.user);
	campground.find({}, function(err, allcampgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', {
				campgrounds: allcampgrounds,
				currentUser: req.user
			});
		}
	});

	// res.render("campgrounds", { campgrounds: campgrounds });
});

//create route

Router.post('/campgrounds', isLoggedIn, function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newcampgrounds = { name: name, image: image, description: description };
	console.log(req.user);

	campground.create(newcampgrounds, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/campgrounds');
		}
	});
});

//new route ___ show form
Router.get('/campgrounds/new', isLoggedIn, function(req, res) {
	res.render('campgrounds/new');
});

//personal data

//comments

Router.get('/campgrounds/:id', function(req, res) {
	campground.findById(req.params.id).exec(function(err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			console.log(foundCampground);
			res.render('campgrounds/show', { campgrounds: foundCampground });
		}
	});
});

//edit campground route

Router.get('/campgrounds/:id/edit', function(req, res) {
	//is user logged in
	if (req.isAuthenticated()) {
		campground.findById(req.params.id, function(err, foundCampground) {
			if (err) {
				console.log('error');
				res.redirect('/campgrounds');
			} else {
				console.log(req.user._id);
				console.log(foundCampground.author.id);
				res.render('campgrounds/edit', { campground: foundCampground });
				console.log('ok1');
			}
		});
	} else {
		console.log('you need to be logged in');
		res.redirect('/login');
	}
	//does user own the campground

	//otherwise redirect

	//if not redirect
});

//update campground route

Router.put('/campgrounds/:id', function(req, res) {
	campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if (err) {
			console.log('ok2');
			res.redirect('/campgrounds');
		} else {
			console.log('ok3');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

//Destroy campground route

Router.delete('/campgrounds/:id', isLoggedIn, function(req, res) {
	if (req.isAuthenticated()) {
		campground.findByIdAndRemove(req.params.id, function(err) {
			if (err) {
				res.redirect('/campgrounds');
				console.log('fine');
			} else {
				res.redirect('/campgrounds');
			}
		});
	}
});

//Middle_Ware

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/login');
}

module.exports = Router;
