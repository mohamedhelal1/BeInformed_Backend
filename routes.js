const express = require('express');
const jwt = require('jsonwebtoken');
const userCtrl = require('./controllers/user');

const router = express.Router();

var isAuthenticated = (req, res, next)=> {
  // Check that the request has the JWT in the authorization header
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({
            error: null,
            msg: 'You have to login first before you can access your lists.',
            data: null
        });
    }
    // Verify that the JWT is created using our server secret and that it hasn't expired yet
    jwt.verify(token, req.app.get('secret'), (err, decodedToken)=> {
        if (err) {
            return res.status(401).json({
                error: err,
                msg: 'Login timed out, please login again.',
                data: null
            });
        }
        req.decodedToken = decodedToken;
        next();
    });
}

var isNotAuthenticated = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        next();
    } 
    else {
        jwt.verify(token, req.app.get('secret'), (err, decodedToken) => {
            if (!err) {
                return res.status(401).json({
                    error: err,
                    msg: 'You are already logged in.',
                    data: null
                });
            }
            next();
        });
    }
}


// user routes
router.post('/user/register', isNotAuthenticated, userCtrl.register);
router.post('/user/login', isNotAuthenticated, userCtrl.login);


module.exports = router;