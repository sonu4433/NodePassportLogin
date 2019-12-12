const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

 
const app = express();

//Passport Config
require('./config/passport')(passport);

//DB config
const db = require('./config/keys').MongoURI;

//connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
.then(() => {console.log('MongoDB Connected...')})
.catch((err) => {console.log(err)}); 

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({ extended: false }))


// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUnitialized: true,
}));


//Passport MiddleWare
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());


//Global Variable
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


//Index Routes
app.use('/', require('./routes/index'))
//User Routes
app.use('/users', require('./routes/users'));

port = process.env.PORT || 5000;

app.listen(port, console.log(`Server Started on port ${port}`));