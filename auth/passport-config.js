module.exports = function() {
	var passport = require('passport');
	var passportLocal = require('passport-local');
	var FacebookStrategy = require('passport-facebook').Strategy;
	var userService = require('../services/user-service');
	var config = require('../config');

	passport.use(new passportLocal.Strategy({usernameField: 'email'}, function(email, password, next) {
		userService.findUser(email, function(err, user) {
			if (err) {
				return next(err);
			}
			if (!user || user.password !== password) {
				return next(null, null);
			}
			console.log("from local " + user._id); // TODO delete this log
			next(null, user);
		});
	}));

	passport.use(new FacebookStrategy({
	 clientID: config.facebook.clientID,
	 clientSecret: config.facebook.clientSecret,
	 callbackURL: config.facebook.callbackURL
	},
		function(accessToken, refreshToken, profile, done) {
			userService.findUserByOauthID(profile.id, function(err, user) {
				if (err) { console.log(err); }
				if (!err && user != null) {
					// the user already exists
					done(null, user);
				} else {
					// TODO put checks for all data from facebook (first name, last name, profile id, image etc)
					console.log(profile.name.givenName);
					console.log(profile.name.familyName);
					var user = {
						oauthID: profile.id,
						firstName: profile.name.givenName,
						lastName: profile.name.familyName,
						oauthProvider: 'facebook'
						// TODO add email from facebook (make sure to handle the case without any email address)
						// TODO add image URL from facebook
				 	};
					userService.addUser(user, function(err, userSaved) {
						if (err) {
							console.log(err);
						} else {
							console.log("User " + userSaved.oauthID + " saved!");
							done(null, userSaved);
						};
					});
				};
			});
		}
	));

	// serialize and deserialize
	passport.serializeUser(function(user, done) {
		console.log("Serialized user " + user._id + " successfully");
		done(null, user._id);
	});
	
	passport.deserializeUser(function(id, done) {
		userService.findUserByID(id, function(err, user){
			console.log("Deserialized user " + user._id + " successfully");
			if (!err) done(null, user);
			else done(err, null);
		})
	});
};