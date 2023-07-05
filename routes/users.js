const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users')
const { storeReturnTo } = require('../middleware');

router.route('/register')
.get(users.renderRegister)
.post(catchAsync( users.registerUser))

router.route('/login')
.get(users.renderLogin)
.post(
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
    // Now we can use res.locals.returnTo to redirect the user after login
   users.loginUser);


router.get('/logout', users.logoutUser)

module.exports = router;