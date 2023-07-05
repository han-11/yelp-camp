const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');


//  add async function because database usually take long time to response, async + await
router.get('/', catchAsync(async (req,res)=>{
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', {campgrounds})
}));

router.get('/new', isLoggedIn, (req,res) =>{
  res.render('campgrounds/new')
});

router.post('/',isLoggedIn, catchAsync(async (req, res, next) =>{
  const campground =  new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id', catchAsync(async(req, res) =>{
  const { id } = req.params;
  const campground =await Campground.findById(id).populate(
    {path :'reviews',
    populate : {
      path: 'author'
    }}
    ).populate('author');
  if(!campground) {
    req.flash('error', 'Can not find the campground');
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/detail', { campground });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync( async (req,res) =>{
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if(!campground) {
    req.flash('error', 'Can not find the campground');
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/edit', {campground});
}));

router.put('/:id', isLoggedIn, isAuthor, catchAsync(async (req,res) =>{
  const { id } = req.params;
  const updatedCampground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${updatedCampground._id}`);
}));


router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) =>{
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'You have deleted the campground');
  res.redirect('/campgrounds')
}));

module.exports = router;