var searchService = require('./search-service');
var restaurantService = require('./restaurant-service');
var Ad = require('../models/ad').Ad;

exports.getRecommendations = function(userID, next) {
	searchService.getUserSearchedCategories(userID, function(err, categories) {
		if (err) {
			return next(err, null);
		} else {
			var array = [];
			for (c in categories) {
				array.push(categories[c].category);
			}
			Ad.find({ category: { $in: array }}, function(err, ads) {
				if (err) {
					return next(err, null);
				} else {
					next(null, ads);
				}
			});
		}
	});
};

exports.createAd = function(_ad, next) {
	var newAd = new Ad({
		title: _ad.title,
		clientname: _ad.clientname,
		imageUrl: _ad.imageUrl
	});

	restaurantService.findRestaurantByClientname(_ad.clientname, function(err, restaurant) {
		if (err) {
			return next(err, null);
		} else {
			if (restaurant != null) {
				newAd.category = restaurant.category;
				newAd.save(function(err, ad) {
					if (err) {
						return next(err, null);
					}
					next(null, ad);
				});
			} else {
				return next("restaurant not found with given clientname", null);
			}
		}
	})
};

exports.addImageToAd = function(id, _imageUrl, next) {
	var conditions = {_id: id};
	var update = {$set: {imageUrl: _imageUrl}};
	console.log(_imageUrl);
	var options = {upsert: true};
	Ad.update(conditions, update, options, function(err) {
		if (err) {
			return next(err, null);
		}
		next(null, "done");
	});
};