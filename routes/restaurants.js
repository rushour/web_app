var express = require('express');
var router = express.Router();
var restaurantService = require('../services/restaurant-service');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// TODO update restaurant

/* GET restaurants listing. */
router.get('/', function(req, res, next) {
  restaurantService.getAllRestaurants(function(err, restaurants) {
  	if (err) {
  		return res.status(500).json({error: err});
  	}
  	res.json(restaurants);
  })
});

/* GET restaurants/details/:clientname. */
router.get('/details/:restaurantID', function(req, res, next) {
	restaurantService.findRestaurantByID(req.params.restaurantID, function(err, restaurant) {
		if (err) {
			return res.status(500).json({error: err});
		}
		res.json(restaurant);
	});
});

/* DELETE restaurants/delete/:clientname. */
router.delete('/delete/:restaurantID', function(req, res, next) {
	restaurantService.deleteRestaurantByID(req.params.restaurantID, function(err, restaurant) {
		if (err) {
			return res.status(500).json({error: err});
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