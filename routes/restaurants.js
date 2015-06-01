var express = require('express');
var router = express.Router();
var restaurantService = require('../services/restaurant-service');
var userService = require('../services/user-service');
var config = require('../config');

// TODO ensure admin on relevant POST/DELETE/UPDATE requests too and test it

// == start ==
// for file uploading
var busboy = require('connect-busboy');
var path = require('path'); //used for file path
var fs = require('fs-extra'); 
var http = require('http'), inspect = require('util').inspect;
// == end ==

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// TODO update restaurant

/* GET restaurants listing. */
router.get('/', function(req, res, next) {
  restaurantService.getAllRestaurants(function(err, restaurants) {
  	if (err) {
  		return res.status(500).json({error: err});
  	}
  	// for giving URL of images
  	for (restaurant in restaurants) {
  		restaurants[restaurant].imageUrl = config.network.IP + ':' + config.network.port + restaurants[restaurant].imageUrl;	
  	}
  	res.json(restaurants);
  })
});

/* GET restaurants/details/:clientname. */
router.get('/details/:restaurantID', function(req, res, next) {
	restaurantService.findRestaurantByID(req.params.restaurantID, function(err, restaurant) {
		if (err) {
			return res.status(500).json({error: err});
		}
		// for giving URL of image
		restaurant.imageUrl = config.network.IP + ':' + config.network.port + restaurant.imageUrl;
		res.json(restaurant);
	});
});

/* DELETE restaurants/delete/:clientname. */
router.delete('/delete/:restaurantID', function(req, res, next) {
	restaurantService.deleteRestaurantByID(req.params.restaurantID, function(err, restaurant) {
		if (err) {
			return res.status(500).json({error: err});
		}
		res.json({message: 'Successfully deleted restaurant'});
	});
});

/* GET restaurants/create. */
router.get('/create', function(req, res, next) {
	if (!userService.ensureAdmin(req.session.passport.user)) {
		return res.render('error', { error: 404, message: "You don't have the permission to access this page." });
	}
	var vm = {
		title: 'Add restaurant'
	};
  res.render('restaurants/create', vm);
});

/* POST restaurants/create. */
router.post('/create', function(req, res, next) {
	restaurantService.addRestaurant(req.body, function(err, restaurantSaved) {
		if (err) {
			console.log("This error is from routes/restaurants.js = " + err);
			var vm = {
				title: 'Add restaurant',
				input: req.body,
				error: err
			};
		  return res.render('restaurants/create', vm); // in case of error
		}
		res.redirect('/'); // in case of success
		// TODO send success message to next page
	});
});

/* POST restaurants/imageUpload. */
router.post('/imageUpload', function(req, res, next) {
	// TODO limit file upload size
	var fstream;
	var filenameOfImage;
	var encounteredError = false;
	req.pipe(req.busboy);
	req.busboy.on('file', function (fieldname, file, filename) {
		console.log("Uploading: " + filename);
		filenameOfImage = filename;
		//Path where image will be uploaded
		try {
			fstream = fs.createWriteStream(config.imageUploadDirectoryRestaurants + filename);
			file.pipe(fstream);
			fstream.on('close', function () {
				console.log("Upload finished of: " + filename);
			});	
		} catch (err) {
			console.log("This error is from routes/restaurants.js = " + err);
			encounteredError = true;
		}
	});
	if (!encounteredError) {
		req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
			if (fieldname == "restaurantID") {
				var imageUrl = "/images/restaurantPictures/" + filenameOfImage;
				restaurantService.addImageToRestaurant(val, imageUrl, function(err, user) {
					if (err) {
						console.log("This error is from routes/restaurants.js = " + err);
						return res.redirect('/restaurants/imageUpload');
					} else {
						res.redirect('/restaurants/imageUpload');
					}
				});
			}
		});
	} else  {
		res.redirect('/restaurants/imageUpload');
	}
});

/* GET /restaurants/imageUpload. */
router.get('/imageUpload', function(req, res, next) {
	if (!userService.ensureAdmin(req.session.passport.user)) {
		return res.render('error', { error: 404, message: "You don't have the permission to access this page." });
	}
	var vm = {
		title: 'Restaurant image upload'
	};
  res.render('restaurants/imageUpload', vm);
});

module.exports = router;