const User = require('../models/User');
const bcrypt = require('bcryptjs');
const config = require('../Config');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(config.clientID);
const Article = require('../models/Article');
//Register
module.exports.register = (req,res,next) => {
    const { firstname,lastname, email, password, confirmPassword} = req.body;
    //check required fields
    if(!firstname||!lastname || !email || !password || !confirmPassword){
        return res.status(422).json({
            err: null,
            message:'firstname, lastname, email, password and confirmPassword are required fields.',
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
            message:
                'one of the fields is not valid',
            data: null
        });
     }
    if(!config.EMAIL_REGEX.test(email)){
        return res.status(422).json({
            err: null,
            message:'Incorrect email format',
            data: null
        });
    }
    if(password !== confirmPassword){
        return res.status(422).json({
            err: null,
            message: 'password and confirmPassword do not match.',
            data: null
        });
    }
    if(password.length < 6){
        return res.status(422).json({
            err: null,
            message: 'Password must be of length 6 characters or more.',
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
                message:
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
                        message: 'Registration successful, you can now login to your account.',
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
            message:'email and password are required fields.',
            data: null
        });
    }
    const valid = typeof email === 'string'&& typeof password === 'string';
       
    if(!valid){
        return res.status(422).json({
            err: null,
            message:
                'one of the fields is not valid',
            data: null
        });
     }
    if(!config.EMAIL_REGEX.test(email)){
        return res.status(422).json({
            err: null,
            message:'Incorrect email format',
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
                message: 'this email is not registered',
                data: null
            });
        }
        if(!user.password){
            return res.status(401).json({
                err: null,
                message: 'please sign in with your google account and create a password',
                data: null
            });
        }
        //hash password
        bcrypt.compare(password , user.password,(err,isMatch)=>{
            if(err) return next(err);
            if(!isMatch){
                return res.status(401).json({ 
                    err: null,
                    message: 'Password is incorrect.', 
                    data: null 
                });
            }
            var token = jwt.sign({user: user.toObject()},req.app.get('secret'),{expiresIn: '12h'});
            res.status(200).json({ err: null, message: 'logged in', data: {token} });
        });
    });
}

module.exports.googlelogin=(req,res,next)=>{
    client.verifyIdToken({
        idToken: req.body.id_token,
        audience: config.clientID
    },
    (err,loginTicket)=>{
        if(err) {
        console.log(err);
            return next(err)
        };
        const { email, sub ,given_name, family_name} = loginTicket.payload;
        User.findOne({ googleId: sub}, (err, user) => {
            if(err)
                return next(err);
            if(user){
                var token = jwt.sign({user: user.toObject()},req.app.get('secret'),{expiresIn: '12h'});
                res.status(200).json({ err: null, message: 'logged in', data: {token} });
            }
            else{
                const newUser = new User({
                    firstname : given_name,
                    lastname : family_name,
                    email : email,
                    googleId : sub,
                    readLater : []
                });
                // add user to Database
                User.create(newUser,(err,user) =>{
                    if (err)
                        return next(err);
                    var token = jwt.sign({user: user.toObject()},req.app.get('secret'),{expiresIn: '12h'});
                    return res.status(201).json({ err: null, message: 'logged in', data: {token} });
                });
            }
        });
    });
}
module.exports.togglereadlater= (req,res,next)=>{
    if( !req.params.articleId)
        return res.status(422).json({
            err: null,
            message:
                'there must be an articleId',
            data: null
    });
    Article.findById({_id:req.params.articleId}).exec((err,article)=>{
        if(err)
            return next(err);
        if(!article)
            return res.status(404).json({
                err: null,
                message:
                    'article not found',
                data: null
             });
        User.findById({_id:req.decodedToken.user._id},(err,user)=>{
            if(err) 
                return next(err)
            if(!user.readLater.includes(article._id)){
                User.updateOne({_id:req.decodedToken.user._id},{$push: {readLater:article._id}},
                    (err)=>{
                        if(err)
                            return next(err);
                        return res.status(200).json({
                            err: null,
                            message: 'Article added',
                            data: null
                        });
                    }
                );
            }
            else{
                User.updateOne({_id:req.decodedToken.user._id},{$pull: {readLater:article._id}},
                    (err)=>{
                        if(err)
                            return next(err);
                        return res.status(200).json({
                            err: null,
                            message: 'Article removed',
                            data: null
                        });
                    }
                );
            }
        }); 
    });
}

module.exports.getreadlater = (req,res,next)=>{
    User.findById({_id:req.decodedToken.user._id},(err,user)=>{
        if(err)
            return next(err);
        Article.find({_id:{$in:user.readLater}},(err,articles)=>{
            if(err)
                return next(err);
                for(var index in articles){
                    const article = articles[index]._doc;
                    const liked = articles[index].likes.includes(user._id);
                    const readlater = true;
                    articles[index]= {...article,liked,readlater};
                }
            return res.status(200).json({
                err: null,
                message: 'Articles retrieved successfully',
                data: articles
            });
        });
    });
}
