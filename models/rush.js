var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema records the rush at restaurant at a particular time
var rushAtRestaurant = new Schema ({
	restaurantID: {type:String, requrired: 'Please enter restaurantID'},
	rush: {type:Number, required: 'Please enter rush percentage', default: 0, min:[0, 'Not a valid percentage (minimum 0)'], max:[100, 'Not a valid percentage (maximum 100)']},
	created: {type:Date, default: Date.now}
});

var RushAtRestaurant = mongoose.model('RushAtRestaurant', rushAtRestaurant);

module.exports = {
	RushAtRestaurant: RushAtRestaurant
};