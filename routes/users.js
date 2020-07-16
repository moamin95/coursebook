const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

//User Model
const User = require('../models/User');

//Login
router.get('/login', (req, res) => {
    res.render('login')
});

//Register
router.get('/register', (req, res) => {
    res.render('register')
});

//Forgot
router.get('/forgot', (req, res) => {
    res.render('forgot')
});

//Register Handle
router.post('/register', async (req, res) => {
    const {name, email, password} = req.body;
    let errors = [];

    //check required fields
    if(!name || !email || !password){
        errors.push({msg: 'Please fill in all fields'})
    }

    //Check password length
    if(password.length < 6) {
        errors.push({msg: 'Password should be at least 6 characters'});
    }

    if (errors.length > 0){
        res.render('register',{
            errors,
            name,
            email,
            password
        });
    } else {
        //Validation Passed
        User.findOne({email: email})
            .then(user => {
                if(user){ //User Exists
                    errors.push({msg: 'Email is already registered!'});
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    //Hash Password
                    bcrypt.genSalt(10, (error,salt) => 
                        bcrypt.hash(newUser.password, salt, (error, hash) => {
                            if(error) throw error;
                            //set password to hashed
                            newUser.password = hash;
                            //save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'Successfully Registered!');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        }))
                }
            });
    }
});

//Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);  
});

//Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out!');
    res.redirect('/users/login');
});

module.exports = router;