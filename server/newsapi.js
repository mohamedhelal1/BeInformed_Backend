const cron = require("node-cron");
const config = require('../Config');
const Article = require('../models/Article');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(config.NewsAPIKey);

cron.schedule('*/10 * * * *', ()=> {
    console.log('---------------------');
    console.log('Requesting news');
    newsapi.v2.topHeadlines({
        q: 'corona',
        language: 'en',
        pageSize: 100,
        sortBy: 'publishedAt',
    }).then(response => {
        const articles = response.articles;
        articles.forEach(article =>{
            const{source,title,url,urlToImage,publishedAt,description}=article;
            Article.findOne({url:url}).exec((err,article)=>{
                if(err){
                    console.log(err.message);
                }
                else{
                    if(!article){
                        const newArticle = {
                            sourceName : source.name,
                            title : title,
                            url : url,
                            urlToImage : urlToImage,
                            description : description,
                            date:Date.parse(publishedAt),
                            likes:[]
                        };
                        Article.create(newArticle,(err,article)=>{
                            if(err){
                                console.log(err.message);
                            }
                        });
                    }
                }
            });
        });
    });
});