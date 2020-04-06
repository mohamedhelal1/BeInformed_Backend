const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ArticleSchema = new mongoose.Schema({
    sourceName : {
        type : String,
        required : true
    },
    title : {
        type : String,
        required : true
    },
    url : {
        type : String,
        required : true,
        unique : true
    },
    description:{
        type : String,
        required : true,
    },
    urlToImage :{
        type : String
    },
    date:{
        type: Date,
        required : true
    },
    likes:[{
        type: String
    }]
});
ArticleSchema.plugin(mongoosePaginate);
const Article = mongoose.model('Article' , ArticleSchema);

module.exports = Article;