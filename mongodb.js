const mongoose = require('mongoose');
const config = require('./Config');
const dbUrl = config.MongoURI;

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
var gracefulShutdown = (callback)=> {
    mongoose.connection.close((err)=> {
        callback(err);
    });
};

// For nodemon restarts
process.once('SIGUSR2', ()=> {
    gracefulShutdown((err)=> {
        if (err) {
            console.error(err);
        } 
        else {
            console.log('nodemon restart');
        }
            process.kill(process.pid, 'SIGUSR2');
    });
});

// For app termination
process.on('SIGINT', ()=> {
    gracefulShutdown((err)=> {
        if (err) {
            console.error(err);
        }
        else {
            console.log('App termination (SIGINT)');
        }
            process.exit(0);
    });
});

// For Heroku app termination
process.on('SIGTERM', ()=> {
    gracefulShutdown((err)=> {
        if (err) {
            console.error(err);
        } 
        else {
            console.log('App termination (SIGTERM)');
        }
            process.exit(0);
    });
});

//connect to Mongo
mongoose.set('useCreateIndex', true)
mongoose.connect(dbUrl,{useUnifiedTopology: true,useNewUrlParser: true,})
.then(() => console.log('MongoDB Connected......'))
.catch( err=>{
    if (err) {
        console.log(err);
    } 
    else {
        console.log('Could not connect to mongoDB');
    }
    process.exit(1);
});
