// import npm modules
var 
    express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan');

var app = express();
var PORT = process.env.PORT || 3000;

// start logger and make public files available
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Grab routing
var routes = require('./controllers/controller.js');
app.use('/', routes);

// Start App
app.listen(PORT, function() {
    console.log('Server now listening on port ' + PORT);
});