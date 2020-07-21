const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


//Course Model
const Course = require('../models/Course');

//Add Course View
router.get('/add', (req, res) => {
    res.render('addCourse')
});

//render courses page
router.get('/shop', async (req, res) => {
    const course = await Course.find()
    res.render('shop', {course: course})
});


router.post('/add', (req, res)=> {
    let {title, description, technologies, price} = req.body;
    let errors = [];
    
    if(!title) {
        errors.push({msg: 'Title is required'});
    }
    if(!description) {
        errors.push({msg: 'Description is required'});
    }
    if(!technologies) {
        errors.push({msg: 'Technologies are required'});
    }
    if(!price) {
        errors.push({msg: 'Price is required'});
    }
    if(errors.length > 0){
        res.render('addCourse', {
            errors,
            title,
            description,
            technologies,
            price
        });
    } else {
        Course.create({
            title,
            description,
            technologies,
            price
        })
            .then(course => {
                req.flash('success_msg', 'Course is submited for review!');
                res.render('addCourse');
            })
            .catch(err => console.log(err));
    }
});

module.exports = router;