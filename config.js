var config = {};

config.mongoUri = 'mongodb://localhost:27017/rushour';

config.facebook = {
	clientID: '907827965914307',
	clientSecret: 'ece91de1cdc4a923fd931493fc75898c',
	callbackURL: 'http://localhost:3000/users/auth/facebook/callback',
	profileFields: ['id', 'displayName', 'name', 'gender', 'emails', 'photos', 'link']
};

config.imageUploadDirectory = __dirname + '/public/images/profilePictures/';

module.exports = config;