var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adSchema = new Schema ({
	title: {type:String, required: 'Please enter ad title'},
	clientname: {type:String, required: 'Please enter clientname'},
	imageUrl: {type:String},
	category: {type:String},
	created: {type:Date, default: Date.now}
});

var Ad = mongoose.model('Ad', adSchema);
module.exports = {
	Ad: Ad
};