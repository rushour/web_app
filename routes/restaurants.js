var express = require('express');
var router = express.Router();
var restaurantService = require('../services/restaurant-service');

// TODO update restaurant

/* GET restaurants listing. */
router.get('/', function(req, res, next) {
  restaurantService.getAllRestaurants(function(err, restaurants) {
  	if (err) {
  		return res.status(500).json({error: 'Failed to retrieve restaurants'});
  	}
  	res.json(restaurants);
  })
});

/* GET restaurants/details/:clientname. */
router.get('/details/:clientname', function(req, res, next) {
	restaurantService.findRestaurantByClientname(req.params.clientname, function(err, restaurant) {
		if (err) {
			return res.status(500).json({error: 'Failed to retrieve restaurant details'});
		}
		res.json(restaurant);
	});
});

/* DELETE restaurants/delete/:clientname. */
router.delete('/delete/:clientname', function(req, res, next) {
	restaurantService.deleteRestaurantByClientname(req.params.clientname, function(err, restaurant) {
		if (err) {
			return res.status(500).json({error: 'Failed to delete restaurant'});
		}
		res.json({message: 'Successfully deleted restaurant'});
	});
});

/* GET restaurants/create. */
router.get('/create', function(req, res, next) {
	var vm = {
		title: 'Add restaurant'
	};
  res.render('restaurants/create', vm);
});

/* POST restaurants/create. */
router.post('/create', function(req, res, next) {
	restaurantService.addRestaurant(req.body, function(err, restaurantSaved) {
		if (err) {
			console.log("This error is from routes/restaurants.js = " + err);
			var vm = {
				title: 'Add restaurant',
				input: req.body,
				error: err
			};
		  return res.render('restaurants/create', vm); // in case of error
		}
		res.redirect('/'); // in case of success
		// TODO send success message to next page
	});
});

module.exports = router;