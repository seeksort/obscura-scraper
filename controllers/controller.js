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


// Create - Scrape articles to DB
router.get('/scrape/:location', function (req, res) {
    var requestUrl = 'http://www.atlasobscura.com/things-to-do/' + req.params.location + '/places?sort=recent';
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

// Read - Articles
router.get('/find/:location', function (req, res) {
    // create a regex with the location name that ignores case and will find all matches, then plug into Mongoose
    var query = new RegExp('.*' + req.params.location, 'gi');
    Article.find({'location': {$regex: query}}, 'title', function(err, docs) {
        if (docs === null) {
            res.redirect('/scrape/:' + req.params.location);
        }
        else {
            res.json(docs);
        }
    });
});

// Read - Article comments

// Create - Article comment

// Delete - Article comment


module.exports = router;