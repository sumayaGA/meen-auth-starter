// Dependencies
require('dotenv').config();
const express = require('express');
const session = require("express-session")
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const userController = require("./controllers/users");
const sessionsController = require("./controllers/sessions");
const app = express();


// Database Configuration
mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

// Database Connection Error / Success
const db = mongoose.connection;
db.on('error', (err) => console.log(err.message + ' is mongod not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));


// Middleware & Body parser(gives us access to req.body)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false
    }));
app.use('/sessions', sessionsController);
// Routes / Controllers
app.use('/users', userController);


// Routes / Controllers
// ASK ABIDUR why am I rendering the index page in my server.js and not in my controllers folder?
//Render the Dashboard View(we want to render the index view IF the user is logged out and we want to render the dashboard view IF the user is logged in.)
app.get('/', (req, res) => {
    if(req.session.currentUser) {
	    res.render('dashboard.ejs', {
            currentUser: req.session.currentUser
    });
    } else {//Render Index View
        res.render("index.ejs", {
            currentUser: req.session.currentUser
        });
    };
});



// Listener
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server is listening on port: ${PORT}`)); 

