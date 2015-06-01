var express = require('express');
var router = express.Router();
var userService = require('../services/user-service');
var passport = require('passport');
var config = require('../config');

// == start ==
// for file uploading
var busboy = require('connect-busboy');
var path = require('path'); //used for file path
var fs = require('fs-extra'); 
var http = require('http'), inspect = require('util').inspect;
// == end ==

//TODO add bcrypt to passwords
//TODO edit users
//TODO view user details json

/* GET users listing. */
router.get('/', function(req, res, next) {
	// TODO think of suitable functionality for this (route to home if logged in, else login page)
  res.send('respond with a resource');
});

/* GET users/create. */
router.get('/create', function(req, res, next) {
	var vm = {
		title: 'Create an account'
	};
  res.render('users/create', vm);
});

/* POST users/create. */
router.post('/create', function(req, res, next) {
	console.log(req.body);
	userService.addUser(req.body, function(err, userSaved) {
		if (err) {
			console.log("This error is from routes/users.js = " + err);
			var vm = {
				title: 'Create an account',
				input: req.body,
				error: err
			};
			delete vm.input.password;
		  return res.render('users/create', vm); // in case of error
		}
		req.login(userSaved, function(err) {
			res.redirect('/users/home'); // in case of success
		});
	});
});

/* GET users/home. */
router.get('/home', ensureAuthenticated, function(req, res, next) {
	userService.findUserByID(req.session.passport.user, function(err, _user) {
		if (err) {
			console.log(err);
	 	} else {
	 		_user.imageUrl = config.network.IP + ':' + config.network.port + _user.imageUrl;
			res.render('users/home', {user: _user});
	 	}
	});
});

/* POST users/imageUpload. */
router.post('/imageUpload', function(req, res, next) {
	// TODO limit file upload size
	var fstream;
	var filenameOfImage;
	var encounteredError = false;
	req.pipe(req.busboy);
	req.busboy.on('file', function (fieldname, file, filename) {
		console.log("Uploading: " + filename);
		filenameOfImage = filename;
		try {
			fstream = fs.createWriteStream(config.imageUploadDirectoryUsers + filename);
			file.pipe(fstream);
			fstream.on('close', function () {
				console.log("Upload finished of: " + filename);
			});	
		} catch (err) {
			console.log("This error is from routes/users.js = " + err);
			encounteredError = true;
		}
	});
	if (!encounteredError) {
		req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
			if (fieldname == "userID") {
				var imageUrl = "/images/profilePictures/" + filenameOfImage;
				userService.addImageToUser(val, imageUrl, function(err, user) {
					if (err) {
						console.log("This error is from routes/users.js = " + err);
						return res.redirect('/users/home');
					} else {
						res.redirect('/users/home');
					}
				});
			}
		});
	} else  {
		res.redirect('/users/home');
	}
});

/* POST users/login. */
router.post('/login', passport.authenticate('local'), function(req, res, next) {
	res.redirect('/users/home');
});

/* GET users/login. */
router.get('/login', function(req, res, next) {
	var vm = {
		title: 'Login'
	};
  res.render('users/login', vm);
});

/* GET users/auth/facebook. */
router.get('/auth/facebook', passport.authenticate('facebook'));

/* GET users/auth/facebook/callback. */
router.get('/auth/facebook/callback',
	passport.authenticate('facebook', {
		failureRedirect: '/'
	}),
	function(req, res) {
		console.log("User " + req.session.passport.user + " has signed in successfully");
		res.redirect('/users/home');
	});

/* GET users/logout. */
router.get('/logout', function(req, res){
	req.logout();
	req.session.destroy();
	res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/')
}

module.exports = router;