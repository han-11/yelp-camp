const express = require('express');
const router = express.Router({ mergeParams:true });
const {reviewSchema} = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground')
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');

const validateReview = (req, res, next) => {
  const{ error} = reviewSchema.validate(req.body);
  if(error){
    const msg= error.details.map( el => el.message).join(",");
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

router.post('/', validateReview, catchAsync(async (req,res) =>{
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const newReview = new Review(req.body.review);
  campground.reviews.push(newReview);
  await campground.save();
  await newReview.save(); 
  req.flash('success', 'Successfully created the new review!');                                                                                                                                                                                                                                                                                                 
  res.redirect(`/campgrounds/${campground._id}`)
}))


router.delete('/:reviewId', catchAsync( async(req,res)=>{
  const { id, reviewId} = req.params;
  await Campground.findByIdAndUpdate(id, {$pull:{ reviews:reviewId}})
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'You have deleted the review');
  res.redirect(`/campgrounds/${id}`);
} ))

module.exports = router;