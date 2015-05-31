var express = require('express');
var router = express.Router();
var rushService = require('../services/rush-service');

/* GET rush/history/:restaurantID. */
router.get('/history', function(req, res, next) {
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
	var vm = {
		title: 'Add rush for restaurant'
	};
  res.render('rush/create', vm);
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

module.exports = router;