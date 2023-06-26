const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
// A middleware for validating express inputs using Joi schemas
const Joi = require('joi');
const {campgroundSchema, reviewSchema} = require('./schemas');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const mongoose = require('mongoose');
const Campground = require('./models/campground')
const Review = require('./models/review');
const app = express();


// import mongoose schema from models file
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then( () =>{
  console.log("MongoDB Connected!")
})
.catch( err =>{
  console.log(err)
})

const validateCampground = (req, res, next) => {
  const{ error} = campgroundSchema.validate(req.body);
  if(error){
    const msg= error.details.map( el => el.message).join(",");
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

const validateReview = (req, res, next) => {
  const{ error} = reviewSchema.validate(req.body);
  if(error){
    const msg= error.details.map( el => el.message).join(",");
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}


// set directory route same as current folder, and use views folder
app.set('views', path.join(__dirname, 'views'));
// set view engine as ejs templates
app.set('view engine', 'ejs');
// encode the body request from req.body
app.use(express.urlencoded({extended:true}));
// use method override to overide the pots method
app.use(methodOverride('_method'));
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);


app.get('/', (req, res) =>{
  res.render('home')
});

//  add async function because database usually take long time to response, async + await
app.get('/campgrounds', catchAsync(async (req,res)=>{
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', {campgrounds})
}));

app.get('/campgrounds/new', (req,res) =>{
  res.render('campgrounds/new')
});

app.post('/campgrounds',validateCampground,  catchAsync(async (req, res, next) =>{
  const campground =  new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
}));

app.get('/campgrounds/:id', catchAsync(async(req, res) =>{
  const { id } = req.params;
  const campground =await Campground.findById(id).populate('reviews');
  res.render('campgrounds/detail', {campground});
}));

app.get('/campgrounds/:id/edit', async (req,res) =>{
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', {campground});
})

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req,res) =>{
  const { id } = req.params;
  const updatedCampground = await  Campground.findByIdAndUpdate(id, req.body.campground);
  res.redirect(`/campgrounds/${updatedCampground._id}`);
}));


app.delete('/campgrounds/:id', catchAsync(async (req, res) =>{
  const { id } = req.params;
  const deletedCampground = await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds')
}));

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req,res) =>{
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const newReview = new Review(req.body.review);
  campground.reviews.push(newReview)
  await campground.save();
  await newReview.save();                                                                                                                                                                                                                                                                                                        
  res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync( async(req,res)=>{
  const { id, reviewId} = req.params;
  await Campground.findByIdAndUpdate(id, {$pull:{ reviews:reviewId}})
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/campgrounds/${id}`);
} ))

// pass the error info (message, status code) to the below error handler
app.all('*', (req, res, next) =>{
  next(new ExpressError('Page Not Found', 404))
})

// error handler in middle ware, hanlde all the errors occured during request
app.use((err, req, res, next )=> {
  // destructure error information from anywhere 
  const {statusCode = 500} = err;
  if(!err.massage) err.massage = 'Oh no, something went wrong'

  res.status(statusCode).render('error', {err});
})


app.listen( 3000, ()=>{
  console.log("Server listening to port 3000")
});