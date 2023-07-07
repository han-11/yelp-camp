const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage});



router.route('/')
//  add async function because database usually take long time to response, async + await
.get( catchAsync(campgrounds.index))
.post(isLoggedIn, upload.array('image'), catchAsync(campgrounds.createCampground))


//  the new route must be rendered before the id routes
router.get('/new', isLoggedIn, campgrounds.newCampground)

router.route('/:id')
.get(catchAsync(campgrounds.showCampground))
.put(isLoggedIn, isAuthor, upload.array('image'), catchAsync(campgrounds.updateCampground))
.delete( isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))



router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync( campgrounds.renderEditForm))






module.exports = router;