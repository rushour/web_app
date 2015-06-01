var express = require('express');
var router = express.Router();
var rushService = require('../services/rush-service');
var userService = require('../services/user-service');

/* GET rush/history/:restaurantID. */
router.get('/history/:restaurantID', function(req, res, next) {
  rushService.getRushHistoryOfRestaurant(req.params.restaurantID, function(err, rushHistory) {
  	if (err) {
  		console.log("This error is from routes/rush.js = " + err);
  		return res.status(500).json({error: err}); // in case of error
  	}
  	res.json(rushHistory); // in case of success
  });
});

/* GET rush/create. */
router.get('/create', function(req, res, next) {
	userService.ensureAdmin(req.session.passport.user, function(err, user) {
		if (err) {
			return res.render('error', { error: 404, message: "You don't have the permission to access this page." });	
		} else {
			var vm = {
				title: 'Add rush for restaurant'
			};
		  res.render('rush/create', vm);
		}
	});
});

/* POST rush/create. */
router.post('/create', function(req, res, next) {
	rushService.addRushAtRestaurant(req.body, function(err, rushSaved) {
		if (err) {
			console.log("This error is from routes/rush.js = " + err);
			return res.status(500).json({error: err}); // in case of error
		}
		res.json(rushSaved); // in case of success
	});
});

router.get('/prediction/:restaurantID', function(req, res, next) {
	var numPredictions = 10; // number of future slots to predict
	rushService.getPrediction(req.params.restaurantID, numPredictions, function(err, prediction) {
		if (err) {
			console.log("This error is from routes/rush.js = " + err);
			return res.status(500).json({error: err}); // in case of error
		}
		res.json(prediction);
	});
});

module.exports = router;