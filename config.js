var config = {};

config.network = {
	IP: 'http://rushour.pk',
	port: 3000
};

config.mongo = {
	IP: 'rushour.pk',
	port: 27017
};

config.mongoUri = 'mongodb://'+config.mongo.IP+':'+config.mongo.port+'/rushour';

config.facebook = {
	clientID: '941128589250911',
	clientSecret: 'fbbc74bb838b39ec1ba9fe273a57f805',
	callbackURL: config.network.IP+':'+config.network.port+'/users/auth/facebook/callback',
	profileFields: ['id', 'displayName', 'name', 'gender', 'emails', 'photos', 'link']
};

config.imageUploadDirectoryUsers = __dirname + '/public/images/profilePictures/';
config.imageUploadDirectoryRestaurants = __dirname + '/public/images/restaurantPictures/';

module.exports = config;