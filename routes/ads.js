var express = require('express');
var router = express.Router();
var adService = require('../services/ad-service');
var userService = require('../services/user-service');
var config = require('../config');

// == start ==
// for file uploading
var busboy = require('connect-busboy');
var path = require('path'); //used for file path
var fs = require('fs-extra'); 
var http = require('http'), inspect = require('util').inspect;
// == end ==

/* GET ads page. */
router.get('/', function(req, res, next) {
  res.redirect('/users/home');
});

/* GET ads/recommendations/:userID. */
router.get('/recommendations/:userID', function(req, res, next) {
  adService.getRecommendations(req.params.userID, function(err, ads) {
  	if (err) {
  		console.log("This error is from routes/search.js = " + err);
  		return res.status(500).json({error: err});
  	}
  	// for giving URL of images
  	for (ad in ads) {
  		ads[ad].imageUrl = config.network.IP + ':' + config.network.port + ads[ad].imageUrl;	
  	}
  	res.json(ads);
  }); 
});

/* GET ads/create. */
router.get('/create', function(req, res, next) {
	userService.ensureAdmin(req.session.passport.user, function(err, user) {
		if (err) {
			return res.render('error', { error: 404, message: "You don't have the permission to access this page." });	
		} else {
			var vm = {
				title: 'Create ad',
				user: user
			};
		  res.render('ads/create', vm);
		}
	});
});

/* POST . */
router.post('/create', function(req, res, next) {
	adService.createAd(req.body, function(err, adSaved) {
		if (err) {
			console.log("This error is from routes/ads.js = " + err);
			var vm = {
				title: 'Create ad',
				input: req.body,
				error: err
			};
		  return res.render('ads/create', vm); // in case of error
		}
		res.redirect('create'); // in case of success
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
			fstream = fs.createWriteStream(config.imageUploadDirectoryAds + filename);
			file.pipe(fstream);
			fstream.on('close', function () {
				console.log("Upload finished of: " + filename);
			});	
		} catch (err) {
			console.log("This error is from routes/ads.js = " + err);
			encounteredError = true;
		}
	});
	if (!encounteredError) {
		req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
			if (fieldname == "adID") {
				var imageUrl = "/images/adPictures/" + filenameOfImage;
				adService.addImageToAd(val, imageUrl, function(err, user) {
					if (err) {
						console.log("This error is from routes/ads.js = " + err);
						return res.redirect('/imageUpload');
					} else {
						res.redirect('/ads/imageUpload');
					}
				});
			}
		});
	} else  {
		res.redirect('/ads/imageUpload');
	}
});

/* GET /restaurants/imageUpload. */
router.get('/imageUpload', function(req, res, next) {
	userService.ensureAdmin(req.session.passport.user, function(err, user) {
		if (err) {
			return res.render('error', { error: 404, message: "You don't have the permission to access this page." });
		} else {
			var vm = {
				title: 'Ad image upload',
				user: user
			};
		  res.render('ads/imageUpload', vm);
		}
	});
});

module.exports = router;