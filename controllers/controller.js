var 
    express = require('express'),
    mongoose = require('mongoose'),
    cheerio = require('cheerio'),
    request = require('request'),
    Promise = require('bluebird');

mongoose.Promise = Promise;

var 
    router = express.Router(),
    Article = require('./../models/Article.js'),
    Comment = require('./../models/Comment.js');

var ObjectId = require('mongoose').Types.ObjectId;

// Start Mongoose & test connection
mongoose.connect('mongodb://localhost/obscura_db');
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
router.get('/scrape/:location', function(req, res) {
    var requestUrl = 'http://www.atlasobscura.com/things-to-do/' + req.params.location + '/places?sort=recent';
    console.log(requestUrl)
    request(requestUrl, function(error, response, html){
        if (error) {
            console.log ('Controller.js - scrape error occurred: ' + error);
        }
        else {
            var $ = cheerio.load(html);
            var eachCounter = 0;
            $('.content-card-text').each(function(i, element){
                var articleObj = new Article();
                articleObj.title = $(element).children('.content-card-title').text();
                articleObj.location = $(element).children('.place-card-location').text();
                articleObj.slug = $(element).children('.content-card-subtitle').text();
                articleObj.url = $(element).parent('h3').attr('href');
                Article.findOne({'title': articleObj.title}, 'title', function(err, doc){
                    if (doc === null) {
                        articleObj.save();
                        eachCounter++;
                        console.log('# articles scraped: ' + eachCounter)
                    }
                });
            });
        }
        res.redirect('/');
    });
});

// Read - Get Articles
router.get('/find/:location', function(req, res) {
    // create a regex with the location name that ignores case and will find all matches, then plug into Mongoose
    var query = new RegExp('.*' + req.params.location, 'gi');
    console.log(query);
    Article.find({'location': {$regex: query}}, 'title', function(err, docs) {
        if (docs.length === 0) {
            res.redirect('/scrape/' + req.params.location);
        }
        else {
            res.json(docs);
        }
    });
});

// Read - Article comments
router.get('/comments/:articleid', function(req, res) {
    Article.findOne({'_id': req.params.articleid})
    .populate('comment')
    .exec(function(err, doc){
        if (err) {
            console.log(err);
        }
        else {
            console.log(doc.comments)
            res.json(doc)
        }
    })
    
})

// Create - Article comment
router.post('/comments/:articleid/submit', function(req, res) {
    var newComment = new Comment({
        comment_title: "I can't go for that",
        body: "no can do",
        date: "2016-12-6"
    });

    newComment.save(function(err, commentDoc) {
        if (err) {
            console.log(err);
        }
        else { 
            var query = {'_id': ObjectId(req.params.articleid)};
            var update = {
                $push: {'comments': commentDoc._id}
            }
            Article.findOneAndUpdate(query, update, {new: true}, function(error, doc){
                if (error) {
                    console.log(error);
                }
                else {
                    res.send(doc);
                }
            })
        }
    })
})

// Delete - Article comment
router.delete('/comments/delete/:commentid', function(req, res) {
    var query = {'_id': ObjectId(req.params.commentid)}
    Comment.remove(query, function(err) {
        if (err) {
            console.log('error occurred')
            console.log(err);
        }
        else {
            res.send('Deleted');
        }
    })
})


module.exports = router;