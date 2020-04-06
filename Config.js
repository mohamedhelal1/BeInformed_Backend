const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
module.exports = {
    MongoURI : 'mongodb+srv://Helal:1234@cluster0-rdt2n.mongodb.net/test?retryWrites=true&w=majority',
    EMAIL_REGEX : EMAIL_REGEX,
    FRONTEND_URI: process.env.FRONTEND_URI || 'http://localhost:4200/',
    SECRET: '32876qihsdh76@&#!742(*#HG&#28702y&##@^!()(&^#))jhscbd',
    GoogleCLientId:'808044659947-0et235njnqqkbj84o4msiapnofdj3a86.apps.googleusercontent.com',
    GoogleCLientSecret:'hscb_noHp_zxjuLhf_ZFNRSi',
    NewsAPIKey: '1d34c39073fe48f6a3965d21b0c7c0db'
}