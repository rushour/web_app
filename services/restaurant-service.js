var Restaurant = require('../models/restaurant').Restaurant;

exports.addRestaurant = function(_restaurant, next) {
	var newRestaurant = new Restaurant({
		name: _restaurant.name,
		clientname: _restaurant.clientname,
		password: _restaurant.password,
		address: _restaurant.address,
		city: _restaurant.city,
		country: _restaurant.country,
		latitude: _restaurant.latitude,
		longitude: _restaurant.longitude,
		currentRush: _restaurant.currentRush,
		imageUrl: _restaurant.imageUrl
	});

	newRestaurant.save(function(err, restaurant) {
		if (err) {
			return next(err, restaurant);
		}
		next(null, restaurant);
	});
};

exports.getAllRestaurants = function(next) {
	Restaurant.find({}, function(err, restaurants) {
		next(err, restaurants);
	});
};

exports.findRestaurantByClientname = function(_clientname, next) {
	Restaurant.findOne({clientname: _clientname}, function(err, restaurant) {
		next(err, restaurant);
	});
};

exports.findRestaurantByID = function(id, next) {
	Restaurant.findOne({_id: id}, function(err, restaurant) {
		next(err, restaurant);
	});
};

exports.deleteRestaurantByClientname = function(_clientname, next) {
	Restaurant.remove({clientname: _clientname}, function(err, restaurant) {
		next(err, restaurant);
	});
};