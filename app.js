require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
// flash message back
const flash = require('express-flash');

const session = require('express-session');
//--
const connectedBD = require('./server/config/db');

const app = express();
const port = 5000 || process.env.PORT;

// Connect to Database
connectedBD();

app.use(express.urlencoded({extended: true}));
app.use(express.json());


const bodyparser = require('body-parser');
// app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));


// Static Files
app.use(express.static('public'));

// Express Session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 100 * 60* 60 * 24 * 7, // 1 week
    }
}));

// Flash Messages
// Configure flash messages middleware
app.use(flash());

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Home
// app.get('/', (req, resp) => {
//     const locals = {
//         title: "User Mgm",
//         description: "This is user mgs description."
//     }
//     resp.render('index', locals); //{locals}
// });

// Routes
app.use('/', require('./server/routes/costomer_route'));


// 404
app.get('*', (req, resp) => {
    resp.status(404).render('404'); //{locals}
});

app.listen(port, ()=> {
    console.log(`App listeing on port ${port}`);
});