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
		category:_restaurant.category,
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

exports.deleteRestaurantByID = function(id, next) {
	Restaurant.remove({_id: id}, function(err, restaurant) {
		next(err, restaurant);
	});
};

exports.regexSearch = function(searchTerm, next) {
	var regex = new RegExp(searchTerm, 'i');
	var query = Restaurant.find({name: regex}).sort({"name":1}).limit(20);
	query.exec(function(err, result) {
		next(err, result);
	});
};

exports.addImageToRestaurant = function(_clientname, _imageUrl, next) {
	var conditions = {clientname: _clientname};
	var update = {$set: {imageUrl: _imageUrl}};
	console.log(_imageUrl);
	console.log(_clientname);
	var options = {upsert: true};
	Restaurant.update(conditions, update, options, function(err) {
		if (err) {
			return next(err, null);
		}
		next(null, "done");
	});
};