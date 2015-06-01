var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema records which restaurants a user searches for
var searchHistoryRestaurantSchema = new Schema ({
	userID: {type:String, required: 'Please enter userID of searcher'},
	restaurantID: {type:String, required: 'Please enter restaurantID of searched restaurant'},
	views: {type:Number, default: 1}, // intial value when entry added
	created: {type:Date, default: Date.now}
});

// schema records which categories a user searches for
var searchHistoryCategorySchema = new Schema ({
	userID: {type:String, required: 'Please enter userID of searcher'},
	category: {type:String, required: 'Please enter category of searched restaurant'},
	views: {type:Number, default: 1}, // intial value when entry added
	created: {type:Date, default: Date.now}
});

var SearchHistoryRestaurant = mongoose.model('SearchHistoryRestaurant', searchHistoryRestaurantSchema);
var SearchHistoryCategory = mongoose.model('SearchHistoryCategory', searchHistoryCategorySchema);

module.exports = {
	SearchHistoryRestaurant: SearchHistoryRestaurant,
	SearchHistoryCategory: SearchHistoryCategory
};