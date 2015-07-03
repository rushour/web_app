var RushAtRestaurant = require('../models/rush').RushAtRestaurant;

exports.addRushAtRestaurant = function(_rushAtRestaurant, next) {
	var _created = new Date(_rushAtRestaurant.year, _rushAtRestaurant.month, _rushAtRestaurant.date, _rushAtRestaurant.hours, _rushAtRestaurant.minutes, _rushAtRestaurant.seconds, 0);
	var newRushAtRestaurant = new RushAtRestaurant({
		restaurantID: _rushAtRestaurant.restaurantID,
		rush: _rushAtRestaurant.rush,
		day: _rushAtRestaurant.day,
		created: _created
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

exports.getPrediction = function(_restaurantID, _day, next) {
	var searchDays = [];
	if (_day == "friday" || _day == "saturday" || _day == "sunday") {
		// Weekdays
		searchDays = ["friday", "saturday", "sunday"];
	} else {
		// Weekends
		searchDays = ["monday", "tuesday", "wednesday", "thursday"];
	}
	
	RushAtRestaurant.find({restaurantID: _restaurantID, day: {$in : searchDays}}, 'rush created day', function(err, rushHistory) {
		if (err) {
			return next(err, null);
		}
		
		// The index responds to the hour of day, so array size is 24
		var predictions = [];
		var numEntries = [];
		for (var i = 0; i < 24; i++) {
			predictions[i] = 0;
			numEntries[i] = 0;
		}

		for (var stat in rushHistory) {
			var created = rushHistory[stat]["created"];
			var hours = parseInt(created.getHours());
			var total = predictions[hours]*numEntries[hours];
			numEntries[hours]++;
			var rush = parseInt(rushHistory[stat]["rush"]);
			predictions[hours] = Math.ceil((total+rush)/numEntries[hours]);
		}

		var jsonObj = [];
		for (var i = 0; i < 24; i++) {
			jsonObj.push({"hour": i, "rush": predictions[i]});
		}
		
		predictions = JSON.parse(JSON.stringify(jsonObj));
		console.log(predictions);
		next(err, jsonObj);
	});
};