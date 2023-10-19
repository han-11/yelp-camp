# 🏕 YelpCamp

<a href="https://my-campground.herokuapp.com/">
 <p align="center">
  <img src="https://images.unsplash.com/photo-1484910292437-025e5d13ce87?auto=format&fit=crop&q=80&w=4828&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fit=crop&w=2970&q=80" alt="Campground"
 </p>
</a>

YelpCamp is a website where users can create and review campgrounds. In order to review or create a campground, you must have an account. This project was part of Colt Steele's web dev course on udemy.

This project was created using Node.js, Express, MongoDB, and Bootstrap. Passport.js was used to handle authentication.

## Features

- Users can create, edit, and remove campgrounds
- Users can review campgrounds once, and edit or remove their review
- User profiles include more information on the user (full name, email, phone, join date), their campgrounds, and the option to edit their profile or delete their account
- Search campground by name or location
- Sort campgrounds by highest rating, most reviewed, lowest price, or highest price

## Run it locally

1. Install [mongodb](https://www.mongodb.com/)
2. Create a cloudinary account to get an API key and secret code

```
git clone https://github.com/han-11/yelp-camp.git
cd YelpCamp
npm install
```

## Built With

- [Node.js](https://nodejs.org) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
- [express](https://expressjs.com//) - Fast, unopinionated, minimalist web framework for Node.js
- [MongoDB](https://www.mongodb.com/) - The database for
  modern applications
- [Mongoose](https://mongoosejs.com/) - Elegant MongoDB object modeling for Node.js
- [ejs](https://ejs.co/) - Embedded JavaScript templating
- [joi](https://joi.dev/) - A schema description language and data validator for JavaScript.
- [Cloudinary](https://cloudinary.com/) - Media management platform, an end-to-end solution for image and videos solution.
- [MapBox](https://www.mapbox.com/) - Use APIs, SDKs, and live updating map data give developers tools to build better mapping, navigation, and search experiences across platforms.
- [connect-flash] - For session to store messages and display to the user.
- [Passport-Local Mongoose] A Mongoose plugin that simplifies building username and password login with Passport.
- [multer] Middleware for handling data for uploading files.
- [bs-custom-file-input] Display file names for multiple input.

Run `mongod` in another terminal and `nodemon app` in the terminal with the project.

Then go to [localhost:3000](http://localhost:3000/).

To get google maps working check [this](https://github.com/nax3t/google-maps-api) out.
