var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO test both these

// schema records which restaurants a user searches for
var searchHistoryRestaurantSchema = new Schema ({
	username: {type:String, required: 'Please enter username of searcher'},
	clientname: {type:String, required: 'Please enter clientname of searched restaurant'}
});

searchHistoryRestaurantSchema.index({username: 1, clientname: 1}, {unique: true});

// schema records which categories a user searches for
var searchHistoryCategorySchema = new Schema ({
	username: {type:String, required: 'Please enter username of searcher'},
	catgeory: {type:String, required: 'Please enter category of searched restaurant'}
});

var SearchHistoryRestaurant = mongoose.model('SearchHistoryRestaurantSchema', searchHistoryRestaurantSchema);
var SearchHistoryCategory = mongoose.model('SearchHistoryCategorySchema', searchHistoryCategorySchema);

module.exports = {
	SearchHistoryRestaurant: SearchHistoryRestaurant,
	SearchHistoryCategory: SearchHistoryCategory
};