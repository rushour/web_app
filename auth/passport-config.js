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
	 callbackURL: config.facebook.callbackURL,
	 profileFields: config.facebook.profileFields
	},
		function(accessToken, refreshToken, profile, done) {
			userService.findUserByOauthID(profile.id, function(err, user) {
				if (err) { console.log(err); }
				if (!err && user != null) {
					// the user already exists
					console.log("This user has already signed up " + profile);
					done(null, user);
				} else {
					// user does not exits, making new one
					console.log("This use has signed up " + profile);
					var user = {
						oauthID: profile.id,
						firstName: profile.name.givenName ? profile.name.givenName : '',
						lastName: profile.name.familyName ? profile.name.familyName : '',
						email: profile.emails ? profile.emails[0].value : null,
						imageUrl: profile.photos ? profile.photos[0].value : '/images/unknown_user.png', //TODO check if this image works
						gender: profile.gender ? profile.gender : null,
						oauthLink: profile.link ? profile.link : null,
						oauthProvider: 'facebook'
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