var SearchHistoryRestaurant = require('../models/search').SearchHistoryRestaurant;
var SearchHistoryCategory = require('../models/search').SearchHistoryCategory;

// TODO make sure clientname and username already exist
exports.addSearchHistoryRestaurant = function(_searchHistoryRestaurant, next) {
	var newSearchHistoryRestaurant = new SearchHistoryRestaurant({
		username: _searchHistoryRestaurant.username,
		clientname: _searchHistoryRestaurant.clientname
	});

	newSearchHistoryRestaurant.save(function(err, searchHistoryRestaurant) {
		if (err) {
			return next(err, searchHistoryRestaurant);
		}
		next(null, searchHistoryRestaurant);
	});
};

// TODO make sure username exists
exports.addSearchHistoryCategory = function(_searchHistoryCategory, next) {
	var newSearchHistoryCategory = new SearchHistoryCategory({
		username: _searchHistoryCategory.username,
		category: _searchHistoryCategory.category
	});

	newSearchHistoryCategory.save(function(err, searchHistoryCategory) {
		if (err) {
			return next(err, searchHistoryCategory);
		}
		next(null, searchHistoryCategory);
	});
};

// TODO get searches of user (both restaurant and category)

// TODO get users who searched for a restaurant

// TODO get users who searched for a category
