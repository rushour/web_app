var RushAtRestaurant = require('../models/rush').RushAtRestaurant;

exports.addRushAtRestaurant = function(_rushAtRestaurant, next) {
	var newRushAtRestaurant = new RushAtRestaurant({
		restaurantID: _rushAtRestaurant.restaurantID,
		rush: _rushAtRestaurant.rush
	});

	newRushAtRestaurant.save(function(err, newRushAtRestaurant) {
		if (err) {
			return next(err, newRushAtRestaurant);
		}
		next(null, newRushAtRestaurant);
	});
};

exports.getRushHistoryOfRestaurant = function(_restaurantID, next) {
	RushAtRestaurant.find({restaurantID: _restaurantID}, function(err, rushHistory) {
		next(err, rushHistory);
	});
};