var 
    express = require('express'),
    mongoose = require('mongoose'),
    exphbs = require('express-handlebars'),
    bodyParser = require('body-parser');

var app = express();
var PORT = process.env.PORT || 3000;

// make public files available
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


// Start MongoDB & test connection
mongoose.connect('mongodb://localhost/obscura_db');
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// Grab routing
var routes = require('./controllers/controller.js');
app.use('/', routes);

// Start App
app.listen(PORT, function() {
    console.log('Server now listening on port ' + PORT);
});