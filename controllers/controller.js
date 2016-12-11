var
    express = require('express'),
    mongoose = require('mongoose'),
    cheerio = require('cheerio'),
    request = require('request'),
    Promise = require('bluebird'),
    moment = require('moment');

mongoose.Promise = Promise;

var
    router = express.Router(),
    Article = require('./../models/Article.js'),
    Comment = require('./../models/Comment.js');

var ObjectId = require('mongoose').Types.ObjectId;

// Start Mongoose & test connection
var databaseUri = 'mongodb://localhost/obscura_db';

if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
} 
else {
    mongoose.connect(databaseUri);
}

var db = mongoose.connection;

db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

db.once("open", function() {
    console.log("Mongoose connection successful.");
});

// Mongoose models
var Article = require('./../models/Article.js');
var Comment = require('./../models/Comment.js');


// Initial route
router.get('/', function(req, res) {
    res.send('./../public/index.html')
})

// Create - Scrape articles to DB
router.get('/scrape', function(req, res) {
    var locations = ['texas', 'new-mexico', 'louisiana', 'arizona', 'california'];
    locations.forEach(function(locationName) {
        Article.find({ 'location': locationName }, function(err, docs) {
            if (docs.length === 0) {
                var requestUrl = 'http://www.atlasobscura.com/things-to-do/' + locationName + '/places?sort=recent';
                request(requestUrl, function(error, response, html) {
                    if (error) {
                        console.log('Controller.js - scrape error occurred: ' + error);
                    } else {
                        var $ = cheerio.load(html);
                        var eachCounter = 0;
                        $('.content-card-text').each(function(i, element) {
                            var articleObj = new Article();
                            articleObj.title = $(element).children('.content-card-title').text();
                            articleObj.location = $(element).children('.place-card-location').text();
                            articleObj.slug = $(element).children('.content-card-subtitle').text();
                            articleObj.url = 'http://www.atlasobscura.com' + $(element).parent('a').attr('href');
                            articleObj.img = $(element).prev('figure').children().attr('data-src');
                            Article.findOne({ 'title': articleObj.title }, 'title', function(err, doc) {
                                if (doc === null) {
                                    articleObj.save();
                                }
                            });
                        });
                    }
                });
            }
        })
    })
    res.redirect('/');
});

// Read - Get Articles
router.get('/find/:location', function(req, res) {
    // create a regex with the location name that ignores case and will find all matches, then plug into Mongoose
    var query = new RegExp('.*' + req.params.location.split('-').join(' '), 'gi');
    Article.find({ 'location': { $regex: query } }, function(err, docs) {
        if (docs.length === 0) {
            res.redirect('/scrape/' + req.params.location);
        } else {
            res.json(docs);
        }
    });
});

// Read - Article comments
router.get('/comments/:articleid', function(req, res) {
    Article.findOne({ '_id': req.params.articleid })
        .populate('comment')
        .exec(function(err, doc) {
            var responseArr = [];
            doc.comments.forEach(function(commentId) {
                var newObj = { "_id": ObjectId(commentId.toString()) };
                responseArr.push(newObj);
            });
            if (responseArr.length > 0) {
                Comment.find({
                    "$or": responseArr
                }, function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.json(result);
                    }
                });
            } else {
                res.end();
            }
        })
})

// Create - Article comment
router.post('/comments/:articleid/submit', function(req, res) {
    var newComment = new Comment({
        commenter_name: req.body.commenter_name,
        comment_title: req.body.comment_title,
        body: req.body.body,
        date: moment().format('dddd, MMMM DD YYYY')
    });
    newComment.save(function(err, commentDoc) {
        if (err) {
            console.log(err);
        } else {
            var query = { '_id': ObjectId(req.params.articleid) };
            var update = {
                $push: { 'comments': commentDoc._id }
            }
            Article.findOneAndUpdate(query, update, { new: true }, function(error, doc) {
                if (error) {
                    console.log(error);
                } else {
                    res.send(doc);
                }
            })
        }
    })
})

// Delete - Article comment
router.delete('/comments/delete/:commentid', function(req, res) {
    var commentIdQuery = req.params.commentid;
    var query = { '_id': ObjectId(commentIdQuery) }
    Comment.remove(query, function(err) {
        if (err) {
            console.log(err);
        }
    })
    var articleQuery = { 'comments': { $elemMatch: { $eq: ObjectId(commentIdQuery) } } };
    var commentRemove = { $pull: { 'comments': ObjectId(commentIdQuery) } }
    Article.findOneAndUpdate(articleQuery, commentRemove, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log(doc)
            res.send('Deleted from Article-comments collection');
        }
    })
})


module.exports = router;
