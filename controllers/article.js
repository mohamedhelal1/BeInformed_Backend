const Article = require('../models/Article');
const User = require('../models/User');
module.exports.authgetarticles = (req,res,next)=>{
    if( !req.params.page)
        return res.status(422).json({
            err: null,
            message:
                'page is not valid',
            data: null
        });
    Article.paginate({},{
        page: req.params.page,
        limit: 10,
        collation: {
          locale: 'en'
        },
        sort:{ date: -1 }
    },
    (err,result)=>{
        if(err) {
            return next(err);
        }
        User.findById({_id:req.decodedToken.user._id},(err,user)=>{
            if(err)
                return next(err);
            const articles = result.docs;
            for(var index in articles){
                const article = articles[index]._doc;
                const liked = articles[index].likes.includes(user._id);
                const readlater = user.readLater.includes(articles[index]._id);
                articles[index]= {...article,liked,readlater};
            }
    
            const pages = result.totalPages;
            res.status(200).json({
                err: null,
                message: 'Articles retrieved successfully',
                data: {articles,pages}
            });
        });
    });
}
module.exports.getarticles = (req,res,next)=>{
    if( !req.params.page)
        return res.status(422).json({
            err: null,
            message:
                'page is not valid',
            data: null
        });
    Article.paginate({},{
        page: req.params.page,
        limit: 10,
        collation: {
          locale: 'en'
        },
        sort:{ date: -1 }
    },
    (err,result)=>{
        if(err)
            return next(err);
        res.status(200).json({
            err: null,
            message: 'Articles retrieved successfully',
            data: {
                    articles : result.docs,
                    pages : result.totalPages
            }
        });
    });
}

module.exports.liketoggle = (req,res,next)=>{
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
        if(!article.likes.includes(req.decodedToken.user._id)){
            Article.updateOne({_id:article._id},{$push: {likes:req.decodedToken.user._id}},
                (err)=>{
                    if(err)
                        return next(err);
                    return res.status(200).json({
                        err: null,
                        message: 'Article liked',
                        data: null
                    });
                }
            );
        }
        else{
              Article.updateOne({_id:article._id},{$pull: {likes:req.decodedToken.user._id}},
                (err)=>{
                    if(err)
                        return next(err);
                    return res.status(200).json({
                        err: null,
                        message: 'Article unliked',
                        data: null
                    });
                }
            );
        }
        
    });
}



