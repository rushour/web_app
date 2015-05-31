var express = require('express');
var router = express.Router();
var searchService = require('../services/search-service');

/* GET search home page. */
router.get('/', function(req, res, next) {
	res.redirect('/search/home');
});

/* GET search/home. */
router.get('/home', function(req, res, next) {
	var vm = {
		title: 'Create search history'
	};
  res.render('search/home', vm);
});

/* GET search/createSearchHistoryRestaurant. */
router.get('/createSearchHistoryRestaurant', function(req, res, next) {
	var vm = {
		title: 'Create restaurant search history'
	};
  res.render('search/createSearchHistoryRestaurant', vm);
});

/* POST search/createSearchHistoryRestaurant. */
router.post('/createSearchHistoryRestaurant', function(req, res, next) {
	searchService.addSearchHistoryRestaurant(req.body, function(err, searchSaved) {
		if (err) {
			console.log("This error is from routes/search.js = " + err);
			var vm = {
				title: 'Create restaurant search history',
				input: req.body,
				error: err
			};
		  return res.render('search/createSearchHistoryRestaurant', vm); // in case of error
		}
		var vm = {
			title: 'Create restaurant search history',
			message: 'Successfully added search history'
		};
		res.render('search/createSearchHistoryRestaurant', vm); // in case of success
	});
});

module.exports = router;
