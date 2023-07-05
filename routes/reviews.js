const express = require('express');
const router = express.Router({ mergeParams:true });
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground')
const Review = require('../models/review');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');


router.post('/', isLoggedIn, validateReview, catchAsync(async (req,res) =>{
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  campground.reviews.push(newReview);
  await campground.save();
  await newReview.save(); 
  req.flash('success', 'Successfully created the new review!');                                                                                                                                                                                                                                                                                                 
  res.redirect(`/campgrounds/${campground._id}`)
}))


router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync( async(req,res)=>{
  const { id, reviewId} = req.params;
  await Campground.findByIdAndUpdate(id, {$pull:{ reviews:reviewId}})
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'You have deleted the review');
  res.redirect(`/campgrounds/${id}`);
} ))

module.exports = router;