if(process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash  =require('connect-flash');
// A middleware for validating express inputs using Joi schemas
const Joi = require('joi');
const {campgroundSchema, reviewSchema} = require('./schemas');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const Campground = require('./models/campground')
const Review = require('./models/review');
const User = require('./models/user');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' }) 

// import routers
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');


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



const app = express();
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
// set view engine as ejs templates
app.set('view engine', 'ejs');
// set directory route same as current folder, and use views folder
app.set('views', path.join(__dirname, 'views'));
// encode the body request from req.body
app.use(express.urlencoded({extended:true}));
// use method override to overide the pots method
app.use(methodOverride('_method'));
// use the public js file, put the src tag in biolerplate
app.use(express.static(path.join(__dirname, 'public'))); 



// express session configration 
const sessionConfig = {
  secret: 'thisisthesecret',
  resave: false,
  saveUninitialized: true,
  cookie:{
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
// make sure session is used before passport.session
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// res.locals provides a way to pass data through the app during the request-response cycle
// define the flash message middleware, every route loading will check the success message
// define the current user information form req.user, send it to nav bar
app.use((req,res,next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})



// import the routes from routes file
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);
app.use('/', usersRoutes);

app.get('/', (req, res) =>{
  res.render('home')
});


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