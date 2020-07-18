const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const path = require('path');


const app = express();

//PASSPORT CONFIG
require('./config/passport')(passport);

//DB CONFIG
require('./node_modules/dotenv/config');

//CONNECT TO MONGO
mongoose.connect(process.env.MONGO_SECRET, { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

//BODY-PARSER
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

// EXPRESS SESSION MIDDLEWARE
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

//PASSPORT MIDDLEWARE

app.use(passport.initialize());
app.use(passport.session());

//CONNECT FLASH
app.use(flash());

//GLOBAL VARS
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
});

//ROUTES
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on Port ${PORT}...`))