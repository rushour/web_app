var SearchHistoryRestaurant = require('../models/search').SearchHistoryRestaurant;
var SearchHistoryCategory = require('../models/search').SearchHistoryCategory;
var userService = require('./user-service');
var restaurantService = require('./restaurant-service');

exports.hasUserSearchedForRestaurant = function(_userID, _restaurantID, next) {
	SearchHistoryRestaurant.findOne({userID: _userID, restaurantID: _restaurantID}, function(err, searchHistoryRestaurant) {
		next(err, searchHistoryRestaurant);
	});
};

exports.hasUserSearchedForCategory = function(_userID, _category, next) {
	SearchHistoryCategory.findOne({userID: _userID, category: _category}, function(err, searchHistoryCategory) {
		next(err, searchHistoryCategory);
	});
};

exports.addSearchHistoryRestaurant = function(_searchHistoryRestaurant, next) {
	this.hasUserSearchedForRestaurant(_searchHistoryRestaurant.userID, _searchHistoryRestaurant.restaurantID, function(err, searchHistoryRestaurant) {
		// check if the user has already searched for that restaurant
		if (err) {
			console.log("This error is from services/search-service.js " + err);
			return next(err, null);
		}
		if (!err && searchHistoryRestaurant != null) {
			// user has already searched for this restaurant
			return next(null, searchHistoryRestaurant);
		} else {
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
	});
};

exports.addSearchHistoryCategory = function(_searchHistoryCategory, next) {
	this.hasUserSearchedForCategory(_searchHistoryCategory.userID, _searchHistoryCategory.category, function(err, searchHistoryCategory) {
		// check if the user has already searched for that category
		if (err) {
			console.log("This error is from services/search-service.js " + err);
			return next(err, null);
		}
		if (!err && searchHistoryCategory != null) {
			// user has already searched for this category
			return next(null, searchHistoryCategory);
		} else {
			userService.findUserByID(_searchHistoryCategory.userID, function(err, user) {
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
	});
};

exports.getUserSearchedRestaurants = function(_userID, next) {
	SearchHistoryRestaurant.find({userID: _userID}, function(err, searchHistoryRestaurant) {
		next(err, searchHistoryRestaurant);
	}).select('restaurantID');
};

exports.getUserSearchedCategories = function(_userID, next) {
	SearchHistoryCategory.find({userID: _userID}, function(err, searchHistoryCategory) {
		next(err, searchHistoryCategory);
	}).select('category');
};

// TODO get users who searched for a restaurant

// TODO get users who searched for a category
