const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstname : {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String
    },
    googleId :{
        type : String
    },
    readLater:[{
        type : String
    }]
});

const User = mongoose.model('User' , UserSchema);

module.exports = User;