var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO test both these

// schema records which restaurants a user searches for
var searchHistoryRestaurantSchema = new Schema ({
	userID: {type:String, required: 'Please enter userID of searcher'},
	restaurantID: {type:String, required: 'Please enter restaurantID of searched restaurant'}
});

// searchHistoryRestaurantSchema.index({username: 1, clientname: 1}, {unique: true});

// schema records which categories a user searches for
var searchHistoryCategorySchema = new Schema ({
	userID: {type:String, required: 'Please enter userID of searcher'},
	category: {type:String, required: 'Please enter category of searched restaurant'}
});

// searchHistoryCategorySchema.index({username: 1, category: 1}, {unique: true});

var SearchHistoryRestaurant = mongoose.model('SearchHistoryRestaurant', searchHistoryRestaurantSchema);
var SearchHistoryCategory = mongoose.model('SearchHistoryCategory', searchHistoryCategorySchema);

module.exports = {
	SearchHistoryRestaurant: SearchHistoryRestaurant,
	SearchHistoryCategory: SearchHistoryCategory
};