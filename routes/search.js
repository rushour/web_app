var express = require('express');
var router = express.Router();
var searchService = require('../services/search-service');
var restaurantService = require('../services/restaurant-service');
var userService = require('../services/user-service');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* GET search home page. */
router.get('/', function(req, res, next) {
	// input param is 'term'
	console.log("Search for: " + req.query.term);
	restaurantService.regexSearch(req.query.term, function(err, result) {
		if (err) {
			return res.status(404).json(err);
		}
		res.json(result);
	});
});

/* GET search/home. */
router.get('/home', function(req, res, next) {
	if (!userService.ensureAdmin(req.session.passport.user)) {
		return res.render('error', { error: 404, message: "You don't have the permission to access this page." });
	}
	var vm = {
		title: 'Create search history'
	};
  res.render('search/home', vm);
});

/* GET search/createSearchHistoryRestaurant. */
router.get('/createSearchHistoryRestaurant', function(req, res, next) {
	if (!userService.ensureAdmin(req.session.passport.user)) {
		return res.render('error', { error: 404, message: "You don't have the permission to access this page." });
	}
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
		  return res.status(500).json({error: err}); // in case of error
		}
		res.json(searchHistoryRestaurant); // in case of success
	});
});

/* GET search/api/createSearchHistoryCategory. */
router.get('/createSearchHistoryCategory', function(req, res, next) {
	if (!ensureAdmin(req.session.passport.user)) {
		return res.render('error', { error: 404, message: "You don't have the permission to access this page." });
	}
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
		  return res.status(500).json({error: err}); // in case of error
		}
		res.json(searchHistoryCategory); // in case of success
	});
});

/* GET /getUserSearchedRestaurants. For autocomplete etc. */
router.get('/getUserSearchedRestaurants/:userID', function(req, res) {
	searchService.getUserSearchedRestaurants(req.params.userID, function(err, searchHistoryRestaurants) {
		if (err) {
			console.log("This error is from routes/search.js = " + err);
			return res.status(500).json({error: err});
		}
		res.json(searchHistoryRestaurants);
	}); 
});

/* GET /getUserSearchedCategories. For autocomplete etc. */
router.get('/getUserSearchedCategories/:userID', function(req, res) {
	searchService.getUserSearchedCategories(req.params.userID, function(err, searchHistoryCategories) {
		if (err) {
			console.log("This error is from routes/search.js = " + err);
			return res.status(500).json({error: err});
		}
		res.json(searchHistoryCategories);
	}); 
});

module.exports = router;
