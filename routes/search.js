var express = require('express');
var router = express.Router();
var searchService = require('../services/search-service');
var restaurantService = require('../services/restaurant-service');

/* GET search home page. */
router.get('/', function(req, res, next) {
	console.log(req.query.searchTerm);
	restaurantService.regexSearch(req.query.searchTerm, function(err, result) {
		if (err) {
			return res.status(404).json(err);
		}
		res.json(result);
	});
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
		  return res.status(500).json({error: 'Failed to add restaurant search history'}); // in case of error
		}
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
		  return res.status(500).json({error: 'Failed to add category search history'}); // in case of error
		}
		res.json(searchHistoryCategory); // in case of success
	});
});

/* GET /search. For autocomplete etc. */
router.get('/search', function(req, res) {
   
});

module.exports = router;
