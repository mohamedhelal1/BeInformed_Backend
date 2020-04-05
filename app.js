require('./mongodb');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const routes = require('./routes');
const config = require('./Config');
const app = express();
require('./server/newsapi');
//secret for authentication
app.set('secret', config.SECRET);
// Middleware to protect the server against common known security vulnerabilities
app.use(helmet());

// Middleware to compress the server json responses to be smaller in size
app.use(compression());

//bodyparser
app.use(express.json());
app.use(express.urlencoded({extended : false}));

// match requests to defined routes
app.use('/',routes);

/* 
  Middleware to handle any (404 Not Found) error that may occur if the request didn't find
  a matching route on our server, or the requested data could not be found in the database
*/
app.use((req, res) =>{
    res.status(404).json({
        err: null,
        msg: '404 Not Found',
        data: null
    });
});

// Middleware to handle any (500 Internal server error) that may occur while doing database related functions
app.use((err, req, res, next)=> {
    res.status(500).json({
        // Never leak the stack trace of the err if running in production mode
        err: process.env.NODE_ENV === 'production' ? null : err,
        msg: '500 Internal Server Error',
        data: null
    });
});

// setup port
const PORT = process.env.PORT || 5000;
app.listen(PORT , console.log(`Server running on port ${PORT}.....`));