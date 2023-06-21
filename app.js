const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');




// import mongoose schema from models file
const Campground = require('./models/campground')
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

app = express();


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
app.get('/campgrounds', async (req,res)=>{
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', {campgrounds})
});

app.get('/campgrounds/new', (req,res) =>{
  res.render('campgrounds/new')
});

app.post('/campgrounds', async (req, res) =>{
  const campground =  new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

app.get('/campgrounds/:id', async (req, res) =>{
  const { id } = req.params;
  const campground =await Campground.findById(id);
  res.render('campgrounds/detail', {campground});
});

app.get('/campgrounds/:id/edit', async (req,res) =>{
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', {campground});
})

app.put('/campgrounds/:id', async (req,res) =>{
  const { id } = req.params;
  const updatedCampground = await  Campground.findByIdAndUpdate(id, req.body.campground);
  res.redirect(`/campgrounds/${updatedCampground._id}`);
})


app.delete('/campgrounds/:id', async (req, res) =>{
  const { id } = req.params;
  const deletedCampground = await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds')
})


app.listen( 3000, ()=>{
  console.log("Server listening to port 3000")
});