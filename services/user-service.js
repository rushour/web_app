var User = require('../models/user').User;

exports.addUser = function(_user, next) {
	var newUser = new User({
		firstName: _user.firstName,
		lastName: _user.lastName,
		email: _user.email,
		password: _user.password,
		imageUrl: _user.imageUrl,
		oauthID: _user.oauthID,
		oauthProvider: _user.oauthProvider
	});

	newUser.save(function(err, user) {
		if (err) {
			return next(err, user);
		}
		next(null, user);
	});
};

exports.findUser = function(email, next) {
	User.findOne({email: email.toLowerCase()}, function(err, user) {
		next(err, user);
	});
};

exports.findUserByID = function(id, next) {
	User.findOne({_id: id}, function(err, user) {
		next(err, user);
	});
};

exports.findUserByOauthID = function(providerID, next) {
	User.findOne({oauthID: providerID}, function(err, user) {
		next(err, user);
	});
};

exports.addImageToUser = function(id, _imageUrl, next) {
	var conditions = {_id: id};
	var update = {$set: {imageUrl: _imageUrl}};
	console.log(_imageUrl);
	console.log(id);
	var options = {upsert: true};
	User.update(conditions, update, options, function(err) {
		if (err) {
			return next(err, null);
		}
		next(null, "done");
	});
};

exports.ensureAdmin = function(userID, next) {
	if (userID == null) {
		console.log("null user");
		return next("null user", null);
	}
	console.log(userID);
	User.findOne({_id: userID}, function(err, user) {
		if (err) {
			console.log("This error is from services/user-service.js = " + err);
			return next("user not found", null);
		} else {
			console.log(user);
			console.log(user.isAdmin);
			if (user.isAdmin) {
				console.log("isadmin");
			} else {
				console.log("isadmin not");
			}
			if (user.isAdmin) {
				return next(null, user);
			}
			console.log("not admin");
			return next("not admin", null);
		}
	});
};