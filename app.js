let express = require('express');
let app = express();
var bodyParser = require('body-parser');
let passport = require('passport');
let localStrategy = require('passport-local');
let mongoose = require('mongoose');
let campground = require('./models/campground');
let methodOverride = require('method-override');
let User = require('./models/users.js');

var port = process.env.port || 3001;

//Requiring the Routes


let campgroundRoutes = require('./routes/campground');
let indexRoutes = require('./routes/index');

//connecting mongoose

mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

//seedDB();

app.use(
	require('express-session')({
		secret: 'anythig',
		resave: false,
		saveUninitialized: false
	})
);

//Using Passport

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

app.use(indexRoutes);

app.use(campgroundRoutes);

app.listen(port, () => console.log(' i am listening'));
