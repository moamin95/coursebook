const express = require('express');
const router = express.Router();
const {ensureAuthenticated, forwardAuthenticated} = require('../config/auth');

//Welcome View
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

//About View
router.get('/shop', (req, res) =>  res.render('shop'));

// Dashboard View
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    name: req.user.name
  })
);



module.exports = router;