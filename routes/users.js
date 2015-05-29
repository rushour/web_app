var express = require('express');
var router = express.Router();
var userService = require('../services/user-service');
var passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
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
	userService.addUser(req.body, function(err) {
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
		req.login(req.body, function(err) {
			res.redirect('/users/home'); // in case of success
		});
	});
});

/* GET users/home. */
router.get('/home', function(req, res, next) {
	var vm = {
		title: req.user ? req.user.firstName : 'Home Page',
		firstName: req.user ? req.user.firstName : null
	};
  res.render('users/home', vm);
});

/* POST users/login. */
router.post('/login', passport.authenticate('local'), function(req, res, next) {
	res.redirect('/home');
});


module.exports = router;
