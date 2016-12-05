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


// Scrape articles to DB
router.get('/scrape/:location', function (req, res) {
    var requestUrl = 'http://www.atlasobscura.com/things-to-do/' + req.params.location + '/places?sort=recent';
    request(requestUrl, function(error, response, html){
        if (error) {
            console.log ('Controller.js - scrape error occurred: ' + error);
        }
        else {
            var $ = cheerio.load(html);
            var resultsArr = [];
            var eachCounter = 0;
            $('.content-card-text').each(function(i, element){
                var articleObj = new Article();
                articleObj.title = $(element).children('.content-card-title').text();
                articleObj.location = $(element).children('.place-card-location').text();
                articleObj.slug = $(element).children('.content-card-subtitle').text();
                articleObj.url = $(element).parent('h3').attr('href');
                Article.findOne({'title': articleObj.title}, 'title', function(dbErr, result){
                    if (result === null) {
                        articleObj.save();
                        eachCounter++;
                        console.log('# articles scraped: ' + eachCounter)
                    }
                });
            });
        }
        res.send(html);
    });
});

// Read - Articles
router.get('/', function (req, res) {
    res.send('<h1>testing</h1>');
});

// Read - Article comments

// Create - Article comment

// Delete - Article comment


module.exports = router;