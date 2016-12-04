var 
    express = require('express'),
    mongoose = require('mongoose'),
    cheerio = require('cheerio'),
    request = require('request');

var 
    router = express.Router(),
    Article = require('./../models/Article.js'),
    Comment = require('./../models/Comment.js');

// Scrape articles to DB

// Read - Articles
router.get('/', function (req, res) {
    res.send('<h1>testing</h1>');
});

// Read - Article comments

// Create - Article comment

// Delete - Article comment


module.exports = router;