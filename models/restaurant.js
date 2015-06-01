var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var restaurantService = require('../services/restaurant-service');

var restaurantSchema = new Schema ({
	name: {type:String, required: 'Please enter restaurant name'},
	clientname: {type:String, required: 'Please enter clientname'},
	address: {type:String},
	city: {type:String},
	country: {type:String},
	latitude: {type:Number},
	longitude: {type:Number},
	currentRush: {type:Number, default: 0, min:[0, 'Not a valid percentage (minimum 0)'], max:[100, 'Not a valid percentage (maximum 100)']},
	imageUrl: {type:String},
	created: {type:Date, default: Date.now}
});

restaurantSchema.path('clientname').validate(function(value, next) {
	restaurantService.findRestaurantByClientname(value, function(err, restaurant) {
		if (err) {
			console.log("This error is from models/restaurant.js = " + err);
			return next(false);
		}
		next(!restaurant);
	});
}, 'That clientname is already in use');

var Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = {
	Restaurant: Restaurant
};