const mongoose = require('mongoose');
const cities = require('./cities')
const {places, descriptors  } = require('./seedHelpers');
// import mongoose schema from models file
const Campground = require('../models/campground')
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


const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async() =>{
  await Campground.deleteMany({});
  for (let i=0; i<50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20 ) + 10;
    const camp = new Campground({
      author: '64a4b742857e646f8552973b',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: 'https://source.unsplash.com/collection/483251',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi nam sunt molestiae sint tempore, quia ab, doloribus unde est ipsam deleniti rerum maiores repellendus cum beatae officiis eaque harum eos?',
      price
    })
    await camp.save();
  }
}

seedDB()
.then(() =>{
  mongoose.connection.close();
})