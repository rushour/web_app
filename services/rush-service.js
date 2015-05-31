var RushAtRestaurant = require('../models/rush').RushAtRestaurant;
var Lyric = require('lyric-node');

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
	RushAtRestaurant.find({restaurantID: _restaurantID}, 'rush created', function(err, rushHistory) {
		next(err, rushHistory);
	});
};

exports.getPrediction = function(_restaurantID, _numPredictions, next) {
	RushAtRestaurant.find({restaurantID: _restaurantID}, 'rush created', function(err, rushHistory) {
		if (err) {
			return next(err, null);
		} else {
			var input = new Array();
			input['x'] = new Array();
			input['y'] = new Array();
			var i = 0;
			for (var stat in rushHistory) {
				var created = rushHistory[stat]["created"];
				var rush = rushHistory[stat]["rush"];
				input['x'][i] = i;
				input['y'][i] = parseInt(rush);
				i++;
			}
			var estimationInput = new Array();
			estimationInput['x'] = new Array();
			for (var j = 0; j < _numPredictions; j++) {
				estimationInput['x'][j] = i+j;
			}
			var input = Lyric.ordinalize(input);
			var data = Lyric.applyModel(estimationInput, Lyric.buildModel(input));
			next(null, data);
		}
	});
};