var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userService = require('../services/user-service');

var conditionalRequire = {
  validator: function (value) {
    if (this.email !== '') {
    	if (this.password === '') {
    		return false;
    	} else {
    		return true;
    	}
    } else {
    	if (this.oauthID !== '') {
    		return true;
    	} else {
    		return false;
    	}
    }
  },
  msg: 'Either sign up with Facebook or use your email/password',
};

// TODO check validator function
var userSchema = new Schema ({
	firstName: {type:String, required: 'Please enter your first name'},
	lastName: {type:String, required: 'Please enter your last name'},
	// email: {type:String, required: 'Please enter your email address'},
	email: {type:String, validate: conditionalRequire},
	// password: {type:String, required: 'Please enter your password'},
	password: {type:String, validate: conditionalRequire},
	imageUrl: {type:String},
	oauthProvider: {type:String},
	oauthID: {type:Number},
	created: {type: Date, default: Date.now}
});

userSchema.path('email').validate(function(value, next) {
	userService.findUser(value, function(err, user) {
		if (err) {
			console.log("This error is from models/user.js = " + err);
			return next(false);
		}
		next(!user);
	});
}, 'That email is already in use');

var User = mongoose.model('User', userSchema);

module.exports = {
	User: User
};