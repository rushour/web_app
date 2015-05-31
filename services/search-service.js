var SearchHistoryRestaurant = require('../models/search').SearchHistoryRestaurant;
var SearchHistoryCategory = require('../models/search').SearchHistoryCategory;
var userService = require('./user-service');
var restaurantService = require('./restaurant-service');

exports.addSearchHistoryRestaurant = function(_searchHistoryRestaurant, next) {
	userService.findUserByID(_searchHistoryRestaurant.userID, function(err, user) {
		if (err) { 
			console.log("This error is from services/search-service.js " + err);
			return next(err, null);
		}
		if (!err && user != null) {
			// the user exists
			restaurantService.findRestaurantByID(_searchHistoryRestaurant.restaurantID, function(err, restaurant) {
				if (err) { 
					console.log("This error is from services/search-service.js " + err);
					return next(err, null);
				}
				if (!err && restaurant != null) {
					// the restaurant also exists
					var newSearchHistoryRestaurant = new SearchHistoryRestaurant({
						userID: _searchHistoryRestaurant.userID,
						restaurantID: _searchHistoryRestaurant.restaurantID
					});

					newSearchHistoryRestaurant.save(function(err, searchHistoryRestaurant) {
						if (err) {
							return next(err, searchHistoryRestaurant);
						}
						return next(null, searchHistoryRestaurant);
					});
				} else {
					// restaurant does not exits
					var error = 'Restaurant does not exist';
					next(error, null);
				};
			});
		} else {
			// user does not exits
			var error = 'User does not exist';
			next(error, null);
		};
	});
};

exports.addSearchHistoryCategory = function(_searchHistoryCategory, next) {
	userService.findUserByID(_searchHistoryRestaurant.userID, function(err, user) {
		if (err) { 
			console.log("This error is from services/search-service.js " + err);
			return next(err, null);
		}
		if (!err && user != null) {
			var newSearchHistoryCategory = new SearchHistoryCategory({
				userID: _searchHistoryCategory.userID,
				category: _searchHistoryCategory.category
			});

			newSearchHistoryCategory.save(function(err, searchHistoryCategory) {
				if (err) {
					return next(err, searchHistoryCategory);
				}
				next(null, searchHistoryCategory);
			});
		} else {
			// user does not exits
			var error = 'User does not exist';
			next(error, null);
		};
	});
};

// TODO get searches of user (both restaurant and category)

// TODO get users who searched for a restaurant

// TODO get users who searched for a category
