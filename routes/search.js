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
	searchService.addSearchHistoryRestaurant(req.body, function(err, searchHistoryRestaurant) {
		if (err) {
			console.log("This error is from routes/search.js = " + err);
			// == start ==
			// == for html response ==
			// var vm = {
			// 	title: 'Create restaurant search history',
			// 	input: req.body,
			// 	error: err
			// };
			// return res.render('search/createSearchHistoryRestaurant', vm); // in case of error
			// == end ==
		  return res.status(500).json({error: 'Failed to add restaurant search history'}); // in case of error
		}
		// == start ==
		// == for html response ==
		// var vm = {
		// 	title: 'Create restaurant search history',
		// 	message: 'Successfully added search history'
		// };
		// res.render('search/createSearchHistoryRestaurant', vm); // in case of success
		// == end ==
		res.json(searchHistoryRestaurant); // in case of success
	});
});

/* GET search/api/createSearchHistoryCategory. */
router.get('/createSearchHistoryCategory', function(req, res, next) {
	var vm = {
		title: 'Create category search history'
	};
  res.render('search/createSearchHistoryCategory', vm);
});

/* POST search/createSearchHistoryCategory. */
router.post('/createSearchHistoryCategory', function(req, res, next) {
	searchService.addSearchHistoryCategory(req.body, function(err, searchHistoryCategory) {
		if (err) {
			console.log("This error is from routes/search.js = " + err);
			// == start ==
			// == for html response ==
			// var vm = {
			// 	title: 'Create restaurant search history',
			// 	input: req.body,
			// 	error: err
			// };
		  // return res.render('search/createSearchHistoryCategory', vm); // in case of error
		  // == end ==
		  return res.status(500).json({error: 'Failed to add category search history'}); // in case of error
		}
		// == start ==
		// == for html response ==
		// var vm = {
		// 	title: 'Create restaurant search history',
		// 	message: 'Successfully added search history'
		// };
		// res.render('search/createSearchHistoryCategory', vm); // in case of success
		// == end ==
		res.json(searchHistoryCategory); // in case of success
	});
});

module.exports = router;
