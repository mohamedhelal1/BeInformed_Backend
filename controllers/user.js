const User = require('../models/User');
const bcrypt = require('bcryptjs');
const EMAIL_REGEX = require('../Config').EMAIL_REGEX;
const passport = require('passport');
const jwt = require('jsonwebtoken');
//Register
module.exports.register = (req,res,next) => {
    const { firstname,lastname, email, password, confirmPassword} = req.body;
    //check required fields
    if(!firstname||!lastname || !email || !password || !confirmPassword){
        return res.status(422).json({
            err: null,
            msg:'firstname, lastname, email, password and confirmPassword are required fields.',
            data: null
        });
    }
    const valid = typeof firstname === 'string' &&
                typeof lastname === 'string' &&
                typeof email === 'string'&& typeof password === 'string'&&
                typeof confirmPassword === 'string';
       
    if(!valid){
        return res.status(422).json({
            err: null,
            msg:
                'one of the fields is not valid',
            data: null
        });
     }
    if(!EMAIL_REGEX.test(email)){
        return res.status(422).json({
            err: null,
            msg:'Incorrect email format',
            data: null
        });
    }
    if(password !== confirmPassword){
        return res.status(422).json({
            err: null,
            msg: 'password and confirmPassword does not match.',
            data: null
        });
    }
    if(password.length < 6){
        return res.status(422).json({
            err: null,
            msg: 'Password must be of length 6 characters or more.',
            data: null
        });
    }

    // if user already exists
    User.findOne({email :email}).exec((err,user)=>{
        if(err) 
            return next(err);
        if(user){
            return res.status(422).json({
                err: null,
                msg:
                  'A user with this email address already exists, please login.',
                data: null
            });
        }
        
        //hash password
        bcrypt.genSalt(10,(err,salt) =>{ 
            if(err)
                return next(err);
            bcrypt.hash(password,salt,(err,hash)=>{
                if(err)
                    return next(err);
                const newUser = new User({
                    firstname : firstname,
                    lastname : lastname,
                    email : email,
                    password : hash,
                    readLater : []
                });
                // add user to Database
                User.create(newUser,(err,user) =>{
                    if (err)
                        return next(err);
                    return res.status(201).json({
                        err: null,
                        msg: 'Registration successful, you can now login to your account.',
                        data: user.toObject()
                    });
                });
            });
        });
    });
}


//Login
module.exports.login = (req,res,next) => {
    const { email, password} = req.body;
    //check required fields
    if(!email || !password){
        return res.status(422).json({
            err: null,
            msg:'email and password are required fields.',
            data: null
        });
    }
    const valid = typeof email === 'string'&& typeof password === 'string';
       
    if(!valid){
        return res.status(422).json({
            err: null,
            msg:
                'one of the fields is not valid',
            data: null
        });
     }
    if(!EMAIL_REGEX.test(email)){
        return res.status(422).json({
            err: null,
            msg:'Incorrect email format',
            data: null
        });
    }
    // if user already exists
    User.findOne({email :email}).exec((err,user)=>{
        if(err) 
            return next(err);
        if(!user){
            return res.status(404).json({
                err: null,
                msg: 'this email is not registered',
                data: null
            });
        }
        
        //hash password
        bcrypt.compare(password , user.password,(err,isMatch)=>{
            if(err) return next(err);
            if(!isMatch){
                return res.status(401).json({ 
                    err: null,
                    msg: 'Password is incorrect.', 
                    data: null 
                });
            }
            var token = jwt.sign({user: user.toObject()},req.app.get('secret'),{expiresIn: '12h'});
            res.status(200).json({ err: null, msg: 'logged in', data: token });
        });
    });
}