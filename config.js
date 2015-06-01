var config = {};

config.network = {
	IP: 'http://10.0.1.2',
	port: 3000
};

config.mongo = {
	IP: 'localhost',
	port: 27017
};

config.mongoUri = 'mongodb://'+config.mongo.IP+':'+config.mongo.port+'/rushour';

config.facebook = {
	clientID: '907827965914307',
	clientSecret: 'ece91de1cdc4a923fd931493fc75898c',
	callbackURL: config.network.IP+':'+config.network.port+'/users/auth/facebook/callback',
	profileFields: ['id', 'displayName', 'name', 'gender', 'emails', 'photos', 'link']
};

config.imageUploadDirectoryUsers = __dirname + '/public/images/profilePictures/';
config.imageUploadDirectoryRestaurants = __dirname + '/public/images/restaurantPictures/';

module.exports = config;